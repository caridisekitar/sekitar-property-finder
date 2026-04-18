import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LockedOverlay from "@/components/LockedOverlay";
import SubscriptionModal from "@/components/SubscriptionModal";
import { secureGet } from "@/lib/secureGet";

type LocationOption = {
  label: string;
  value: string;
  children: { label: string; value: string }[];
};

type PriceOption = {
  label: string;
  min: number;
  max?: number;
};

interface FilterMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onApply?: (params: {
    lokasi?: string;
    tipe?: string;
    min_price?: number;
    max_price?: number;
  }) => void;
  initialFilters?: {
    lokasi?: string;
    tipe?: string;
    min_price?: string;
    max_price?: string;
  };
}

const kostTypeOptions = [
  { label: "Kos Putri", value: "Putri" },
  { label: "Kos Putra", value: "Putra" },
  { label: "Kos Campur", value: "Campur" },
  { label: "Kos Campur Bebas", value: "Campur Bebas" },
  { label: "Jendela Luar", value: "Jendela Luar" },
  { label: "Kamar Mandi Dalam", value: "Kamar Mandi Dalam" },
];

const priceOptions: PriceOption[] = [
  { label: "1 - 2 jt", min: 1_000_000, max: 2_000_000 },
  { label: "2 - 3 jt", min: 2_000_000, max: 3_000_000 },
  { label: "3 - 5 jt", min: 3_000_000, max: 5_000_000 },
  { label: "> 5 jt", min: 5_000_000 },
];

const parsePriceOption = (min?: string, max?: string): PriceOption | null => {
  if (!min) return null;
  const minNum = parseInt(min);
  const maxNum = max ? parseInt(max) : undefined;
  return priceOptions.find((p) => p.min === minNum && p.max === maxNum) ?? null;
};

/* ─────────────────────────────────────────────
   Indeterminate checkbox (same as TreeSelectDropdown)
───────────────────────────────────────────── */
function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  disabled,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="w-4 h-4 rounded border-gray-300 text-brand-dark focus:ring-brand-dark cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
    />
  );
}

