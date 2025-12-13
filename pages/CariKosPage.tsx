import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Kost } from '../types';
import SearchIcon from '../components/icons/SearchIcon';
import KostCard from '../components/KostCard';
import Pagination from '../components/Pagination';
import SearchKost from '@/components/SearchKost';
import FilterMenu from '@/components/layout/FilterMenu';

const mockKostData: Kost[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: 'Kost Dahlia Indah',
    type: 'Kost Putri',
    location: 'Mampang, Jakarta Selatan',
    price: 1500000,
    imageUrl: `https://picsum.photos/seed/${(i % 20) + 1}/400/300`, // Use a smaller set of repeating images
    isNew: i % 5 === 0, // Make every 5th item "New",
    link: `/kost/${i+1}`,
}));

const CariKosPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const totalPages = Math.ceil(mockKostData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = mockKostData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
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

      <p className="text-gray-600 mb-6">Menampilkan {currentItems.length} dari {mockKostData.length} hasil pencarian</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {currentItems.map(kost => (
              <KostCard key={kost.id} kost={kost} />
          ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      <FilterMenu isOpen={isFilterMenuOpen} setIsOpen={setIsFilterMenuOpen} />
    </div>
  );
};

export default CariKosPage;