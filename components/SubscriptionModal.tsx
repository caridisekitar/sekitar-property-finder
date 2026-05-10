import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { upgradeToPremium } from "@/lib/upgradeSubscription";
import { useAuth } from "@/hooks/useAuth";
import { usePlans } from "@/hooks/usePlans"
import { securePost } from '@/lib/securePost';
import LocationSelectModal from "@/components/LocationSelectModal";

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
  const { plans } = usePlans()

  const plan = subscription?.plan; // BASIC | PREMIUM | undefined
  const [loading, setLoading] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<TargetPlan | null>(null);
  const [locationSelectOpen, setLocationSelectOpen] = useState(false);
  const navigate = useNavigate();
  const isBasicActive = plan === "BASIC";
  const isPremiumActive = plan === "PREMIUM";
  const isPremiumPlusActive = plan === "PREMIUM_PLUS";
  const isVisitor = !user;
  const isSubscriptionEmpty = !subscription;
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
      plans &&
      location.state?.openSubscription &&
      location.state?.targetPlan &&
      !loading &&
      !hasTriggered
    ) {
      setHasTriggered(true)
      const targetPlan = location.state.targetPlan as TargetPlan
      const preSelectedLocations: { id: string }[] | undefined = location.state.locations

      // clear state first
      navigate(location.pathname, { replace: true })

      if (preSelectedLocations && preSelectedLocations.length > 0) {
        // RegisterPage already collected locations → go straight to payment
        proceedWithPayment(targetPlan, preSelectedLocations.map((l) => l.id))
      } else {
        // LoginPage flow → open LocationSelectModal via handleSubscribe
        handleSubscribe(targetPlan)
      }
    }
  }, [user, plans, location.state]);

  /* ===============================
     SUBSCRIBE / UPGRADE HANDLER
  =============================== */
  const handleSubscribe = async (targetPlan: TargetPlan) => {
    if (!user) {
      localStorage.setItem(
        "postLoginAction",
        JSON.stringify({
          type: "SUBSCRIBE",
          payload: { plan: targetPlan, plan_id: plans?.[targetPlan]?.id ?? null },
        })
      );

      navigate("/register", {
        state: { redirect: "subscribe", targetPlan },
      });
      return;
    }

    if (loading) return;

    // BASIC → no payment needed, just close
    if (targetPlan === "BASIC") {
      onClose();
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

    // Show location selection before proceeding to payment
    setPendingPlan(targetPlan);
    setLocationSelectOpen(true);
  };

  const proceedWithPayment = async (targetPlan: TargetPlan, selectedLocations: string[]) => {
    if (!user || !plans) return;
    try {
      setLoading(true);

      const selected = plans[targetPlan];

      const res = await securePost("/duitku/create", "POST", {
        amount: selected.amount,
        product_name: selected.product_name,
        plan: selected.name,
        plan_id: selected.id,
        user_id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        locations: selectedLocations,
        is_upgrade: plan === "PREMIUM" && targetPlan === "PREMIUM_PLUS",
      });

      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        alert("Gagal mendapatkan link pembayaran. Silakan coba lagi.");
      }
    } catch (err: any) {
      alert(err?.message || "Gagal memproses pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = (locations: { id: string; name: string; [key: string]: any }[]) => {
    setLocationSelectOpen(false);
    if (pendingPlan) {
      proceedWithPayment(pendingPlan, locations.map((l) => l.slug));
    }
  };

  if (!open || !plans) return null;

  const premium = plans.PREMIUM
  const premiumPlus = plans.PREMIUM_PLUS

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
          <div className="border rounded-2xl p-6 shadow-sm flex flex-col justify-between order-2 lg:order-1">
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
          <div className="relative border-2 border-blue-400 rounded-2xl p-6 shadow-lg flex flex-col justify-between order-1 lg:order-2">
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

              <h2 className="text-3xl font-bold mt-2">
                Rp{premium.amount.toLocaleString("id-ID")}{" "}
                <span className="text-xs font-normal text-gray-500">
                  akses setahun
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
          <div className="relative border rounded-2xl p-6 shadow-lg flex flex-col justify-between order-1 lg:order-2">
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

              <h2 className="text-3xl font-bold mt-2">
                Rp{premiumPlus.amount.toLocaleString("id-ID")}{" "}
                <span className="text-xs font-normal text-gray-500">
                  akses setahun
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

      <LocationSelectModal
        isOpen={locationSelectOpen}
        plan={pendingPlan ?? "BASIC"}
        onClose={() => setLocationSelectOpen(false)}
        onSubmit={handleLocationSubmit}
        lockedSlugs={
          pendingPlan === "PREMIUM_PLUS" && plan === "PREMIUM"
            ? (subscription?.locations ?? [])
            : []
        }
      />
    </div>
  );
}

/* ========================= */
/* Feature List (Internal)   */
/* ========================= */

type Plan = "basic" | "premium" | "premium_plus";

const featureMap: Record<Plan, { text: string; highlight?: boolean; limited?: boolean }[]> = {
  basic: [
    { text: "Akses informasi kost", limited: true },
    { text: "Akses fitur di Sekitar", limited: true },
    { text: "Bebas request survey kost di menu Wishlist" },
  ],
  premium: [
    { text: "Pilih 1 lokasi kost saja (Jkt/Bali/Depok/Bdg/Jogja)", highlight: true },
    { text: "Cocok utk kamu yang buru-buru mencari kost" },
    { text: "Semua nomor pemilik kost sudah di verifikasi, menghindari penipuan" },
    { text: "Bebas akses ratusan informasi kost" },
    { text: "Bebas akses semua fitur di Sekitar" },
    { text: "Harga transparant, Sekitar tidak ambil komisi apapun dari setiap bookingan kost" },
    { text: "Bebas request survey kost di menu Wishlist" },
  ],
  premium_plus: [
    { text: "Pilih 3 lokasi kost (Jkt/Bali/Depok/Bdg/Jogja)", highlight: true },
    { text: "Cocok utk kamu yang buru-buru mencari kost" },
    { text: "Semua nomor pemilik kost sudah di verifikasi, menghindari penipuan kost" },
    { text: "Bebas akses ratusan informasi kost" },
    { text: "Bebas akses semua fitur di Sekitar" },
    { text: "Harga transparant, Sekitar tidak mengambil komisi apapun dari setiap bookingan kost" },
    { text: "Bebas request survey kost di menu Wishlist" },
  ],
};

function FeatureList({ plan }: { plan: Plan }) {
  const features = featureMap[plan];

  return (
    <ul className="space-y-3 text-sm">
      {features.map((f, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="mt-0.5 text-green-500">✔</span>
          <span className={`text-gray-600 ${f.highlight ? "font-semibold text-gray-900" : ""}`}>
            {f.text}{" "}
            {f.limited && <span className="text-gray-400">(terbatas)</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}