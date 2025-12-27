import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Kost } from '../types';
import SearchIcon from '../components/icons/SearchIcon';
import KostCard from '../components/KostCard';
import Pagination from '../components/Pagination';
import SearchKost from '@/components/SearchKost';
import FilterMenu from '@/components/layout/FilterMenu';
import { secureGet } from '@/lib/secureGet';
import SubscriptionModal from '@/components/SubscriptionModal';

const mockKostData: Kost[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: 'Kost Dahlia Indah',
    type: 'Kost Putri',
    city: 'Mampang, Jakarta Selatan',
    price_monthly: 1500000,
    img_cover: `https://picsum.photos/seed/${(i % 20) + 1}/400/300`, // Use a smaller set of repeating images
    isNew: 0,
    link: `/kost/${i+1}`,
}));

const VISIBLE_COUNT = 5;

const isSubscribed = false; // 🔐 change to true after payment/login

const CariKosPage: React.FC = () => {
    const [kosts, setKosts] = useState<Kost[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // 🔹 Fetch data from API
    useEffect(() => {
    const fetchKosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔐 secured GET request
        const data = await secureGet('/kosts', {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        setKosts(data);
      } catch (err) {
        setError((err as Error).message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchKosts();
  }, [currentPage]);

    const totalPages = Math.ceil(kosts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = kosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const visibleData = kosts.slice(0, VISIBLE_COUNT);
    const lockedData = mockKostData.slice(VISIBLE_COUNT, VISIBLE_COUNT * 2);
    const [open, setOpen] = useState(false);
    const plan = localStorage.getItem('plan');

    
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0);
        }
    };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                    <Link to="/" className="text-gray-500 hover:text-brand-blue">Home</Link>
                    <span className="mx-3">/</span>
                </li>
                <li>
                    <span className="text-gray-700 font-medium">Cari Kos</span>
                </li>
            </ol>
        </nav>
        <div className="w-full border-b border-gray-200 py-2"></div>
      <h1 className="text-base md:text-3xl  lg:text-4xl font-bold text-brand-dark py-4">Cari Kos</h1>
      <SearchKost setIsFilterMenuOpen={setIsFilterMenuOpen} />

      <div className="my-8">
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-gray-500 mt-6">Loading data...</p>}
      {error && <p className="text-red-500 mt-6">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-gray-600 mb-6">
            Menampilkan {currentItems.length} dari {kosts.length} hasil pencarian
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {visibleData.map((kost) => (
              <KostCard key={kost.id} kost={kost} />
            ))}
          </div>


          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory
                        sm:grid sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-5
                        sm:overflow-visible
                    blur-lg pointer-events-none select-none">
              {lockedData.map((kost) => (
                <KostCard key={kost.id} kost={kost} />
              ))}
            </div>
            {!isSubscribed && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
                        
                        <div className="flex justify-center mb-4">
                          <div className="flex items-center justify-center">
                            <img src="/images/icons/icon-locked.png" alt="Lock Icon" className="w-16 h-16" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2">
                          Yah terkunci nih!
                        </h3>

                        <p className="text-gray-600 mb-6">
                          Jangan khawatir, kamu bisa akses ratusan informasi kost dengan harga bersahabat.
                        </p>

                        <button
                          onClick={() => setOpen(true)}
                          className="px-6 py-3 rounded-xl bg-[#96C8E2] text-white font-semibold hover:bg-blue-600 transition"
                        >
                          Mulai langganan
                        </button>

                      </div>
                    </div>
                  )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <SubscriptionModal open={open} onClose={() => setOpen(false)} />
      <FilterMenu isOpen={isFilterMenuOpen} setIsOpen={setIsFilterMenuOpen} />
    </div>
  );
};

export default CariKosPage;