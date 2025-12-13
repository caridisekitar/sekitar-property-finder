
import React from 'react';
import { Link } from 'react-router-dom';
import WalletIcon from '../components/icons/WalletIcon';

const KalkulatorBudgetPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle calculation logic here
        alert('Budget calculation feature coming soon!');
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
                    <span className="text-gray-700 font-medium">Kalkulator Budget</span>
                </li>
            </ol>
        </nav>
        <div className="w-full border-b border-gray-200 py-2"></div>
      
        <div className="relative bg-cover bg-center rounded-2xl shadow-lg p-8 md:p-8 lg:p-8 my-8 overflow-hidden h-[30vh] md:h-[330px] lg:h-[330px]" style={{ backgroundImage: "url('/images/hero-image-bg.webp')" }}>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-2xl md:text-3xl font-bold">Kalkulator Budget</h1>
                <p className="mt-2 text-sm md:text-md lg:text-lg max-w-4xl mx-auto">
                    Berapa sih budget ideal kamu untuk pengeluaran kos dalam sebulan? Tenang, kita bantu hitung!
                </p>

                <div className="hidden md:block lg:block mt-8 w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-left">
                    <form onSubmit={handleSubmit}>
                        <label
                            htmlFor="gaji"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Gaji kamu perbulan
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Input */}
                            <div className="relative flex-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <WalletIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                name="gaji"
                                id="gaji"
                                className="block w-full rounded-md border border-gray-300 pl-10 py-3 text-gray-900
                                focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                                placeholder="Masukkan gaji kamu"
                            />
                            </div>

                            {/* Button */}
                            <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md
                                bg-brand-dark px-6 py-3 text-sm font-semibold text-white
                                hover:bg-gray-800 focus:outline-none focus:ring-2
                                focus:ring-brand-dark focus:ring-offset-2 transition-colors
                                sm:w-auto w-full"
                            >
                            Hitung
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            Masukkan nominal gaji kamu tanpa koma atau titik.
                        </p>
                        </form>

                </div>
            </div>

        </div>

        {/* form mobile */}
            <div className="md:hidden lg:hidden mt-8 w-full max-w-4xl mx-auto text-left">
                    <form onSubmit={handleSubmit}>
                        <label
                            htmlFor="gaji"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Gaji kamu perbulan
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Input */}
                            <div className="relative flex-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <WalletIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                name="gaji"
                                id="gaji"
                                className="block w-full rounded-md border border-gray-300 pl-10 py-3 text-gray-900
                                focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                                placeholder="Masukkan gaji kamu"
                            />
                            </div>
                            <p className="mb-2 text-xs text-gray-500">
                                Masukkan nominal gaji kamu tanpa koma atau titik.
                            </p>
                            
                        </div>

                        
                        {/* Button */}
                            <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md
                                bg-[#18181B] px-6 py-3 my-6 text-sm font-semibold text-white
                                hover:-[#18181B] focus:outline-none focus:ring-2
                                focus:ring-brand-dark focus:ring-offset-2 transition-colors
                                sm:w-auto w-full"
                            >
                            Hitung
                            </button>
                        </form>

                </div>
    </div>
  );
};

export default KalkulatorBudgetPage;
