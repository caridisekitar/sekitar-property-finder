import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { upgradeToPremium } from "@/lib/upgradeSubscription";
import { useAuth } from "@/hooks/useAuth";
import { PLAN_CONFIG } from "@/constants/plans";
import { securePost } from '@/lib/securePost';

type SubscriptionModalProps = {
  open: boolean;
  onClose: () => void;
};

type TargetPlan = "BASIC" | "PREMIUM" | "PREMIUM_PLUS";

export default function SubscriptionModal({
  open,
  onClose,
}: SubscriptionModalProps) {
  const location = useLocation();
  const { user, subscription } = useAuth();
  const plan = subscription?.plan; // BASIC | PREMIUM | undefined
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isBasicActive = plan === "BASIC";
  const isPremiumActive = plan === "PREMIUM";
  const isPremiumPlusActive = plan === "PREMIUM_PLUS";
  const isVisitor = !user;
  const isSubscriptionEmpty = !subscription;
  const premium = PLAN_CONFIG.PREMIUM;
  const premiumPlus = PLAN_CONFIG.PREMIUM_PLUS;
  const [hasTriggered, setHasTriggered] = useState(false);


  /* ===============================
     LOCK BODY SCROLL
  =============================== */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    if (
      user &&
      location.state?.openSubscription &&
      location.state?.targetPlan &&
      !loading &&
      !hasTriggered
    ) {
      setHasTriggered(true)
      handleSubscribe(location.state.targetPlan)

      // clear state
      navigate(location.pathname, { replace: true })
    }
  }, [user, location.state])

  /* ===============================
     SUBSCRIBE / UPGRADE HANDLER
  =============================== */
  const handleSubscribe = async (targetPlan: TargetPlan) => {
    if (!user) {
      localStorage.setItem(
        "postLoginAction",
        JSON.stringify({
          type: "SUBSCRIBE",
          payload: { plan: targetPlan },
        })
      );

      // navigate("/login");
      navigate("/register", {
        state: { redirect: "subscribe", targetPlan },
      });
      return;
    }

    if (loading) return;

    // BASIC → no payment
    if (targetPlan === "BASIC") {
      alert("Akun kamu sudah Basic");
      return;
    }

    // prevent same plan
    if (plan === targetPlan) {
      alert(`Akun kamu sudah ${targetPlan}`);
      return;
    }

    // prevent downgrade
    if (plan === "PREMIUM_PLUS" && targetPlan === "PREMIUM") {
      alert("Tidak bisa downgrade dari Premium+");
      return;
    }

    try {
      setLoading(true);

      const selected = PLAN_CONFIG[targetPlan];
      const selectedLocations = location.state?.locations || [];

      const res = await securePost("/duitku/create", "POST", {
        amount: selected.amount,
        product_name: selected.product_name,
        plan: targetPlan,
        user_id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        locations: selectedLocations,
      });

      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      }
    } catch (err: any) {
      alert(err?.message || "Gagal memproses pembayaran");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-400 hover:text-black text-2xl"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src="/images/logo-header-sekitar.png"
            alt="Logo"
            className="h-16 w-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-center">
          Pilih tipe akun kamu
        </h1>
        <p className="text-gray-500 text-center mt-2 text-sm">
          Mulai dari Basic, atau langsung unlock semua fitur di Premium —
          terserah kamu 😉
        </p>

        {/* Pricing Cards */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* ================= BASIC ================= */}
          <div className="border rounded-2xl p-8 shadow-sm flex flex-col justify-between order-2 lg:order-1">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <img src="/images/icons/basic.png" alt="basic" />
                </div>
                <div>
                  <p className="font-semibold">Basic</p>
                  <p className="text-sm text-gray-400">Limited</p>
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-2">Gratis</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Mau coba yang gratis dulu? Nggak jadi masalah, we got you!
              </p>

              <FeatureList plan="basic"/>
            </div>

            <button
              onClick={() => handleSubscribe("BASIC")}
              disabled={isBasicActive || isPremiumActive}
              className={`mt-8 w-full py-3 rounded-xl font-semibold transition
                ${
                  isBasicActive
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              {isBasicActive
                ? "Paket Aktif"
                : "Gratis"}
            </button>
          </div>

          {/* ================= PREMIUM ================= */}
          <div className="relative border-2 border-blue-400 rounded-2xl p-8 shadow-lg flex flex-col justify-between order-1 lg:order-2">
            {/* Badge */}
            <span className="absolute -top-4 right-4 bg-black text-white text-xs px-3 py-1 rounded-full">
              Recommended for you
            </span>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <img src="/images/icons/premium.png" alt="premium" />
                </div>
                <div>
                  <p className="font-semibold">Premium</p>
                  <p className="text-sm text-gray-400">Unlimited for 1 Location</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-red-400 line-through text-lg">
                  Rp150.000
                </span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Promo 🎉
                </span>
              </div>

              <h2 className="text-4xl font-bold mt-2">
                Rp{premium.amount.toLocaleString("id-ID")}{" "}
                <span className="text-sm font-normal text-gray-500">
                  per tahun
                </span>
              </h2>

              <p className="text-gray-500 mt-3 mb-6 text-sm">
                Cuma Rp8.200 perbulan, lebih murah dari harga kopi kamu
                sehari ☕
              </p>

              <FeatureList plan="premium"/>
            </div>

            <button
              onClick={() => handleSubscribe("PREMIUM")}
              disabled={loading || isPremiumActive || isPremiumPlusActive}
              className={`mt-8 w-full py-3 rounded-xl font-semibold transition
                ${
                  loading || isPremiumActive
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-400 text-white hover:bg-blue-500"
                }`}
            >
              {loading
                ? "Mengalihkan ke pembayaran..."
                : isPremiumActive
                ? "Paket Aktif"
                : isSubscriptionEmpty
                ? "Mulai Berlangganan"
                : "Upgrade ke Premium"}
            </button>

            {/* <button
              onClick={() => handleSubscribe("premium")}
              disabled={loading || isPremiumActive}
              className={`mt-8 w-full py-3 rounded-xl font-semibold transition
                ${
                  loading || isPremiumActive
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-400 text-white hover:bg-blue-500"
                }`}
            >
              {loading
                ? "Mengalihkan ke pembayaran..."
                : isPremiumActive
                ? "Paket Aktif"
                : "Upgrade ke Premium"}
            </button> */}
          </div>


          {/* ================= PREMIUM PLUS ================= */}
          <div className="relative border rounded-2xl p-8 shadow-lg flex flex-col justify-between order-1 lg:order-2">
            {/* Badge */}
            {/* <span className="absolute -top-4 right-4 bg-black text-white text-xs px-3 py-1 rounded-full">
              Recommended for you
            </span> */}

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <img src="/images/icons/premium.png" alt="premium" />
                </div>
                <div>
                  <p className="font-semibold">Premium+</p>
                  <p className="text-sm text-gray-400">Unlimited for 3 Locations</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-red-400 line-through text-lg">
                  Rp350.000
                </span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Promo 🎉
                </span>
              </div>

              <h2 className="text-4xl font-bold mt-2">
                Rp{premiumPlus.amount.toLocaleString("id-ID")}{" "}
                <span className="text-sm font-normal text-gray-500">
                  per tahun
                </span>
              </h2>

              <p className="text-gray-500 mt-3 mb-6 text-sm">
                Bebas akses ratusan kost di 3 lokasi berbeda, bisa pilih semau mu
              </p>

              <FeatureList plan="premium_plus"/>
            </div>

            <button
              onClick={() => handleSubscribe("PREMIUM_PLUS")}
              disabled={loading || isPremiumPlusActive}
              className={`mt-8 w-full py-3 rounded-xl font-semibold transition
                ${
                  loading || isPremiumPlusActive
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#96C8E2] text-white hover:bg-blue-500"
                }`}
            >
              {loading
                ? "Mengalihkan ke pembayaran..."
                : isPremiumPlusActive
                ? "Paket Aktif"
                : isPremiumActive
                ? "Upgrade ke Premium+"
                : isSubscriptionEmpty
                ? "Mulai Berlangganan"
                : "Upgrade ke Premium+"}
            </button>

          </div>


        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* Feature List (Internal)   */
/* ========================= */

type Plan = "basic" | "premium" | "premium_plus";

function FeatureList({ plan }: { plan: Plan }) {
  const features = [
    {
      text: "Pilih 1 lokasi kost saja",
      plans: ["premium"],
      highlight: true,
    },
    {
      text: "Pilih 3 lokasi kost",
      plans: ["premium_plus"],
      highlight: true,
    },
    {
      text: "Akses ratusan informasi kost",
      plans: ["basic", "premium", "premium_plus"],
      limited: ["basic"],
    },
    {
      text: "Akses fitur Kalkulator",
      plans: ["basic", "premium", "premium_plus"],
      limited: ["basic"],
    },
    {
      text: "Akses fitur Maps",
      plans: ["basic", "premium", "premium_plus"],
      limited: ["basic"],
    },
    {
      text: "Bebas request kost via fitur Wishlist",
      plans: ["basic", "premium", "premium_plus"],
    },
    {
      text: "Akses fitur Daftarkan Kost Mu",
      plans: ["premium", "premium_plus"],
    },
    {
      text: "Akses fitur Daftarkan Bisnis Mu",
      plans: ["premium", "premium_plus"],
    },
    {
      text: "Jumlah list kost akan terus bertambah ratusan setiap bulan nya",
      plans: ["premium", "premium_plus"],
    },
  ];

  return (
    <ul className="space-y-3 text-sm">
      {features
        .filter((f) => f.plans.includes(plan))
        .map((f, i) => {
          const limited = f.limited?.includes(plan);

          return (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-0.5 text-green-500">✔</span>

              <span
                className={`text-gray-600 ${
                  f.highlight ? "font-semibold text-gray-900" : ""
                }`}
              >
                {f.text}{" "}
                {limited && (
                  <span className="text-gray-400">(terbatas)</span>
                )}
              </span>
            </li>
          );
        })}

      {/* Show disabled features for Basic */}
      {plan === "basic" && (
        <>
          <li className="flex gap-3 items-start">
            <span className="mt-0.5 text-red-400">✖</span>
            <span className="text-gray-600">Akses fitur Daftarkan Kost Mu</span>
          </li>

          <li className="flex gap-3 items-start">
            <span className="mt-0.5 text-red-400">✖</span>
            <span className="text-gray-600">
              Akses fitur Daftarkan Bisnis Mu
            </span>
          </li>

          <li className="flex gap-3 items-start">
            <span className="mt-0.5 text-red-400">✖</span>
            <span className="text-gray-600">
              Jumlah list kost akan terus bertambah ratusan setiap bulan nya
            </span>
          </li>
        </>
      )}
    </ul>
  );
}