import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LockedOverlay from "@/components/LockedOverlay";
import SubscriptionModal from "@/components/SubscriptionModal";


interface FilterMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onApply?: (params: {
    lokasi: string;
    tipe: string;
    min_price?: number;
    max_price?: number;
  }) => void;
}

/* ======================
   OPTION DEFINITIONS
====================== */

type Option = {
  label: string;
  value: string;
};

type PriceOption = {
  label: string;
  min: number;
  max?: number;
};

const locationOptions: Option[] = [
  { label: "Jakarta Selatan", value: "Jakarta Selatan" },
  { label: "Jakarta Pusat", value: "Jakarta Pusat" },
  { label: "Jakarta Timur", value: "Jakarta Timur" },
  { label: "Jakarta Barat", value: "Jakarta Barat" },
  { label: "Jakarta Utara", value: "Jakarta Utara" },
  { label: "Tangerang", value: "Tangerang" },
];

const kostTypeOptions: Option[] = [
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

/* ======================
   COMPONENT
====================== */

const FilterMenu: React.FC<FilterMenuProps> = ({
  isOpen,
  setIsOpen,
  onApply,
}) => {
  const { subscription } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<PriceOption | null>(null);
  const [showLocked, setShowLocked] = useState(false);
  const [open, setOpen] = useState(false);

  /* ======================
     HELPERS
  ====================== */

  const toggleMulti = (
    value: string,
    state: string[],
    setState: (v: string[]) => void
  ) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };

  const handleReset = () => {
    setSelectedLocation([]);
    setSelectedType([]);
    setSelectedPrice(null);
  };

  const handleApply = () => {
    if (!subscription || subscription?.plan !== "PREMIUM") {
      setShowLocked(true);
      return;
    }

    const params = {
      lokasi: selectedLocation.join(","),
      tipe: selectedType.join(","),
      min_price: selectedPrice?.min,
      max_price: selectedPrice?.max,
    };

    onApply?.(params);
    setIsOpen(false);
  };

  /* ======================
     RENDER
  ====================== */

  return (
    <>
    {showLocked && (
            <LockedOverlay
              message="Please subscribe to unlock search"
              onClose={() => setShowLocked(false)}
              onSubscribe={() => setOpen(true)}
            />
          )}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filter</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 text-3xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          {/* Lokasi */}
          <div>
            <h3 className="font-semibold mb-3">Lokasi</h3>
            <div className="flex flex-wrap gap-2">
              {locationOptions.map((loc) => (
                <button
                  key={loc.value}
                  onClick={() =>
                    toggleMulti(
                      loc.value,
                      selectedLocation,
                      setSelectedLocation
                    )
                  }
                  className={`px-4 py-2 text-xs rounded-lg border ${
                    selectedLocation.includes(loc.value)
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tipe Kos */}
          <div>
            <h3 className="font-semibold mb-3">Tipe Kos</h3>
            <div className="flex flex-wrap gap-2">
              {kostTypeOptions.map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    toggleMulti(type.value, selectedType, setSelectedType)
                  }
                  className={`px-4 py-2 text-xs rounded-lg border ${
                    selectedType.includes(type.value)
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Harga */}
          <div>
            <h3 className="font-semibold mb-3">Harga</h3>
            <div className="flex flex-wrap gap-2">
              {priceOptions.map((price) => (
                <button
                  key={price.label}
                  onClick={() => setSelectedPrice(price)}
                  className={`px-4 py-2 text-xs rounded-lg border ${
                    selectedPrice?.label === price.label
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-3 border rounded-md font-semibold text-brand-dark"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-3 bg-brand-dark text-white rounded-md font-semibold"
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
