import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Kost } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import KostCard from "@/components/KostCard";
import SearchKost from "@/components/SearchKost";
import FilterMenu from "@/components/layout/FilterMenu";
import SubscriptionModal from "@/components/SubscriptionModal";
import { secureGet } from "@/lib/secureGet";


const MAX_FREE = 5;


const CariKosPage: React.FC = () => {
  const [kosts, setKosts] = useState<Kost[]>([]);
  const [kostBasic, setKostBasic] = useState<Kost[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { subscription } = useAuth();

  const isPremium = subscription?.plan === "PREMIUM";

  const visibleKosts = isPremium
    ? kosts
    : kostBasic;

  const Ca = !isPremium
    ? kostBasic
    : [];

  useEffect(() => {
  const fetchInitialKosts = async () => {
    try {
      const res = await secureGet("/search", {
        limit: 20,
        sort: "latest",
      });

      // Get kost basic
      const kostBasic = await secureGet('/kost/basic');
      setKostBasic(kostBasic.data);

      setKosts(res.data ?? res);
    } catch (e) {
      console.error("Initial fetch failed", e);
    }
  };
  

  fetchInitialKosts();
}, []);

  const lockedKosts = isPremium ? [] : Ca;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm mb-4">
        <Link to="/" className="text-gray-500">Home</Link> / Cari Kos
      </nav>

      <h1 className="text-3xl font-bold mb-4">Cari Kos</h1>

      <SearchKost
        setIsFilterMenuOpen={setIsFilterMenuOpen}
        onResult={setKosts}
      />

      <p className="text-gray-600 my-6">
        Menampilkan {visibleKosts.length} dari {kosts.length} hasil pencarian
      </p>

      {/* Visible */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {visibleKosts.map((kost) => (
          <KostCard key={kost.id} kost={kost} />
        ))}
      </div>

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
