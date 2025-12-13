
import React from 'react';
import { Link } from 'react-router-dom';
import WalletIcon from '../components/icons/WalletIcon';
import { Home } from "lucide-react";


interface ResultBudgetProps {
  amount: number; // e.g. 3000000
}

const KalkulatorBudgetResultPage: React.FC = () => {
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
      
        <div className="relative bg-cover bg-center rounded-2xl shadow-lg p-8 md:p-8 lg:p-8 my-8 overflow-hidden h-[30vh] md:h-[510px] lg:h-[510px]" style={{ backgroundImage: "url('/images/hero-image-bg.webp')" }}>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-2xl md:text-3xl font-bold">Kalkulator Budget</h1>
                <p className="mt-2 text-sm md:text-md lg:text-lg max-w-4xl mx-auto">
                    Berapa sih budget ideal kamu untuk pengeluaran kos dalam sebulan? Tenang, kita bantu hitung!
                </p>

                <div className="hidden md:block lg:block mt-8 w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-left">
                    {/* update code here */}
                    <div className="text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                            Hasil perhitungan
                        </h2>
                        <p className="mt-2 text-gray-500 text-sm md:text-base">
                            Ini dia hasil perhitungan dan budget ideal untuk kos kamu!
                        </p>

                        {/* Result Box */}
                        <div className="mt-6 bg-sky-100 rounded-xl px-6 py-5 flex items-center justify-between">
                            {/* Left */}
                            <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-sky-300 flex items-center justify-center">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-900 font-medium text-sm md:text-base">
                                Budget ideal untuk kos kamu
                            </span>
                            </div>

                            {/* Right */}
                            <div className="text-gray-900 font-bold text-2xl md:text-3xl">
                            Rp3.000.000
                            <span className="ml-1 text-sm font-medium text-gray-600">
                                /bulan
                            </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-6">
                            <Link
                            to="/kalkulator-budget"
                            className="inline-flex items-center justify-center rounded-md border border-gray-900 px-8 py-3 text-sm md:text-base font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                            >
                            Hitung ulang
                            </Link>
                        </div>
                        </div>

                </div>

            </div>

        </div>

        {/* mobile code */}
        <div className="md:hidden lg:hidden mt-8 w-full max-w-4xl mx-auto text-left">
        {/* update code here */}
        <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Hasil perhitungan
            </h2>
            <p className="mt-2 text-gray-500 text-sm md:text-base">
                Ini dia hasil perhitungan dan budget ideal untuk kos kamu!
            </p>

            {/* Result Box - Mobile */}
                <div className="mt-6 bg-sky-100 rounded-xl px-6 py-6 flex flex-col items-center text-center gap-3">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-sky-300 flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                </div>

                {/* Label */}
                <span className="text-gray-900 font-medium text-sm">
                    Budget ideal untuk kos kamu
                </span>

                {/* Amount */}
                <div className="text-gray-900 font-bold text-3xl leading-tight">
                    Rp3.000.000
                    <span className="text-sm font-medium text-gray-600 ml-1">
                    /bulan
                    </span>
                </div>
                </div>


            {/* CTA */}
            <div className="mt-6">
                <Link
                to="/kalkulator-budget"
                className="inline-flex items-center justify-center rounded-md border border-gray-900 px-8 py-3 text-sm md:text-base font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors w-full"
                >
                Hitung ulang
                </Link>
            </div>
            </div>

    </div>

        
    </div>
  );
};

export default KalkulatorBudgetResultPage;
