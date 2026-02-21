import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Kost } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import KostCard from "@/components/KostCard";
import SearchKost from "@/components/SearchKost";
import FilterMenu from "@/components/layout/FilterMenu";
import SubscriptionModal from "@/components/SubscriptionModal";
import Pagination from "@/components/Pagination";
import { secureGet } from "@/lib/secureGet";

const ITEMS_PER_PAGE = 10;

const CariKosPage: React.FC = () => {
  const { subscription } = useAuth();
  const isPremium = subscription?.plan === "PREMIUM";

  const [searchParams, setSearchParams] = useSearchParams();

  const [kosts, setKosts] = useState<Kost[]>([]);
  const [kostBasic, setKostBasic] = useState<Kost[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  /* ==============================
     URL AS SINGLE SOURCE OF TRUTH
  ============================== */

  const filters = useMemo(() => {
  return {
    q: searchParams.get("q") || "",
    lokasi: searchParams.get("lokasi") || "",
    tipe: searchParams.get("tipe") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    page: parseInt(searchParams.get("page") || "1"),
  };
}, [searchParams]);

  /* ==============================
     ACTIVE FILTER STATE (NEW)
  ============================== */

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.lokasi) count++;
    if (filters.tipe) count++;
    if (filters.min_price) count++;
    if (filters.max_price) count++;
    return count;
  }, [filters]);

  const isFilterActive = activeFilterCount > 0;

  /* ==============================
     FETCH DATA
  ============================== */

  const fetchKosts = async () => {
    try {
      setLoading(true);

      const res = await secureGet("/search", {
        page: filters.page,
        per_page: ITEMS_PER_PAGE,
        q: filters.q,
        lokasi: filters.lokasi,
        tipe: filters.tipe,
        min_price: filters.min_price || undefined,
        max_price: filters.max_price || undefined,
      });

      setKosts(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);

      if (!isPremium) {
        const basic = await secureGet("/kost/basic");
        setKostBasic(basic.data);
      }

    } catch (error) {
      console.error("Failed to fetch kost:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKosts();
  }, [searchParams, isPremium]);

  /* ==============================
     VISIBLE + LOCKED LOGIC
  ============================== */

  const visibleKosts = isPremium ? kosts : kostBasic;
  const lockedKosts = isPremium ? [] : kosts.slice(kostBasic.length);

  /* ==============================
     HANDLE FILTER CHANGE
  ============================== */

  const updateFilters = (params: {
  q?: string;
  lokasi?: string;
  tipe?: string;
  min_price?: number;
  max_price?: number;
}) => {
  setSearchParams({
    q: params.q || "",
    lokasi: params.lokasi || "",
    tipe: params.tipe || "",
    min_price: params.min_price?.toString() || "",
    max_price: params.max_price?.toString() || "",
    page: "1",
  });
};

  const handlePageChange = (page: number) => {
    setSearchParams({
      lokasi: filters.lokasi,
      tipe: filters.tipe,
      min_price: filters.min_price,
      max_price: filters.max_price,
      page: page.toString(),
    });
  };

  const resetFilters = () => {
    setSearchParams({ page: "1" });
  };

  /* ==============================
     UI
  ============================== */

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm mb-4">
        <Link to="/" className="text-gray-500">
          Home
        </Link>{" "}
        / Cari Kos
      </nav>

      <h1 className="text-3xl font-bold mb-4">Cari Kos</h1>

      <SearchKost
      setIsFilterMenuOpen={setIsFilterMenuOpen}
      onSearch={updateFilters}
      isFilterActive={isFilterActive}
      initialFilters={{
        q: searchParams.get("q") || "",
        lokasi: searchParams.get("lokasi") || "",
        tipe: searchParams.get("tipe") || "",
        min_price: searchParams.get("min_price") || "",
        max_price: searchParams.get("max_price") || "",
      }}
    />

      <p className="text-gray-600 my-6">
        Menampilkan {visibleKosts.length} dari {total} hasil pencarian
      </p>

      {/* ================= ACTIVE FILTER SUMMARY (NEW) ================= */}
      {isFilterActive && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          {filters.lokasi && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Lokasi: {filters.lokasi}
            </span>
          )}
          {filters.tipe && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Tipe: {filters.tipe}
            </span>
          )}
          {filters.min_price && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Min: {filters.min_price}
            </span>
          )}
          {filters.max_price && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Max: {filters.max_price}
            </span>
          )}

          <button
            onClick={resetFilters}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {visibleKosts.map((kost) => (
          <KostCard key={kost.id} kost={kost} />
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {isPremium && lastPage > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={filters.page}
            totalPages={lastPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* ================= LOCKED SECTION ================= */}
      {!isPremium && lockedKosts.length > 0 && (
        <div className="relative mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 blur-md pointer-events-none">
            {lockedKosts.map((kost) => (
              <KostCard key={kost.id} kost={kost} />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
              <img
                src="/images/icons/icon-locked.png"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Yah terkunci nih!</h3>
              <p className="text-gray-600 mb-6">
                Akses ratusan kost dengan berlangganan premium.
              </p>
              <button
                onClick={() => setOpen(true)}
                className="px-6 py-3 bg-[#96C8E2] text-white rounded-xl"
              >
                Mulai langganan
              </button>
            </div>
          </div>
        </div>
      )}

      <SubscriptionModal open={open} onClose={() => setOpen(false)} />

      <FilterMenu
        isOpen={isFilterMenuOpen}
        setIsOpen={setIsFilterMenuOpen}
        onApply={updateFilters}
      />
    </div>
  );
};

export default CariKosPage;