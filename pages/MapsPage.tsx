import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Kost } from '../types';
import SearchIcon from '../components/icons/SearchIcon';
import CrosshairIcon from '../components/icons/CrosshairIcon';
import KostCard from '../components/KostCard';
import Pagination from '../components/Pagination';
import MapboxMap from '@/components/MapboxMap';
import { useAuth } from "@/hooks/useAuth";
import SubscriptionModal from "@/components/SubscriptionModal";
import { secureGet } from "@/lib/secureGet";

/* =====================================================
   DUMMY DATA (FREE USERS ONLY – SAFE FOR INSPECT ELEMENT)
===================================================== */
const dummyKosts: Kost[] = Array.from({ length: 8 }, (_, i) => ({
  id: `dummy-${i + 1}` as any,
  name: 'Kost Nyaman & Strategis',
  type: 'Kost Campur',
  city: 'Jakarta',
  price_monthly: null,
  img_cover: '/images/dummy/kost-placeholder.webp',
  isNew: false,
}));

const ITEMS_PER_PAGE = 8;

const MapsPage: React.FC = () => {
  const { subscription } = useAuth();
  const plan = subscription?.plan ?? 'FREE';

  const isFree = plan === 'FREE';
  const isBasic = plan === 'BASIC';
  const isPremium = plan === 'PREMIUM';

  const [kosts, setKosts] = useState<Kost[]>([]);
  const [kostBasic, setKostBasic] = useState<Kost[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mapKosts, setMapKosts] = useState<Kost[]>([]);


  /* =====================================================
     FETCH DATA (STRICT BY PLAN)
  ===================================================== */
  const fetchData = async (pageNumber = 1) => {
  try {
    setLoading(true);

    // PREMIUM → list + map
    if (isPremium) {
      const res = await secureGet('/search', {
        page: pageNumber,
        per_page: ITEMS_PER_PAGE,
      });

      setKosts(res.data);
      setLastPage(res.last_page);

      const mapRes = await secureGet('/search', {
        per_page: 1000,
      });

      setMapKosts(mapRes.data);
    }

    // BASIC → limited list, FULL map
    if (isBasic) {
      const basic = await secureGet('/kost/basic');
      setKostBasic(basic.data.slice(0, 5));

      const mapRes = await secureGet('/search', {
        per_page: 1000,
      });

      setMapKosts(mapRes.data);
    }

    // FREE → nothing
    if (isFree) {

      const mapRes = await secureGet('/search', {
        per_page: 1000,
      });

      setMapKosts(mapRes.data);
    }
  } catch (err) {
    console.error('Failed to fetch kost data', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    
  if (page !== 1) {
    fetchData(page);
  }
}, [page]);

  /* =====================================================
     SINGLE SOURCE OF TRUTH FOR DISPLAY
  ===================================================== */
  const displayedKosts = useMemo(() => {
    if (isPremium) return kosts;
    if (isBasic) return kostBasic;
    return dummyKosts;
  }, [isPremium, isBasic, kosts, kostBasic]);

  /* =====================================================
     PAGINATION HANDLER (OPTIMISTIC)
  ===================================================== */
  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > lastPage || loading) return;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // reset first
    setKosts([]);
    setKostBasic([]);
    setMapKosts([]);
    setPage(1);
    setLastPage(1);

    // then fetch fresh
    fetchData(1);
    }, [plan]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-brand-blue">Home</Link>
            <span className="mx-3">/</span>
          </li>
          <li>
            <span className="text-gray-700 font-medium">Maps</span>
          </li>
        </ol>
      </nav>

      <div className="w-full border-b border-gray-200 py-2"></div>
      <h1 className="text-base md:text-3xl lg:text-4xl font-bold text-brand-dark py-4">
        Maps
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:w-1/2 xl:w-2/5">
          {/* SEARCH */}
          <div className="p-4 bg-brand-light-blue rounded-2xl hidden lg:block">
            <div className="relative flex gap-2">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                  type="text"
                  placeholder="Cari kos .."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm"
                />
              </div>
              <button className="bg-brand-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                Cari
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-brand-blue font-semibold my-6 hidden lg:block">
            <CrosshairIcon className="w-5 h-5"/>
            <span>Lokasi di sekitarmu</span>
          </div>

          {/* LIST */}
          <div className={`relative mt-8`}>
            <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 ${isFree ? 'blur-md pointer-events-none' : ''}`} >
              {displayedKosts.map((kost) => (
                <KostCard key={kost.id} kost={kost} />
              ))}
            </div>

            {/* LOCK OVERLAY */}
            {isFree && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
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
            )}
          </div>

          {/* PAGINATION (PREMIUM ONLY) */}
          {isPremium && lastPage > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={lastPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          <SubscriptionModal open={open} onClose={() => setOpen(false)} />
        </div>

        {/* RIGHT COLUMN – MAPBOX */}
        <div className="lg:w-1/2 xl:w-3/5 lg:h-[calc(100vh-150px)] lg:sticky lg:top-24 order-first lg:order-last">
          <div className="w-full h-96 lg:h-full bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <MapboxMap
                key={plan} // good: remount on plan change
                properties={
                    isPremium || isBasic
                    ? mapKosts
                    : dummyKosts
                }
                plan={plan}
                onUpgrade={() => setOpen(true)}
                />

          </div>
        </div>
      </div>
      <SubscriptionModal open={open} onClose={() => setOpen(false)} />

    </div>
  );
};

export default MapsPage;
