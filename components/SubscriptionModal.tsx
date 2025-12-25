import { useEffect } from "react";

type SubscriptionModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SubscriptionModal({
  open,
  onClose,
}: SubscriptionModalProps) {
  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

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

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          {/* <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
            
          </div> */}
          <img src="/images/logo-header-sekitar.png" alt="Logo" className="h-16 w-auto" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Pilih tipe akun kamu
        </h1>
        <p className="text-gray-500 text-center mt-2 text-sm">
          Mulai dari Basic, atau langsung unlock semua fitur di Premium —
          terserah kamu 😉
        </p>

        {/* Pricing Cards */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
          {/* BASIC */}
          <div className="border rounded-2xl p-8 shadow-sm flex flex-col justify-between">
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
              <p className="text-gray-500 mb-6">
                Mau coba yang gratis dulu? Nggak jadi masalah, we got you!
              </p>

              <FeatureList basic />
            </div>

            <button className="mt-8 w-full py-3 rounded-xl bg-black text-white font-semibold">
              Gratis
            </button>
          </div>

          {/* PREMIUM */}
          <div className="relative border-2 border-blue-400 rounded-2xl p-8 shadow-lg flex flex-col justify-between">
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
                  <p className="text-sm text-gray-400">Unlimited</p>
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
                Rp99.000{" "}
                <span className="text-base font-normal text-gray-500">
                  per tahun
                </span>
              </h2>

              <p className="text-gray-500 mt-3 mb-6">
                Cuma Rp8.200 perbulan, lebih murah dari harga kopi kamu
                sehari ☕
              </p>

              <FeatureList />
            </div>

            <button
              onClick={() => alert("Proceed to payment")}
              className="mt-8 w-full py-3 rounded-xl bg-blue-400 text-white font-semibold hover:bg-blue-500 transition"
            >
              Mulai langganan
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
function FeatureList({ basic = false }: { basic?: boolean }) {
  const features = [
    { text: "Akses ratusan informasi kost", ok: true, limited: basic },
    { text: "Akses fitur Kalkulator", ok: true, limited: basic },
    { text: "Akses fitur Maps", ok: true, limited: basic },
    { text: "Bebas request kost via Wishlist", ok: true },
    { text: "Newsletter mingguan", ok: true },
    { text: "Akses fitur Daftarkan Kost Mu", ok: !basic },
    { text: "Akses fitur Daftarkan Bisnis Mu", ok: !basic },
    {
      text: "Jumlah list kost akan terus bertambah setiap bulan",
      ok: !basic,
    },
  ];

  return (
    <ul className="space-y-3 text-sm">
      {features.map((f, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span
            className={`mt-0.5 ${
              f.ok ? "text-green-500" : "text-red-400"
            }`}
          >
            {f.ok ? "✔" : "✖"}
          </span>
          <span className="text-gray-600">
            {f.text}{" "}
            {f.limited && (
              <span className="text-gray-400">(terbatas)</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
