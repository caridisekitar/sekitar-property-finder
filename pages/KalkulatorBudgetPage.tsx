
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import WalletIcon from '../components/icons/WalletIcon';
import { useAuth } from '@/hooks/useAuth';
import { securePost } from "@/lib/securePost";
import KostCard from "@/components/KostCard";
import { formatIDRNumber } from '@/lib/helper';
import SubscriptionModal from '@/components/SubscriptionModal';

const KalkulatorBudgetPage: React.FC = () => {
    const { subscription } = useAuth();
    const isPremiumUser = subscription?.plan === 'PREMIUM';
    const [error, setError] = useState<React.ReactNode | null>(null);
    const [gaji, setGaji] = useState<string>('');
    const [results, setResults] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const premiumError = (
        <>
            Fitur ini hanya tersedia untuk pengguna Premium.{" "}
            <button
            onClick={() => setOpen(true)}
            className="text-blue-600 font-semibold transition"
            >
                Upgrade Sekarang
            </button>
        </>
        );


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // 1️⃣ Check subscription
            if (!isPremiumUser) {
                setError(premiumError);
                return;
            }
        
        // 2️⃣ Sanitize input (numbers only)
            const sanitized = gaji.replace(/\D/g, '');
            const salary = Number(sanitized);

            if (!salary || salary <= 0) {
                setError('Masukkan nominal gaji yang valid.');
                return;
            }

        // 3️⃣ Budget logic (example: max 30% of salary)
        const maxBudget = Math.floor(salary * 0.3);

        try {
            const res = await securePost(
            '/kost/search_by_salary',
            'POST',
            {
                max_budget: maxBudget,
            }
            );

            console.log(res.data)
            // 4️⃣ Limit to max 5 cards (backend already limits, but safe on frontend)
            setResults((res.data || []));
        } catch (err: any) {
            setError(
            err?.message ||
            'Terjadi kesalahan saat mencari kost. Silakan coba lagi.'
            );
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
                                name="gaji"
                                id="gaji"
                                type="text"
                                inputMode="numeric"
                                value={gaji}
                                onChange={(e) => setGaji(formatIDRNumber(e.target.value))}
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
                        {/* Loading */}
                        {loading && <p className="text-sm text-gray-500">Memuat hasil...</p>}
                        {error && (
                        <p className="mt-3 text-sm text-red-600 font-medium">
                            {error}
                        </p>
                        )}
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
                                name="gaji"
                                id="gaji"
                                type="text"
                                inputMode="numeric"
                                value={gaji}
                                onChange={(e) => setGaji(formatIDRNumber(e.target.value))}
                                className="block w-full rounded-md border border-gray-300 pl-10 py-3 text-gray-900
                                focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                                placeholder="Masukkan gaji kamu"
                            />
                            </div>
                            <p className="mb-2 text-xs text-gray-500">
                                Masukkan nominal gaji kamu tanpa koma atau titik.
                            </p>
                            {/* Loading */}
                            {loading && <p className="text-sm text-gray-500">Memuat hasil...</p>}
                            {error && (
                                <p className="mt-3 text-sm text-red-600 font-medium">
                                    {error}
                                </p>
                                )}
                            
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

          {/* Cards */}
            {!loading && !error && (
                <div className="flex gap-4 overflow-x-auto pb-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {results.map((kost) => (
                    <KostCard key={kost.id} kost={kost} />
                ))}
                </div>
            )}  
            <SubscriptionModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default KalkulatorBudgetPage;
