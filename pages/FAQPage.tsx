import { useState } from "react";


const FAQ_DATA = [
  {
    category: "pembayaran",
    q: "Berapa lama masa berlaku subscription Sekitar?",
    a: "Subscription Sekitar <b>berlaku selama 1 tahun penuh</b> sejak tanggal pembelian. Selama periode tersebut, kamu bisa bebas mengakses seluruh konten dan fitur yang tersedia tanpa batas.",
  },
  {
    category: "keamanan",
    q: "Apakah akun Sekitar bisa dipindah tangankan ke orang lain?",
    a: "Tidak bisa.\nSatu akun Sekitar hanya boleh digunakan oleh <b>satu pengguna</b>.\nJika sistem kami mendeteksi aktivitas pemindahan akun atau penggunaan tidak wajar, <b>akun akan disuspend secara permanen tanpa pengembalian dana (no refund).</b>",
  },
  {
    category: "tentang",
    q: "Apakah jumlah kost/hunian di Sekitar akan bertambah?",
    a: "Iya, tentu 😊\nJumlah kost dan hunian di Sekitar <b>akan terus bertambah setiap bulan</b>, karena tim kami rutin melakukan survei langsung ke lapangan. Jadi kamu nggak perlu khawatir kehabisan pilihan.",
  },
  {
    category: "tentang",
    q: "Bisa request kost atau hunian tertentu nggak?",
    a: "Bisa, dan <b>GRATIS</b> 🙌\nKamu cukup masuk ke laman <b>Wishlist</b>, lalu klik fitur request.\nTim Sekitar akan mencoba membantu mencarikan dan mensurvei kost yang kamu butuhkan.",
  },
  {
    category: "tentang",
    q: "Apakah Sekitar bisa diakses di semua device?",
    a: "Ya, Sekitar bisa diakses di <b>semua device</b> (laptop, tablet, dan smartphone).\nNamun, untuk pengalaman terbaik—terutama saat melihat detail foto, video, dan insight hunian—<b>kami merekomendasikan akses melalui laptop atau desktop.</b>",
  },
  {
    category: "tentang",
    q: "Apakah Sekitar adalah agen atau perantara kost?",
    a: "Bukan.\nSekitar <b>bukan agen dan tidak mengambil komisi apapun dari pemilik kost</b>.\nKami adalah platform kurasi dan informasi hunian, sehingga keputusan dan komunikasi tetap langsung antara kamu dan pemilik kost.",
  },
  {
    category: "tentang",
    q: "Apakah harga dan informasi kost di Sekitar selalu akurat?",
    a: "Kami berusaha semaksimal mungkin menjaga akurasi data.\nSeluruh hunian di Sekitar <b>disurvei langsung oleh tim kami</b>, namun harga dan ketersediaan kamar dapat berubah sewaktu-waktu sesuai kebijakan pemilik kost.\nKami menyarankan untuk tetap melakukan konfirmasi langsung sebelum memutuskan.",
  },
  {
    category: "tentang",
    q: "Apakah Sekitar menjamin ketersediaan kamar?",
    a: "Tidak.\nSekitar menyediakan <b>informasi dan insight hunian</b>, bukan sistem booking.\nKetersediaan kamar sepenuhnya tergantung pada pemilik atau pengelola kost masing-masing.",
  },
  {
    category: "keamanan",
    q: "Apakah data pribadi saya aman di Sekitar?",
    a: "Ya.\nKami menjaga keamanan data pengguna dan <b>tidak membagikan informasi pribadi ke pihak ketiga</b> tanpa izin.\nData kamu hanya digunakan untuk keperluan layanan di dalam platform Sekitar.",
  },
  {
    category: "pembayaran",
    q: "Apakah subscription bisa dibatalkan atau direfund?",
    a: "Saat ini, <b>subscription yang sudah aktif tidak dapat dibatalkan maupun direfund</b>.\nKami menyarankan untuk memanfaatkan fitur preview dan informasi gratis sebelum melakukan pembelian.",
  },
  {
    category: "tentang",
    q: "Apa bedanya Sekitar dengan platform kost lainnya?",
    a: "Sekitar fokus pada <b>kurasi, insight lokal, dan pengalaman tinggal</b>, bukan sekadar daftar kost.\nKami membantu kamu memahami <b>vibe lingkungan, keseharian, dan kecocokan gaya hidup</b>, supaya kamu bisa memilih hunian dengan lebih yakin.",
  },
  {
    category: "tentang",
    q: "Apakah Sekitar hanya tersedia untuk wilayah Jakarta?",
    a: "Untuk saat ini, Sekitar <b>berfokus di wilayah Jakarta dan sekitarnya</b>.\nNamun, kami berencana untuk memperluas jangkauan ke kota lain secara bertahap.",
  },
  {
    category: "tentang",
    q: "Bagaimana jika saya mengalami kendala saat menggunakan website?",
    a: "Kamu bisa menghubungi tim Sekitar melalui <b>email atau kanal bantuan yang tersedia di website</b>.\nKami akan berusaha membantu secepat mungkin.",
  },
];


const CATEGORIES = [
  { key: "all", label: "Semua" },
  { key: "tentang", label: "Tentang Sekitar" },
  { key: "pembayaran", label: "Pembayaran & Subscription" },
  { key: "keamanan", label: "Keamanan" },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(0);

  // Filter FAQ based on category
  const filteredFaq =
    activeCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === activeCategory);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-gray-500 text-sm sm:text-base">
            Need answers? We got 'em.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-6 border-b mb-10 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const count =
              cat.key === "all"
                ? FAQ_DATA.length
                : FAQ_DATA.filter((f) => f.category === cat.key).length;

            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setOpenIndex(0);
                }}
                className={`pb-4 text-xs sm:text-sm font-semibold tracking-widest whitespace-nowrap
                  ${
                    activeCategory === cat.key
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaq.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="bg-gray-50 rounded-xl">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">🔗</span>
                    <span className="font-medium text-gray-800">
                      {item.q}
                    </span>
                  </div>

                  <svg
                    className={`w-5 h-5 text-blue-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    className="px-5 pb-5 text-gray-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: item.a.replace(/\n/g, "<br />"),
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}