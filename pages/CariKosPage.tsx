import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Kost } from '../types';
import SearchIcon from '../components/icons/SearchIcon';
import KostCard from '../components/KostCard';
import Pagination from '../components/Pagination';


const mockKostData: Kost[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: 'Kost Dahlia Indah',
    type: 'Kost Putri',
    location: 'Mampang, Jakarta Selatan',
    price: 1500000,
    imageUrl: `https://picsum.photos/seed/${(i % 20) + 1}/400/300`, // Use a smaller set of repeating images
    isNew: i % 5 === 0, // Make every 5th item "New"
}));

const CariKosPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;

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
      <h1 className="text-4xl font-bold text-brand-dark">Cari Kos</h1>

      <div className="my-8 p-4 md:p-6 bg-brand-light-blue rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 lg:col-span-1">
                <label className="font-semibold text-sm mb-2 block">Cari</label>
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <input type="text" placeholder="Cari kos .." className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm" />
                </div>
            </div>
            <div>
                <label className="font-semibold text-sm mb-2 block">Lokasi</label>
                <select className="w-full py-3 px-4 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm appearance-none bg-white">
                    <option>Pilih Lokasi</option>
                    <option>Jakarta Selatan</option>
                    <option>Jakarta Pusat</option>
                </select>
            </div>
            <div>
                <label className="font-semibold text-sm mb-2 block">Tipe</label>
                <select className="w-full py-3 px-4 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm appearance-none bg-white">
                    <option>Pilih Tipe</option>
                    <option>Kost Putri</option>
                    <option>Kost Putra</option>
                    <option>Campur</option>
                </select>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-4">
                 <div className="flex-grow">
                    <label className="font-semibold text-sm mb-2 block">Harga</label>
                    <select className="w-full py-3 px-4 rounded-lg border-gray-300 focus:border-brand-blue focus:ring focus:ring-brand-blue focus:ring-opacity-50 shadow-sm appearance-none bg-white">
                        <option>&gt; 1.000.000-2.000.000</option>
                        <option>&lt; 1.000.000</option>
                        <option>&gt; 2.000.000</option>
                    </select>
                </div>
                <button className="w-full md:w-auto bg-brand-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Cari</button>
            </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6">Menampilkan {currentItems.length} dari {mockKostData.length} hasil pencarian</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {currentItems.map(kost => (
              <KostCard key={kost.id} kost={kost} />
          ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default CariKosPage;