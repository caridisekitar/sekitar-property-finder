import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Kost } from '../types';
import SearchIcon from '../components/icons/SearchIcon';
import CrosshairIcon from '../components/icons/CrosshairIcon';
import KostCard from '../components/KostCard';
import Pagination from '../components/Pagination';
import MapboxMap from '@/components/MapboxMap';
import { useAuth } from "@/hooks/useAuth";
import SubscriptionModal from "@/components/SubscriptionModal";

// Mock data for demonstration
const mockKostData: Kost[] = Array.from({ length: 68 }, (_, i) => ({
    id: i + 1,
    name: 'Kost Dahlia Indah',
    type: 'Kost Putri',
    location: 'Mampang, Jakarta Selatan',
    price_monthly: 1500000,
    img_cover: `https://picsum.photos/seed/${(i % 12) + 1}/400/300`,
    isNew: i % 6 === 0,
}));


const MapsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { subscription } = useAuth();
    const isPremium = subscription?.plan === "PREMIUM";
    const ITEMS_PER_PAGE = isPremium ? 8 : 4;

    const totalPages = Math.ceil(mockKostData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = mockKostData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const [open, setOpen] = useState(false);
    
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
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
                    <span className="text-gray-700 font-medium">Maps</span>
                </li>
            </ol>
        </nav>
        <div className="w-full border-b border-gray-200 py-2"></div>
      <h1 className="text-base md:text-3xl  lg:text-4xl font-bold text-brand-dark py-4">Maps</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Search and Listings */}
        <div className="lg:w-1/2 xl:w-2/5">
            <div className="p-4 bg-brand-light-blue rounded-2xl hidden lg:block">
                <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input type="text" placeholder="Cari kos .." className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm" />
                    </div>
                    <button className="bg-brand-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Cari</button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-brand-blue font-semibold my-6 hidden lg:block">
                <CrosshairIcon className="w-5 h-5"/>
                <span>Lokasi di sekitarmu</span>
            </div>
            
            {/* Locked */}
            {!isPremium && currentItems.length > 0 && (
                <div className="relative mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 blur-md pointer-events-none">
                    {currentItems.map((kost) => (
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

            {isPremium && (
                <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>    
            )}
            

        </div>

        {/* Right Column: Map */}
        <div className="lg:w-1/2 xl:w-3/5 lg:h-[calc(100vh-150px)] lg:sticky lg:top-24 order-first lg:order-last">

            <div className="p-4 bg-brand-light-blue rounded-2xl lg:hidden mb-6">
                <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input type="text" placeholder="Cari kos .." className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm" />
                    </div>
                    <button className="bg-brand-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Cari</button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-brand-blue font-semibold my-6 lg:hidden">
                <CrosshairIcon className="w-5 h-5"/>
                <span>Lokasi di sekitarmu</span>
            </div>

             <div className="w-full h-96 lg:h-full bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <MapboxMap />
            </div>
        </div>

      </div>
    </div>
  );
};

export default MapsPage;