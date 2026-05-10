export default function SubscriptionPlans() {
  return (
    <section className="w-full px-4 py-16 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Sekitar" className="h-10" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Pilih tipe akun kamu
        </h1>
        <p className="text-gray-500 mt-2">
          Mulai dari Basic, atau langsung unlock semua fitur di Premium — terserah kamu 😊
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* BASIC */}
          <div className="border rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                🛡️
              </div>
              <div>
                <p className="font-semibold text-gray-900">Basic</p>
                <p className="text-sm text-gray-400">Limited</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-2">Gratis</h2>
            <p className="text-gray-500 mb-8">
              Mau coba yang gratis dulu? Ngga jadi masalah, we got you!
            </p>

            <Feature text="Akses informasi kost" limited />
            <Feature text="Akses fitur di Sekitar" limited />
            <Feature text="Bebas request survey kost di menu Wishlist" />

            <button className="mt-8 w-full bg-black text-white py-3 rounded-lg font-medium">
              Gratis
            </button>
          </div>

          {/* PREMIUM */}
          <div className="relative border-2 border-blue-400 rounded-2xl p-8 shadow-lg">
            <span className="absolute top-4 right-4 bg-black text-white text-xs px-3 py-1 rounded-full">
              Recommended for you
            </span>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                👑
              </div>
              <div>
                <p className="font-semibold text-gray-900">Premium</p>
                <p className="text-sm text-gray-400">Unlimited</p>
              </div>
            </div>

            <p className="text-red-500 line-through mb-1">Rp150.000</p>
            <div className="flex items-end gap-2 mb-2">
              <h2 className="text-4xl font-bold">Rp99.000</h2>
              <span className="text-gray-500 mb-1">akses setahun</span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                Promo 🎉
              </span>
            </div>

            <p className="text-gray-500 mb-8">
              Cuma Rp8.200 perbulan, lebih murah dari harga kopi kamu sehari ☕
            </p>

            <Feature text="Pilih 1 lokasi kost saja (Jkt/Bali/Depok/Bdg/Jogja)" bold />
            <Feature text="Cocok utk kamu yang buru-buru mencari kost" />
            <Feature text="Semua nomor pemilik kost sudah di verifikasi, menghindari penipuan" />
            <Feature text="Bebas akses ratusan informasi kost" />
            <Feature text="Bebas ⁠akses semua fitur di Sekitar" />
            <Feature text="Harga transparant, Sekitar tidak ambil komisi apapun dari setiap bookingan kost" />
            <Feature text="Bebas request survey kost di menu Wishlist" />

            <button className="mt-8 w-full bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition">
              Mulai langganan
            </button>
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
              <span className="text-gray-500 mb-1 text-xs">akses setahun</span>
            </div>
            <p className="text-gray-500 mb-8 text-xs">
              Bebas akses ratusan kost di 3 lokasi berbeda, bisa pilih semau mu
            </p>

            <Feature text="Pilih 3 lokasi kost (Jkt/Bali/Depok/Bdg/Jogja)" bold />
            <Feature text="Cocok utk kamu yang buru-buru mencari kost" />
            <Feature text="emua nomor pemilik kost sudah di verifikasi, menghindari penipuan kost" />
            <Feature text="Bebas akses ratusan informasi kost" />
            <Feature text="Bebas ⁠akses semua fitur di Sekitar" />
            <Feature text="Harga transparant, Sekitar tidak mengambil komisi apapun dari setiap bookingan kost" />
            <Feature text="Bebas request survey kost di menu Wishlist" />

            <button className="mt-8 w-full bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition">
              Mulai langganan
            </button>
          </div>

        </div>
      </div>
    </section>
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
