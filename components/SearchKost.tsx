import React, { useEffect, useState } from "react";
import SearchIcon from "@/components/icons/SearchIcon"; 
import FilterIcon from '@/components/icons/FilterIcon';
import MultiSelectDropdown from "./MultiSelectDropdown";
import { secureGet } from "@/lib/secureGet";
import type { Kost } from "@/types";

interface SearchKostProps {
  setIsFilterMenuOpen: (value: boolean) => void;
  onResult: (data: Kost[]) => void;
}

const SearchKost: React.FC<SearchKostProps> = ({
  setIsFilterMenuOpen,
  onResult,
}) => {
  const [lokasi, setLokasi] = useState<string[]>([]);
  const [tipe, setTipe] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [loading, setLoading] = useState(false);

  const parsePriceRange = (value: string) => {
    if (!value) return {};

    if (value.endsWith("+")) {
      return { min_price: parseInt(value.replace("+", "")) };
    }

    const [min, max] = value.split("-").map(Number);
    return { min_price: min, max_price: max };
  };

  const doSearch = async () => {
    setLoading(true);
    try {
      const res = await secureGet("/search", {
        q: keyword,
        lokasi,
        tipe,
        ...parsePriceRange(priceRange),
      });

      onResult(res.data ?? res);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!keyword.trim()) return;
    const t = setTimeout(doSearch, 400);
    return () => clearTimeout(t);
  }, [keyword, lokasi, tipe, priceRange]);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block bg-brand-light-blue p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          {/* Keyword */}
          <div className="lg:col-span-2">
            <label className="font-semibold text-sm mb-2 block">Cari</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari kos .."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 text-sm"
              />
            </div>
          </div>

          <MultiSelectDropdown
            label="Lokasi"
            options={[
              "Jakarta Selatan",
              "Jakarta Pusat",
              "Jakarta Barat",
              "Jakarta Timur",
            ]}
            value={lokasi}
            onChange={setLokasi}
          />

          <MultiSelectDropdown
            label="Tipe"
            options={[
              "Kos Putri",
              "Kos Putra",
              "Kos Campur",
              "Kost Pet Friendly",
              "Jendela Luar",
              "Kamar Mandi Dalam",
            ]}
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
            disabled={loading}
            className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Mencari..." : "Cari"}
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
    </>
  );
};

export default SearchKost;
