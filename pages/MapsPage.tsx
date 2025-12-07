import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Kost } from '../types';
import SearchIcon from '../components/icons/SearchIcon';
import CrosshairIcon from '../components/icons/CrosshairIcon';
import KostCard from '../components/KostCard';
import Pagination from '../components/Pagination';

// Mock data for demonstration
const mockKostData: Kost[] = Array.from({ length: 68 }, (_, i) => ({
    id: i + 1,
    name: 'Kost Dahlia Indah',
    type: 'Kost Putri',
    location: 'Mampang, Jakarta Selatan',
    price: 1500000,
    imageUrl: `https://picsum.photos/seed/${(i % 12) + 1}/400/300`,
    isNew: i % 6 === 0,
}));


const MapsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const totalPages = Math.ceil(mockKostData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = mockKostData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
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
      <h1 className="text-4xl font-bold text-brand-dark mb-6">Maps</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Search and Listings */}
        <div className="lg:w-1/2 xl:w-2/5">
            <div className="p-4 bg-brand-light-blue rounded-2xl">
                <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input type="text" placeholder="Cari kos .." className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm" />
                    </div>
                    <button className="bg-brand-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Cari</button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-brand-blue font-semibold my-6">
                <CrosshairIcon className="w-5 h-5"/>
                <span>Lokasi di sekitarmu</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {currentItems.map(kost => (
                    <KostCard key={kost.id} kost={kost} />
                ))}
            </div>

            <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>

        </div>

        {/* Right Column: Map */}
        <div className="lg:w-1/2 xl:w-3/5 lg:h-[calc(100vh-150px)] lg:sticky lg:top-24">
             <div className="w-full h-96 lg:h-full bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <img 
                    src="https://www.google.com/maps/d/u/0/thumbnail?mid=1_2S-5722A1251817479708_9652562&hl=en" 
                    alt="Map of Jakarta with property locations" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default MapsPage;