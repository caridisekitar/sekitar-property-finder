
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
      
        <div className="relative bg-cover bg-center rounded-2xl shadow-lg p-8 md:p-16 my-8 overflow-hidden" style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1200/400')" }}>
            <div className="absolute inset-0 bg-brand-blue bg-opacity-60"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold">Kalkulator Budget</h1>
                <p className="mt-4 text-lg max-w-2xl mx-auto">
                    Berapa sih budget ideal kamu untuk pengeluaran kos dalam sebulan? Tenang, kita bantu hitung!
                </p>

                <div className="mt-8 w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-8 text-left">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="gaji" className="block text-sm font-medium text-gray-700">
                                Gaji kamu perbulan
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <WalletIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="gaji"
                                    id="gaji"
                                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-brand-blue focus:ring-brand-blue sm:text-sm py-3"
                                    placeholder="Masukkan gaji kamu"
                                />
                            </div>
                             <p className="mt-2 text-xs text-gray-500">Masukkan nominal gaji kamu tanpa koma atau titik.</p>
                        </div>
                        <button
                            type="submit"
                            className="mt-6 w-full inline-flex items-center justify-center rounded-md border border-transparent bg-brand-dark px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2 transition-colors"
                        >
                            Hitung
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default KalkulatorBudgetPage;
