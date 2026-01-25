import React, { useState } from "react";
import SearchIcon from "@/components/icons/SearchIcon";
import FilterIcon from "@/components/icons/FilterIcon";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useAuth } from "@/hooks/useAuth";
import LockedOverlay from "./LockedOverlay";
import SubscriptionModal from "@/components/SubscriptionModal";

interface SearchKostProps {
  setIsFilterMenuOpen: (value: boolean) => void;
  onSearch: (params: {
    q?: string;
    lokasi?: string;
    tipe?: string;
    min_price?: number;
    max_price?: number;
  }) => void;
}

const SearchKost: React.FC<SearchKostProps> = ({
  setIsFilterMenuOpen,
  onSearch,
}) => {
  const { subscription } = useAuth();
  const [lokasi, setLokasi] = useState<string[]>([]);
  const [tipe, setTipe] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [showLocked, setShowLocked] = useState(false);
  const [open, setOpen] = useState(false);

  const parsePriceRange = (value: string) => {
    if (!value) return {};
    if (value.endsWith("+")) {
      return { min_price: parseInt(value.replace("+", "")) };
    }
    const [min, max] = value.split("-").map(Number);
    return { min_price: min, max_price: max };
  };

  const doSearch = () => {
    if (!subscription || subscription?.plan !== "PREMIUM") {
      setShowLocked(true);
      return;
    }

    const params: {
        q?: string;
        lokasi?: string;
        tipe?: string;
        min_price?: number;
        max_price?: number;
      } = {
        ...(lokasi.length && { lokasi: lokasi.join(",") }),
        ...(tipe.length && { tipe: tipe.join(",") }),
        ...parsePriceRange(priceRange),
      };

      if (keyword.trim()) {
        params.q = keyword.trim();
      }

      onSearch(params);

  };

  const lokasiOptions = [
    { label: "Jakarta Selatan", value: "Jakarta Selatan" },
    { label: "Jakarta Pusat", value: "Jakarta Pusat" },
    { label: "Jakarta Barat", value: "Jakarta Barat" },
    { label: "Jakarta Timur", value: "Jakarta Timur" },
    { label: "Jakarta Utara", value: "Jakarta Utara" },
    { label: "Tangerang", value: "Tangerang" },
  ];

  const tipeOptions = [
    { label: "Kos Putri", value: "Putri" },
    { label: "Kos Putra", value: "Putra" },
    { label: "Kos Campur", value: "Campur" },
    { label: "Kost Pet Friendly", value: "Pet Friendly" },
    { label: "Jendela Luar", value: "Jendela Luar" },
    { label: "Kamar Mandi Dalam", value: "Kamar Mandi Dalam" },
  ];

  return (
    <>
      {showLocked && (
        <LockedOverlay
          message="Please subscribe to unlock search"
          onClose={() => setShowLocked(false)}
          onSubscribe={() => setOpen(true)}
        />
      )}

      {/* Desktop */}
      <div className="hidden md:block bg-brand-light-blue p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="font-semibold text-sm mb-2 block">Cari</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari kos .."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300"
              />
            </div>
          </div>

          <MultiSelectDropdown
            label="Lokasi"
            options={lokasiOptions}
            value={lokasi}
            onChange={setLokasi}
          />

          <MultiSelectDropdown
            label="Tipe"
            options={tipeOptions}
            value={tipe}
            onChange={setTipe}
          />

          <div>
            <label className="font-semibold text-sm mb-2 block">Harga</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full py-3 px-4 rounded-lg border-gray-300 text-xs"
            >
              <option value="">Pilih harga</option>
              <option value="1000000-2000000">1 – 2 jt</option>
              <option value="2000000-3000000">2 – 3 jt</option>
              <option value="3000000-5000000">3 – 5 jt</option>
              <option value="5000000+">&gt; 5 jt</option>
            </select>
          </div>

          <button
            onClick={doSearch}
            className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden bg-brand-light-blue p-4 rounded-2xl shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari kos .."
            className="flex-grow px-4 py-3 rounded-lg border"
          />
          <button
            onClick={() => setIsFilterMenuOpen(true)}
            className="bg-brand-dark text-white p-4 rounded-full"
          >
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <SubscriptionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default SearchKost;
