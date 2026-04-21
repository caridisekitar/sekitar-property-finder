import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { securePost } from '@/lib/securePost';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from "@/components/LoadingOverlay";
import { usePlans } from "@/hooks/usePlans";
import LocationSelectModal from "@/components/LocationSelectModal";
import DropdownMobileMenu from '@/components/profile/DropdownMobileMenu';

type PlanType = "BASIC" | "PREMIUM" | "PREMIUM_PLUS";

type Location = {
  id: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  icon: string;
};

export default function UpgradePlanPage() {
  const navigate = useNavigate();
  const { user, subscription, loading: authLoading } = useAuth();
  const { plans, loading: plansLoading } = usePlans();

  const [pendingPlan, setPendingPlan] = useState<PlanType | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  if (authLoading || plansLoading) return <LoadingOverlay message="Memuat ..." />;
  if (!user || !plans) return null;

  const currentPlan = subscription?.plan ?? "BASIC";

  /* ── step 1: pick plan → open location modal ── */
  const handleSelectPlan = (plan: PlanType) => {
    if (upgradeLoading) return;
    setUpgradeError("");
    setPendingPlan(plan);
    setLocationModalOpen(true);
  };

  /* ── step 2: locations chosen → call Duitku ── */
  const handleLocationSubmit = async (locations: Location[]) => {
    if (!pendingPlan || !user || !plans) return;
    setLocationModalOpen(false);
    setUpgradeError("");
    setUpgradeLoading(true);

    try {
      const selectedPlan = plans[pendingPlan];

      const res = await securePost("/duitku/create", "POST", {
        amount:       selectedPlan.amount,
        product_name: selectedPlan.product_name,
        plan:         selectedPlan.name,
        plan_id:      selectedPlan.id,
        user_id:      user.id,
        email:        user.email,
        phone:        user.phone,
        name:         user.name,
        locations:    locations.map((l) => l.slug),
        is_upgrade:   currentPlan === "PREMIUM" && pendingPlan === "PREMIUM_PLUS",
      });

      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        throw new Error(res.message || "Payment URL tidak tersedia");
      }
    } catch (err: any) {
      setUpgradeError(err?.message || "Gagal memproses pembayaran, coba lagi.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user} />

      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <DropdownMobileMenu user={user} />

        <div className="w-full border-b border-gray-200 py-2 mb-8">
          <h1 className="text-3xl font-bold text-brand-dark">Upgrade Langganan</h1>
        </div>

        {upgradeError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {upgradeError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ─── BASIC ─── */}
          <div className="border rounded-2xl p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <img src="/images/icons/basic.png" alt="basic" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Basic</p>
                <p className="text-sm text-gray-400">Limited</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-2">Gratis</h2>
            <p className="text-gray-500 mb-8 text-xs">
              Mau coba yang gratis dulu? Ngga jadi masalah, we got you!
            </p>

            <Feature text="Akses ratusan informasi kost" limited />
            <Feature text="Akses fitur Kalkulator" limited />
            <Feature text="Akses fitur Maps" limited />
            <Feature text="Bebas request kost via fitur Wishlist" />
            <Feature text="Akses fitur Daftarkan Kost Mu" disabled />
            <Feature text="Akses fitur Daftarkan Bisnis Mu" disabled />
            <Feature text="Jumlah list kost akan terus bertambah setiap bulan" disabled />

            {currentPlan === "BASIC" && (
              <div className="mt-auto pt-8">
                <div className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium text-center opacity-60 cursor-not-allowed text-sm">
                  Plan sekarang
                </div>
              </div>
            )}
          </div>

          {/* ─── PREMIUM ─── */}
          <div className="relative border-2 border-blue-400 rounded-2xl p-8 shadow-lg flex flex-col">
            <span className="absolute top-4 right-4 bg-black text-white text-xs px-3 py-1 rounded-full">
              Recommended
            </span>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <img src="/images/icons/premium.png" alt="premium" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Premium</p>
                <p className="text-sm text-gray-400">
                  Unlimited for {plans.PREMIUM.max_locations} Location
                </p>
              </div>
            </div>

            <p className="text-red-500 line-through mb-1 text-left">Rp150.000</p>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full w-fit mb-2">
              Promo 🎉
            </span>
            <div className="flex items-end gap-2 mb-2">
              <h2 className="text-4xl font-bold">
                Rp{plans.PREMIUM.amount.toLocaleString("id-ID")}
              </h2>
              <span className="text-gray-500 mb-1 text-xs">per tahun</span>
            </div>
            <p className="text-gray-500 mb-8 text-xs">
              Cuma Rp8.200 perbulan, lebih murah dari harga kopi kamu sehari ☕
            </p>

            <Feature text="Pilih 1 lokasi kost saja" bold />
            <Feature text="Akses ratusan informasi kost" />
            <Feature text="Akses fitur Kalkulator" />
            <Feature text="Akses fitur Maps" />
            <Feature text="Bebas request kost via fitur Wishlist" />
            <Feature text="Akses fitur Daftarkan Kost Mu" />
            <Feature text="Akses fitur Daftarkan Bisnis Mu" />
            <Feature text="Jumlah list kost akan terus bertambah ratusan setiap bulan nya" />

            <div className="mt-auto pt-8">
              {currentPlan === "PREMIUM" || currentPlan === "PREMIUM_PLUS" ? (
                <div className="w-full bg-black text-white py-3 rounded-lg font-medium text-center opacity-50 cursor-not-allowed text-sm">
                  {currentPlan === "PREMIUM" ? "Plan sekarang" : "Sudah di plan lebih tinggi"}
                </div>
              ) : (
                <button
                  onClick={() => handleSelectPlan("PREMIUM")}
                  disabled={upgradeLoading}
                  className={`w-full py-3 rounded-lg font-medium transition text-sm ${
                    upgradeLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-400 text-white hover:bg-blue-500"
                  }`}
                >
                  {upgradeLoading && pendingPlan === "PREMIUM"
                    ? "Memproses..."
                    : "Upgrade ke Premium"}
                </button>
              )}
            </div>
          </div>

          {/* ─── PREMIUM PLUS ─── */}
          <div className="border rounded-2xl p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <img src="/images/icons/premium.png" alt="premium plus" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Premium Plus</p>
                <p className="text-sm text-gray-400">
                  Unlimited for {plans.PREMIUM_PLUS.max_locations} Locations
                </p>
              </div>
            </div>

            <p className="text-red-500 line-through mb-1 text-left">Rp350.000</p>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full w-fit mb-2">
              Promo 🎉
            </span>
            <div className="flex items-end gap-2 mb-2">
              <h2 className="text-4xl font-bold">
                Rp{plans.PREMIUM_PLUS.amount.toLocaleString("id-ID")}
              </h2>
              <span className="text-gray-500 mb-1 text-xs">per tahun</span>
            </div>
            <p className="text-gray-500 mb-8 text-xs">
              Bebas akses ratusan kost di 3 lokasi berbeda, bisa pilih semau mu
            </p>

            <Feature text="Pilih 3 lokasi kost" bold />
            <Feature text="Akses ratusan informasi kost" />
            <Feature text="Akses fitur Kalkulator" />
            <Feature text="Akses fitur Maps" />
            <Feature text="Bebas request kost via fitur Wishlist" />
            <Feature text="Akses fitur Daftarkan Kost Mu" />
            <Feature text="Akses fitur Daftarkan Bisnis Mu" />
            <Feature text="Jumlah list kost akan terus bertambah ratusan setiap bulan nya" />

            <div className="mt-auto pt-8">
              {currentPlan === "PREMIUM_PLUS" ? (
                <div className="w-full bg-gray-500 text-white py-3 rounded-lg font-medium text-center opacity-50 cursor-not-allowed text-sm">
                  Plan sekarang
                </div>
              ) : (
                <button
                  onClick={() => handleSelectPlan("PREMIUM_PLUS")}
                  disabled={upgradeLoading}
                  className={`w-full py-3 rounded-lg font-medium transition text-sm ${
                    upgradeLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#96C8E2] text-white hover:bg-blue-500"
                  }`}
                >
                  {upgradeLoading && pendingPlan === "PREMIUM_PLUS"
                    ? "Memproses..."
                    : "Upgrade ke Premium+"}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Location selection modal — opens after plan click */}
      <LocationSelectModal
        isOpen={locationModalOpen}
        plan={pendingPlan ?? "BASIC"}
        onClose={() => setLocationModalOpen(false)}
        onSubmit={handleLocationSubmit}
        lockedSlugs={
          pendingPlan === "PREMIUM_PLUS" && currentPlan === "PREMIUM"
            ? (subscription?.locations ?? [])
            : []
        }
      />
    </div>
  );
}


function Feature({
  text,
  disabled = false,
  limited = false,
  bold = false,
}: {
  text: string;
  disabled?: boolean;
  limited?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <span className={disabled ? "text-red-500" : "text-green-500"}>
        {disabled ? "✕" : "✓"}
      </span>
      <p
        className={`text-sm text-left
          ${disabled ? "text-gray-400" : "text-gray-700"}
          ${bold ? "font-semibold text-gray-900" : ""}
        `}
      >
        {text} {limited && <span className="font-medium">(terbatas)</span>}
      </p>
    </div>
  );
}
