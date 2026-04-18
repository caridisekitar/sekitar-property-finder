import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import WalletIcon from '../components/icons/WalletIcon';
import { useAuth } from '@/hooks/useAuth';
import { secureGet } from '@/lib/secureGet';
import { securePost } from "@/lib/securePost";
import KostCard from "@/components/KostCard";
import { formatIDRNumber } from '@/lib/helper';
import SubscriptionModal from '@/components/SubscriptionModal';
import Pagination from '@/components/Pagination';

const KalkulatorBudgetPage: React.FC = () => {
    const { subscription } = useAuth();

    const isPremiumUser =
        subscription?.plan === 'PREMIUM' || subscription?.plan === 'PREMIUM_PLUS';

    const subscriptionSlugs: string[] = subscription?.locations ?? [];

    // ── state ──────────────────────────────────
    const [gaji, setGaji] = useState('');
    const [maxRangeBudget, setMaxRangeBudget] = useState(0);
    const [budgetReady, setBudgetReady] = useState(false);
    const [selectedLokasi, setSelectedLokasi] = useState<string[]>([]);
    const [locationNames, setLocationNames] = useState<Record<string, string>>({});
    const [results, setResults] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<React.ReactNode | null>(null);
    const [open, setOpen] = useState(false);

    const premiumError = (
        <>
            Fitur ini hanya tersedia untuk pengguna Premium.{" "}
            <button onClick={() => setOpen(true)} className="text-blue-600 font-semibold">
                Upgrade Sekarang
            </button>
        </>
    );

    // ── fetch location names for chips ─────────
    useEffect(() => {
        if (!isPremiumUser || subscriptionSlugs.length === 0) return;
        secureGet('/locations').then((res) => {
            const map: Record<string, string> = {};
            (res.data ?? []).forEach((loc: any) => {
                map[loc.slug] = loc.name;
                (loc.children ?? []).forEach((c: any) => { map[c.slug] = c.name; });
            });
            setLocationNames(map);
        }).catch(() => {});
    }, [isPremiumUser, subscriptionSlugs.join(',')]);

    const formatSlug = (slug: string) =>
        slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // ── core fetch ─────────────────────────────
    const fetchResults = async (
        pageNumber: number,
        budget: number,
        lokasi: string[],
    ) => {
        setLoading(true);
        setError(null);
        try {
            const body: Record<string, any> = {
                max_budget: budget,
                page: pageNumber,
                per_page: 10,
            };
            if (lokasi.length > 0) body.lokasi = lokasi.join(',');

            const res = await securePost('/kost/search_by_salary', 'POST', body);
            setResults(res.data || []);
            setPage(res.meta?.current_page || pageNumber);
            setTotalPages(res.meta?.last_page || 1);
            setTotalCount(res.meta?.total || 0);
        } catch {
            setError('Gagal memuat data kost.');
        } finally {
            setLoading(false);
        }
    };

    // ── submit salary ──────────────────────────
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!isPremiumUser) { setError(premiumError); return; }

        const salary = Number(gaji.replace(/\D/g, ''));
        if (!salary) { setError('Masukkan nominal gaji yang valid.'); return; }

        const budget = Math.floor(salary * 0.3);
        setMaxRangeBudget(budget);
        setBudgetReady(true);
        setPage(1);

        // Pre-select all subscription locations and fetch immediately
        const lokasi = [...subscriptionSlugs];
        setSelectedLokasi(lokasi);
        await fetchResults(1, budget, lokasi);
    };

    // ── toggle location chip → re-fetch ────────
    const toggleLokasi = async (slug: string) => {
        const next = selectedLokasi.includes(slug)
            ? selectedLokasi.filter((s) => s !== slug)
            : [...selectedLokasi, slug];
        setSelectedLokasi(next);
        await fetchResults(1, maxRangeBudget, next);
    };

    // ── reset ──────────────────────────────────
    const handleReset = () => {
        setResults([]);
        setPage(1);
        setTotalPages(1);
        setTotalCount(0);
        setGaji('');
        setError(null);
        setLoading(false);
        setBudgetReady(false);
        setSelectedLokasi([]);
        setMaxRangeBudget(0);
    };

    /* ── UI sub-components ─────────────────── */

    const SalaryForm = ({ isMobile }: { isMobile?: boolean }) => (
        <form onSubmit={handleSubmit}>
            <label htmlFor="gaji" className="block text-sm font-medium text-gray-700 mb-1">
                Gaji kamu perbulan
            </label>
            <div className={`flex ${isMobile ? "flex-col" : "flex-col sm:flex-row"} gap-3`}>
                <div className="relative flex-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <WalletIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        name="gaji" id="gaji" type="text" inputMode="numeric"
                        value={gaji}
                        onChange={(e) => setGaji(formatIDRNumber(e.target.value))}
                        className="block w-full rounded-md border border-gray-300 pl-10 py-3 text-gray-900 focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
                        placeholder="Masukkan gaji kamu"
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors sm:w-auto w-full"
                >
                    Hitung
                </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Masukkan nominal gaji tanpa koma atau titik.</p>
            {loading && <p className="text-sm text-gray-500 mt-2">Memuat hasil...</p>}
            {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}
        </form>
    );

    const BudgetSummary = () => (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#9ED4EE] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
                        <path d="M9 22V12h6v10" />
                    </svg>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Budget ideal kos kamu</p>
                    <p className="text-lg font-bold text-gray-900">
                        Rp{formatIDRNumber(maxRangeBudget.toString())}
                        <span className="text-sm font-normal text-gray-500 ml-1">/bulan</span>
                    </p>
                </div>
            </div>
            <button onClick={handleReset} className="text-sm text-gray-500 underline">
                Hitung ulang
            </button>
        </div>
    );

    /* ── render ───────────────────────────── */
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <nav className="text-sm mb-4">
                <ol className="list-none p-0 inline-flex">
                    <li className="flex items-center">
                        <Link to="/" className="text-gray-500 hover:text-brand-blue">Home</Link>
                        <span className="mx-3">/</span>
                    </li>
                    <li><span className="text-gray-700 font-medium">Kalkulator Budget</span></li>
                </ol>
            </nav>
            <div className="w-full border-b border-gray-200 py-2" />

            {/* Hero */}
            <div
                className="relative bg-cover bg-center rounded-2xl shadow-lg p-8 my-8 overflow-hidden h-[30vh] md:h-[330px] lg:h-[450px]"
                style={{ backgroundImage: "url('/images/hero-image-bg.webp')" }}
            >
                <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full">
                    <h1 className="text-2xl md:text-3xl font-bold">Kalkulator Budget</h1>
                    <p className="mb-4 text-sm md:text-md lg:text-lg max-w-4xl mx-auto">
                        Berapa sih budget ideal kamu untuk pengeluaran kos dalam sebulan? Tenang, kita bantu hitung!
                    </p>

                    {/* Desktop form — hidden once budget is ready */}
                    {!budgetReady && (
                        <div className="hidden md:block mt-8 w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-left">
                            <SalaryForm />
                        </div>
                    )}

                    {/* Desktop budget summary — shown after submit */}
                    {budgetReady && (
                        <div className="hidden md:block w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl px-8 py-5 text-left">
                            <BudgetSummary />
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile form */}
            {!budgetReady && (
                <div className="md:hidden mt-4">
                    <SalaryForm isMobile />
                </div>
            )}

            {/* Mobile budget summary */}
            {budgetReady && (
                <div className="md:hidden mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <BudgetSummary />
                </div>
            )}

            {/* ── Location filter chips ── */}
            {budgetReady && subscriptionSlugs.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700">Filter Lokasi</p>
                        <div className="flex gap-3 text-xs">
                            <button
                                onClick={() => { setSelectedLokasi([...subscriptionSlugs]); fetchResults(1, maxRangeBudget, [...subscriptionSlugs]); }}
                                className="text-brand-dark underline"
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => { setSelectedLokasi([]); fetchResults(1, maxRangeBudget, []); }}
                                className="text-gray-400 underline"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subscriptionSlugs.map((slug) => {
                            const isActive = selectedLokasi.includes(slug);
                            return (
                                <button
                                    key={slug}
                                    onClick={() => toggleLokasi(slug)}
                                    disabled={loading}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition
                                        ${isActive
                                            ? "bg-brand-dark text-white border-brand-dark"
                                            : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                                        } disabled:opacity-50`}
                                >
                                    {isActive && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {locationNames[slug] ?? formatSlug(slug)}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Results ── */}
            {budgetReady && (
                <div id="kost-results" className="mt-8">
                    {loading && (
                        <p className="text-center text-gray-500 text-sm py-8">Memuat kost...</p>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <p className="font-medium">Belum ada kost yang sesuai budget.</p>
                            <p className="text-sm mt-1">Coba ubah pilihan lokasi atau masukkan gaji yang berbeda.</p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <>
                            <h2 className="text-xl md:text-2xl font-bold mb-1">
                                Rekomendasi Kos Sesuai Budget
                            </h2>
                            <p className="text-sm text-gray-500 mb-5">
                                {totalCount} kost ditemukan
                                {selectedLokasi.length > 0 && ` di ${selectedLokasi.map(s => locationNames[s] ?? formatSlug(s)).join(', ')}`}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                                {results.map((kost) => (
                                    <KostCard key={kost.id} kost={kost} />
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={(p) => {
                                        if (p === page || loading) return;
                                        fetchResults(p, maxRangeBudget, selectedLokasi);
                                        document.getElementById('kost-results')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            )}

            <SubscriptionModal open={open} onClose={() => setOpen(false)} />
        </div>
    );
};

export default KalkulatorBudgetPage;
