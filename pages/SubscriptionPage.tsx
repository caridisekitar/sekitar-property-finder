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

            <Feature text="Akses ratusan informasi kost" limited />
            <Feature text="Akses fitur Kalkulator" limited />
            <Feature text="Akses fitur Maps" limited />
            <Feature text="Bebas request kost via fitur Wishlist" />
            <Feature text="Akses fitur Daftarkan Kost Mu" disabled />
            <Feature text="Akses fitur Daftarkan Kost Bisnis Mu" disabled />
            <Feature text="Jumlah list kost akan terus bertambah setiap bulan" disabled />

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
              <span className="text-gray-500 mb-1">per tahun</span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                Promo 🎉
              </span>
            </div>

            <p className="text-gray-500 mb-8">
              Cuma Rp8.200 perbulan, lebih murah dari harga kopi kamu sehari ☕
            </p>

            <Feature text="Akses ratusan informasi kost tanpa batas" />
            <Feature text="Akses fitur Kalkulator sepuasnya" />
            <Feature text="Akses fitur Maps" />
            <Feature text="Bebas request kost via fitur Wishlist" />
            <Feature text="Akses fitur Daftarkan Kost Mu" />
            <Feature text="Akses fitur Daftarkan Bisnis Mu" />
            <Feature text="Jumlah list kost terus bertambah setiap bulan" />

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
}: {
  text: string;
  disabled?: boolean;
  limited?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <span className={disabled ? "text-red-500" : "text-green-500"}>
        {disabled ? "✕" : "✓"}
      </span>
      <p className={`text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}>
        {text} {limited && <span className="font-medium">(terbatas)</span>}
      </p>
    </div>
  );
}
