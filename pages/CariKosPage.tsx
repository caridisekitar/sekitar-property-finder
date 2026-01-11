import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Kost } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import KostCard from "@/components/KostCard";
import SearchKost from "@/components/SearchKost";
import FilterMenu from "@/components/layout/FilterMenu";
import SubscriptionModal from "@/components/SubscriptionModal";
import Pagination from "@/components/Pagination";
import { secureGet } from "@/lib/secureGet";

const CariKosPage: React.FC = () => {
  const [kosts, setKosts] = useState<Kost[]>([]);
  const [kostBasic, setKostBasic] = useState<Kost[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { subscription } = useAuth();

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const isPremium = subscription?.plan === "PREMIUM";

  const visibleKosts = isPremium ? kosts : kostBasic;
  const lockedKosts = isPremium ? [] : kosts.slice(kostBasic.length);

  const fetchKosts = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await secureGet("/search", {
        page: pageNumber,
        per_page: 10,
      });

      setKosts(res.data);
      setPage(res.current_page);
      setLastPage(res.last_page);
      setTotal(res.total);

      if (!isPremium) {
        const basic = await secureGet("/kost/basic");
        setKostBasic(basic.data);
      }
    } catch (e) {
      console.error("Fetch kost failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKosts(1);
  }, [isPremium]);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm mb-4">
        <Link to="/" className="text-gray-500">Home</Link> / Cari Kos
      </nav>

      <h1 className="text-3xl font-bold mb-4">Cari Kos</h1>

      <SearchKost
        setIsFilterMenuOpen={setIsFilterMenuOpen}
        onResult={(res) => {
          setKosts(res.data ?? res);
          setPage(res.current_page ?? 1);
          setLastPage(res.last_page ?? 1);
          setTotal(res.total ?? (res.data?.length ?? 0));
        }}
      />

      <p className="text-gray-600 my-6">
        Menampilkan {visibleKosts.length} dari {total} hasil pencarian
      </p>

      {/* Visible */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {visibleKosts.map((kost) => (
          <KostCard key={kost.id} kost={kost} />
        ))}
      </div>

      {/* Pagination (Premium only) */}
      {isPremium && lastPage > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalPages={lastPage}
            onPageChange={(p) => {
              if (p !== page && !loading) {
                fetchKosts(p);
              }
            }}
          />
        </div>
      )}

      {/* Locked */}
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
      />
    </div>
  );
};

export default CariKosPage;
