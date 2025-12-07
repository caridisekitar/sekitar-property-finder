import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '../components/icons/HomeIcon';
import LinkIcon from '../components/icons/LinkIcon';

const WishlistPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Wishlist submitted!');
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
                    <span className="text-gray-700 font-medium">Wishlist</span>
                </li>
            </ol>
        </nav>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Wishlist</h1>
        <h2 className="text-2xl font-semibold text-brand-dark mb-3">
          <span className="text-brand-blue">#TemanSekitar</span> punya wishlist kos yang mau di survey?
        </h2>
        <p className="text-gray-600 mb-2">
          Tambahkan ke wishlist kamu, yuk, gratis!
        </p>
        <p className="text-gray-600 mb-8">
          Tim kami akan meninjau dan melakukan survei agar kos tersebut bisa segera ditampilkan di website.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nama-kos" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kos<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HomeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="nama-kos"
                name="nama-kos"
                required
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm py-3"
                placeholder="Tulis Nama Kos"
              />
            </div>
          </div>

          <div>
            <label htmlFor="google-maps-link" className="block text-sm font-medium text-gray-700 mb-1">
              Link google maps kos wishlist kamu<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="google-maps-link"
                name="google-maps-link"
                required
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm py-3"
                placeholder="Link"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-brand-dark py-3 px-8 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2 transition-colors"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WishlistPage;
