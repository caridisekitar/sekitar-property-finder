import React, { useEffect, useState } from "react";
import SearchIcon from "@/components/icons/SearchIcon"; 
import FilterIcon from '@/components/icons/FilterIcon';
import MultiSelectDropdown from "./MultiSelectDropdown";

interface SearchKostProps {
  setIsFilterMenuOpen: (value: boolean) => void;
}

const SearchKost: React.FC<SearchKostProps> = ({ setIsFilterMenuOpen }) => {
  const [lokasi, setLokasi] = useState<string[]>([]);
  const [tipe, setTipe] = useState<string[]>([]);
  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:block bg-brand-light-blue p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="font-semibold text-sm mb-2 block">Cari</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kos .."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 text-sm"
              />
            </div>
          </div>

          {/* Lokasi */}
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

          {/* Tipe */}
          <MultiSelectDropdown
            label="Tipe"
            options={["Kos Putri", "Kos Putra", "Kos Campur", "Kost Pet Friendly", "Jendela Luar", "Kamar Mandi Dalam", "Dekat Transum"]}
            value={tipe}
            onChange={setTipe}
          />

          {/* Harga */}
          <div>
            <label className="font-semibold text-sm mb-2 block">Harga</label>
            <select className="w-full py-3 px-4 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 text-xs">
            <option> 1.000.000-2.000.000</option>
            <option> 2.000.000-3.000.000</option>
            <option> 3.000.000-5.000.000</option>
            <option>&gt; 5.000.000 (eksklusif)</option>
            </select>
          </div>

          {/* Button */}
          <button className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors text-xs">
            Cari
          </button>
        </div>
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden bg-brand-light-blue p-4 rounded-2xl shadow-sm">
        <div className="relative flex items-center gap-3">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kos .."
              className="w-full pl-12 pr-4 py-4 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm text-sm"
            />
          </div>

          <button
            onClick={() => setIsFilterMenuOpen(true)}
            aria-label="Open filters"
            className="flex-shrink-0 bg-brand-dark text-white rounded-full p-4 hover:bg-gray-800 transition-colors shadow-sm"
          >
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchKost;
