import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, X, XCircle } from "lucide-react";

export type TreeOption = {
  label: string;
  value: string;
  children?: { label: string; value: string }[];
};

type Props = {
  label: string;
  options: TreeOption[];
  value: string[];
  onChange: (value: string[]) => void;
  isActive?: boolean;
  allowedValues?: Set<string> | null;
};

function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
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
      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
    />
  );
}

export default function TreeSelectDropdown({
  label,
  options,
  value,
  onChange,
  isActive = false,
  allowedValues = null,
}: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  // Auto-expand parents that have a selection
  useEffect(() => {
    const toExpand = new Set<string>();
    options.forEach((opt) => {
      if (!opt.children?.length) return;
      if (
        value.includes(opt.value) ||
        opt.children.some((c) => value.includes(c.value))
      ) {
        toExpand.add(opt.value);
      }
    });
    setExpanded(toExpand);
  }, [value.join(","), options.length]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── helpers ── */

  const childSlugsOf = (parentValue: string) =>
    options.find((o) => o.value === parentValue)?.children?.map((c) => c.value) ?? [];

  const getLabelFor = (val: string): string => {
    for (const opt of options) {
      if (opt.value === val) return opt.label;
      for (const c of opt.children ?? []) {
        if (c.value === val) return c.label;
      }
    }
    return val;
  };

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

  /* ── toggle handlers ── */

  const toggleParent = (parentValue: string) => {
    const children = childSlugsOf(parentValue);
    const anySelected =
      value.includes(parentValue) || children.some((s) => value.includes(s));

    if (anySelected) {
      onChange(value.filter((v) => v !== parentValue && !children.includes(v)));
    } else {
      // Select parent slug (backend expands to all its children)
      onChange([...value.filter((v) => !children.includes(v)), parentValue]);
      // Auto-expand to show sub-areas
      setExpanded((prev) => new Set([...prev, parentValue]));
    }
  };

  const toggleChild = (parentValue: string, childValue: string) => {
    const children = childSlugsOf(parentValue);
    if (value.includes(childValue)) {
      onChange(value.filter((v) => v !== childValue));
    } else {
      // Remove parent slug if it was selected (switching to specific children)
      const base = value.filter((v) => v !== parentValue && v !== childValue);
      const newValue = [...base, childValue];
      // If all children are now selected, replace with parent
      const allSelected = children.every((s) => newValue.includes(s));
      onChange(allSelected ? [...base.filter((v) => !children.includes(v)), parentValue] : newValue);
    }
  };

  const toggleLeaf = (val: string) => {
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val]);
  };

  const removeChip = (val: string) => {
    const children = childSlugsOf(val);
    onChange(value.filter((v) => v !== val && !children.includes(v)));
  };

  const toggleExpand = (parentValue: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(parentValue) ? next.delete(parentValue) : next.add(parentValue);
      return next;
    });
  };

  return (
    <div ref={ref} className="relative text-xs">
      <label className="font-semibold mb-2 block text-sm">{label}</label>

      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className={`w-full flex flex-wrap gap-1 items-center min-h-[42px] py-2 px-3 bg-white rounded-lg border cursor-pointer transition
          ${isActive ? "border-brand-dark ring-1 ring-brand-dark" : "border-gray-300"}`}
      >
        {value.length > 0 ? (
          <>
            {value.map((v) => (
              <span
                key={v}
                className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium"
              >
                {getLabelFor(v)}
                <button
                  onClick={(e) => { e.stopPropagation(); removeChip(v); }}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={(e) => { e.stopPropagation(); onChange([]); }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="text-gray-400 text-sm">Pilih {label}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${open ? "rotate-180" : ""} ${value.length > 0 ? "hidden" : ""}`} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => {
            const hasChildren = (opt.children?.length ?? 0) > 0;
            const isExpanded = expanded.has(opt.value);
            const isDisabled = allowedValues !== null && !allowedValues.has(opt.value);

            return (
              <div key={opt.value}>
                {/* Parent row */}
                <label className={`flex items-center gap-2 px-4 py-2.5 select-none ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}>
                  {hasChildren ? (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleExpand(opt.value); }}
                      className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                    >
                      {isExpanded
                        ? <ChevronDown className="w-3.5 h-3.5" />
                        : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    <span className="w-3.5 flex-shrink-0" />
                  )}

                  {hasChildren ? (
                    <IndeterminateCheckbox
                      checked={isParentChecked(opt.value)}
                      indeterminate={isParentIndeterminate(opt.value)}
                      onChange={() => !isDisabled && toggleParent(opt.value)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={value.includes(opt.value)}
                      onChange={() => !isDisabled && toggleLeaf(opt.value)}
                      disabled={isDisabled}
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue cursor-pointer disabled:cursor-not-allowed"
                    />
                  )}

                  <span className="font-medium text-gray-800">{opt.label}</span>
                </label>

                {/* Children rows */}
                {hasChildren && isExpanded && opt.children!.map((child) => {
                  const childDisabled = allowedValues !== null && !allowedValues.has(child.value);
                  return (
                    <label
                      key={child.value}
                      className={`flex items-center gap-2 px-4 py-2 pl-10 select-none border-l-2 border-gray-100 ml-4 ${childDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}
                    >
                      <span className="w-3.5 flex-shrink-0" />
                      <input
                        type="checkbox"
                        checked={value.includes(child.value) || value.includes(opt.value)}
                        onChange={() => !childDisabled && toggleChild(opt.value, child.value)}
                        disabled={childDisabled}
                        className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-gray-600">{child.label}</span>
                    </label>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