/* ─────────────────────────────────────────────
   Inline tree location list
───────────────────────────────────────────── */
function LocationTree({
  options,
  value,
  onChange,
  allowedSlugs,
}: {
  options: LocationOption[];
  value: string[];
  onChange: (v: string[]) => void;
  allowedSlugs: Set<string> | null;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Auto-expand parents that have active selections
  useEffect(() => {
    const toExpand = new Set<string>();
    options.forEach((opt) => {
      if (!opt.children.length) return;
      if (value.includes(opt.value) || opt.children.some((c) => value.includes(c.value))) {
        toExpand.add(opt.value);
      }
    });
    setExpanded(toExpand);
  }, [value.join(","), options.length]);

  const childSlugsOf = (parentValue: string) =>
    options.find((o) => o.value === parentValue)?.children.map((c) => c.value) ?? [];

  const isParentChecked = (parentValue: string) => {
    const children = childSlugsOf(parentValue);
    return (
      value.includes(parentValue) ||
      (children.length > 0 && children.every((s) => value.includes(s)))
    );
  };

  const isParentIndeterminate = (parentValue: string) => {
    const children = childSlugsOf(parentValue);
    return (
      !value.includes(parentValue) &&
      children.length > 0 &&
      children.some((s) => value.includes(s))
    );
  };

  const toggleParent = (parentValue: string) => {
    const children = childSlugsOf(parentValue);
    const anySelected = value.includes(parentValue) || children.some((s) => value.includes(s));
    if (anySelected) {
      onChange(value.filter((v) => v !== parentValue && !children.includes(v)));
    } else {
      onChange([...value.filter((v) => !children.includes(v)), parentValue]);
      setExpanded((prev) => new Set([...prev, parentValue]));
    }
  };

  const toggleChild = (parentValue: string, childValue: string) => {
    const children = childSlugsOf(parentValue);
    if (value.includes(childValue)) {
      onChange(value.filter((v) => v !== childValue));
    } else {
      const base = value.filter((v) => v !== parentValue && v !== childValue);
      const next = [...base, childValue];
      const allSelected = children.every((s) => next.includes(s));
      onChange(allSelected ? [...base.filter((v) => !children.includes(v)), parentValue] : next);
    }
  };

  const toggleLeaf = (val: string) => {
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val]);
  };

  const toggleExpand = (parentValue: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(parentValue) ? next.delete(parentValue) : next.add(parentValue);
      return next;
    });
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {options.map((opt, idx) => {
        const hasChildren = opt.children.length > 0;
        const isExpanded = expanded.has(opt.value);
        const isDisabled = allowedSlugs !== null && !allowedSlugs.has(opt.value);

        return (
          <div key={opt.value} className={idx > 0 ? "border-t border-gray-100" : ""}>
            {/* Parent row */}
            <div
              className={`flex items-center gap-3 px-4 py-3 ${
                isDisabled ? "opacity-40" : "active:bg-gray-50"
              }`}
            >
              {/* Expand toggle */}
              {hasChildren ? (
                <button
                  onClick={() => !isDisabled && toggleExpand(opt.value)}
                  className="text-gray-400 shrink-0"
                  disabled={isDisabled}
                >
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4" />
                    : <ChevronRight className="w-4 h-4" />}
                </button>
              ) : (
                <span className="w-4 shrink-0" />
              )}

              {/* Checkbox */}
              {hasChildren ? (
                <IndeterminateCheckbox
                  checked={isParentChecked(opt.value)}
                  indeterminate={isParentIndeterminate(opt.value)}
                  onChange={() => !isDisabled && toggleParent(opt.value)}
                  disabled={isDisabled}
                />
              ) : (
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  onChange={() => !isDisabled && toggleLeaf(opt.value)}
                  disabled={isDisabled}
                  className="w-4 h-4 rounded border-gray-300 text-brand-dark focus:ring-brand-dark cursor-pointer disabled:cursor-not-allowed"
                />
              )}

              {/* Label — tapping label also triggers toggle */}
              <span
                className={`flex-1 text-sm font-medium ${isDisabled ? "text-gray-400" : "text-gray-800"}`}
                onClick={() => {
                  if (isDisabled) return;
                  hasChildren ? toggleParent(opt.value) : toggleLeaf(opt.value);
                }}
              >
                {opt.label}
              </span>

              {/* Subscription badge for disabled */}
              {isDisabled && (
                <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 shrink-0">
                  Upgrade
                </span>
              )}
            </div>

            {/* Children rows */}
            {hasChildren && isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50">
                {opt.children.map((child) => {
                  const childDisabled = allowedSlugs !== null && !allowedSlugs.has(child.value);
                  return (
                    <div
                      key={child.value}
                      className={`flex items-center gap-3 pl-10 pr-4 py-2.5 border-t border-gray-100 first:border-t-0 ${
                        childDisabled ? "opacity-40" : "active:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={value.includes(child.value) || value.includes(opt.value)}
                        onChange={() => !childDisabled && toggleChild(opt.value, child.value)}
                        disabled={childDisabled}
                        className="w-4 h-4 rounded border-gray-300 text-brand-dark focus:ring-brand-dark cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span
                        className={`flex-1 text-sm ${childDisabled ? "text-gray-400" : "text-gray-600"}`}
                        onClick={() => !childDisabled && toggleChild(opt.value, child.value)}
                      >
                        {child.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main FilterMenu
───────────────────────────────────────────── */
const FilterMenu: React.FC<FilterMenuProps> = ({
  isOpen,
  setIsOpen,
  onApply,
  initialFilters,
}) => {
  const { subscription } = useAuth();

  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<PriceOption | null>(null);
  const [showLocked, setShowLocked] = useState(false);
  const [open, setOpen] = useState(false);

  const canSearch =
    subscription?.plan === "PREMIUM" || subscription?.plan === "PREMIUM_PLUS";

  useEffect(() => {
    secureGet("/locations")
      .then((res) =>
        setLocationOptions(
          (res.data ?? []).map((item: any) => ({
            label: item.name,
            value: item.slug,
            children: (item.children ?? []).map((c: any) => ({
              label: c.name,
              value: c.slug,
            })),
          }))
        )
      )
      .catch(() => {});
  }, []);

  const allowedSlugs = useMemo<Set<string> | null>(() => {
    if (!canSearch || !subscription?.locations?.length) return null;
    const subSlugs = new Set(subscription.locations);
    const allowed = new Set<string>();
    locationOptions.forEach((opt) => {
      if (subSlugs.has(opt.value)) {
        allowed.add(opt.value);
        opt.children.forEach((c) => allowed.add(c.value));
      }
    });
    return allowed;
  }, [canSearch, subscription?.locations, locationOptions]);

  // Sync state from URL when sheet opens
  useEffect(() => {
    if (!isOpen) return;
    setSelectedLocation(
      initialFilters?.lokasi ? initialFilters.lokasi.split(",").filter(Boolean) : []
    );
    setSelectedType(
      initialFilters?.tipe ? initialFilters.tipe.split(",").filter(Boolean) : []
    );
    setSelectedPrice(
      parsePriceOption(initialFilters?.min_price, initialFilters?.max_price)
    );
  }, [isOpen]);

  const toggleType = (value: string) => {
    setSelectedType((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleReset = () => {
    setSelectedLocation([]);
    setSelectedType([]);
    setSelectedPrice(null);
  };

  const handleApply = () => {
    if (!canSearch) {
      setShowLocked(true);
      return;
    }
    onApply?.({
      lokasi: selectedLocation.join(",") || undefined,
      tipe: selectedType.join(",") || undefined,
      min_price: selectedPrice?.min,
      max_price: selectedPrice?.max,
    });
    setIsOpen(false);
  };

  const activeCount =
    selectedLocation.length + selectedType.length + (selectedPrice ? 1 : 0);

  return (
    <>
      {showLocked && (
        <LockedOverlay
          message="Please subscribe to unlock search"
          onClose={() => setShowLocked(false)}
          onSubscribe={() => setOpen(true)}
        />
      )}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl transform transition-transform duration-300 flex flex-col max-h-[90vh] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Filter</h2>
            {activeCount > 0 && (
              <span className="text-xs font-bold bg-brand-dark text-white rounded-full px-2 py-0.5">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Lokasi — tree view */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Lokasi</h3>
            {locationOptions.length === 0 ? (
              <p className="text-xs text-gray-400">Memuat lokasi...</p>
            ) : (
              <LocationTree
                options={locationOptions}
                value={selectedLocation}
                onChange={setSelectedLocation}
                allowedSlugs={allowedSlugs}
              />
            )}
          </div>

          {/* Tipe Kos */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Tipe Kos</h3>
            <div className="flex flex-wrap gap-2">
              {kostTypeOptions.map((type) => {
                const isSelected = selectedType.includes(type.value);
                return (
                  <button
                    key={type.value}
                    onClick={() => toggleType(type.value)}
                    className={`px-4 py-2 text-xs rounded-full border transition
                      ${isSelected
                        ? "bg-brand-dark text-white border-brand-dark"
                        : "bg-white text-gray-700 border-gray-300 active:bg-gray-100"
                      }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Harga */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Harga</h3>
            <div className="flex flex-wrap gap-2">
              {priceOptions.map((price) => {
                const isSelected = selectedPrice?.label === price.label;
                return (
                  <button
                    key={price.label}
                    onClick={() => setSelectedPrice(isSelected ? null : price)}
                    className={`px-4 py-2 text-xs rounded-full border transition
                      ${isSelected
                        ? "bg-brand-dark text-white border-brand-dark"
                        : "bg-white text-gray-700 border-gray-300 active:bg-gray-100"
                      }`}
                  >
                    {price.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={handleReset}
            className="py-3 border border-gray-300 rounded-xl font-semibold text-sm text-gray-700 active:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="py-3 bg-brand-dark text-white rounded-xl font-semibold text-sm active:bg-gray-800"
          >
            Terapkan
          </button>
        </div>
      </div>

      <SubscriptionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FilterMenu;
