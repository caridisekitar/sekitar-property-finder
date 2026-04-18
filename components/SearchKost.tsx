import React, { useEffect, useMemo, useState } from "react";
import SearchIcon from "@/components/icons/SearchIcon";
import FilterIcon from "@/components/icons/FilterIcon";
import MultiSelectDropdown from "./MultiSelectDropdown";
import TreeSelectDropdown from "./TreeSelectDropdown";
import SingleSelectDropdown from "./SingleSelectDropdown";
import { useAuth } from "@/hooks/useAuth";
import LockedOverlay from "./LockedOverlay";
import SubscriptionModal from "@/components/SubscriptionModal";
import { secureGet } from '@/lib/secureGet';

type LocationOption = {
  label: string
  value: string
  children: { label: string; value: string }[]
}

interface SearchKostProps {
  setIsFilterMenuOpen: (value: boolean) => void;
  onSearch: (params: {
    q?: string;
    lokasi?: string;
    tipe?: string;
    min_price?: number;
    max_price?: number;
  }) => void;

  isFilterActive?: boolean;
  initialFilters?: {
    q?: string;
    lokasi?: string;
    tipe?: string;
    min_price?: string;
    max_price?: string;
  };
}

const SearchKost: React.FC<SearchKostProps> = ({
  setIsFilterMenuOpen,
  onSearch,
  isFilterActive = false,
  initialFilters,
}) => {
  const { subscription } = useAuth();

  const [lokasi, setLokasi] = useState<string[]>([]);
  const [lokasiOptions, setLokasiOptions] = useState<LocationOption[]>([])
  const [tipe, setTipe] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [showLocked, setShowLocked] = useState(false);
  const [open, setOpen] = useState(false);

  /* ==============================
     SYNC STATE FROM URL
  ============================== */

  // Sync filters from URL
  useEffect(() => {
    if (!initialFilters) return;
    setLokasi(initialFilters.lokasi ? initialFilters.lokasi.split(",").filter(Boolean) : []);
    setTipe(initialFilters.tipe ? initialFilters.tipe.split(",") : []);
    setKeyword(initialFilters.q || "");
    if (initialFilters.min_price && !initialFilters.max_price) {
      setPriceRange(`${initialFilters.min_price}+`);
    } else if (initialFilters.min_price && initialFilters.max_price) {
      setPriceRange(`${initialFilters.min_price}-${initialFilters.max_price}`);
    } else {
      setPriceRange(null);
    }
  }, [initialFilters?.q, initialFilters?.lokasi, initialFilters?.tipe, initialFilters?.min_price, initialFilters?.max_price]);

  /* ==============================
     HELPERS
  ============================== */

  const parsePriceRange = (value?: string | null) => {
    if (!value) return {};

    if (value.endsWith("+")) {
      return { min_price: parseInt(value.replace("+", "")) };
    }

    const [min, max] = value.split("-").map(Number);
    return { min_price: min, max_price: max };
  };

  const canSearch = subscription?.plan === "PREMIUM" || subscription?.plan === "PREMIUM_PLUS";

  // Slugs the user may select; null = no restriction (BASIC / guest handled by canSearch gate)
  const allowedSlugs = useMemo<Set<string> | null>(() => {
    if (!canSearch || !subscription?.locations?.length) return null;
    const subSlugs = new Set(subscription.locations);
    const allowed = new Set<string>();
    lokasiOptions.forEach((opt: LocationOption) => {
      if (subSlugs.has(opt.value)) {
        allowed.add(opt.value);
        opt.children.forEach((c: { value: string }) => allowed.add(c.value));
      }
    });
    return allowed;
  }, [canSearch, subscription?.locations, lokasiOptions]);

  const doSearch = () => {
    if (!canSearch) {
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

  /* ==============================
     OPTIONS
  ============================== */

  useEffect(() => {
    const fetchLocations = async () => {
      try {

        const res = await secureGet("/locations")

        const mapped = res.data.map((item: any) => ({
          label: item.name,
          value: item.slug,
          children: (item.children ?? []).map((c: any) => ({ label: c.name, value: c.slug })),
        }))

        setLokasiOptions(mapped)

      } catch (err) {
        console.error("Failed to fetch locations", err)
      } finally {
        // setLoading(false)
      }
    }

    fetchLocations()
  }, [])
  // const lokasiOptions = [
  //   { label: "Jakarta Selatan", value: "Jakarta Selatan" },
  //   { label: "Jakarta Pusat", value: "Jakarta Pusat" },
  //   { label: "Jakarta Barat", value: "Jakarta Barat" },
  //   { label: "Jakarta Timur", value: "Jakarta Timur" },
  //   { label: "Jakarta Utara", value: "Jakarta Utara" },
  //   { label: "Tangerang", value: "Tangerang" },
  // ];

  const tipeOptions = [
    { label: "Kos Putri", value: "Putri" },
    { label: "Kos Putra", value: "Putra" },
    { label: "Kos Campur", value: "Campur" },
    { label: "Kos Campur Bebas", value: "Campur Bebas" },
    { label: "Jendela Luar", value: "Jendela Luar" },
    { label: "Kamar Mandi Dalam", value: "Kamar Mandi Dalam" },
  ];

  const isInputActive =
    lokasi.length > 0 ||
    tipe.length > 0 ||
    keyword.trim() !== "" ||
    priceRange !== null;

  return (
    <>
      {showLocked && (
        <LockedOverlay
          message="Please subscribe to unlock search"
          onClose={() => setShowLocked(false)}
          onSubscribe={() => setOpen(true)}
        />
      )}

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block bg-brand-light-blue p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* Cari — 3/12 */}
          <div className="lg:col-span-3">
            <label className="font-semibold text-sm mb-2 block">Cari</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari kos .."
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm ${
                  keyword ? "border-brand-dark ring-1 ring-brand-dark" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Lokasi — 3/12 (same as Cari) */}
          <div className="lg:col-span-3">
            <TreeSelectDropdown
              label="Lokasi"
              options={lokasiOptions}
              value={lokasi}
              onChange={setLokasi}
              isActive={lokasi.length > 0}
              allowedValues={allowedSlugs}
            />
          </div>

          {/* Tipe — 2/12 */}
          <div className="lg:col-span-2">
            <MultiSelectDropdown
              label="Tipe"
              options={tipeOptions}
              value={tipe}
              onChange={setTipe}
              isActive={tipe.length > 0}
            />
          </div>

          {/* Harga — 2/12 */}
          <div className="lg:col-span-2">
            <SingleSelectDropdown
              label="Harga"
              value={priceRange}
              onChange={setPriceRange}
              options={[
                { label: "1 - 2 jt", value: "1000000-2000000" },
                { label: "2 - 3 jt", value: "2000000-3000000" },
                { label: "3 - 5 jt", value: "3000000-5000000" },
                { label: "> 5 jt", value: "5000000+" },
              ]}
              isActive={priceRange !== null}
            />
          </div>

          {/* Cari button — 2/12 */}
          <div className="lg:col-span-2">
            <label className="font-semibold text-sm mb-2 block opacity-0 select-none">.</label>
            <button
              onClick={doSearch}
              className="w-full font-bold py-3 rounded-lg bg-brand-dark text-white hover:bg-gray-800 transition"
            >
              Cari
            </button>
          </div>
        </div>

      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden bg-brand-light-blue p-4 rounded-2xl shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari kos .."
            className={`flex-grow px-4 py-3 rounded-lg border ${
              keyword ? "border-brand-dark ring-1 ring-brand-dark" : "border-gray-300"
            }`}
          />

          <button
            onClick={() => setIsFilterMenuOpen(true)}
            className={`bg-brand-dark text-white p-4 rounded-full ${
              isFilterActive ? "shadow-md ring-2 ring-white" : ""
            }`}
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