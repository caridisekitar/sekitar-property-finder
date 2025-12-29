import { useState } from "react";


const FAQ_DATA = {
  definitions: [
    {
      q: "Berapa lama masa berlaku subscription Sekitar?",
      a: "Subscription Sekitar berlaku selama 1 tahun penuh sejak tanggal pembelian. Selama periode tersebut, kamu bisa bebas mengakses seluruh konten dan fitur yang tersedia tanpa batas.",
    },
    { q: "Apakah akun Sekitar bisa dipindah tangankan ke orang lain?", a: "Tidak bisa. \nSatu akun Sekitar hanya boleh digunakan oleh satu pengguna. \nJika sistem kami mendeteksi aktivitas pemindahan akun atau penggunaan tidak wajar, akun akan disuspend secara permanen tanpa pengembalian dana (no refund)." },
    { q: "Apakah jumlah kost/hunian di Sekitar akan bertambah?", a: "Iya, tentu 😊 \n Jumlah kost dan hunian di Sekitar akan terus bertambah setiap bulan, karena tim kami rutin melakukan survei langsung ke lapangan. Jadi kamu nggak perlu khawatir kehabisan pilihan." },
    { q: "Bisa request kost atau hunian tertentu nggak?", a: "Bisa, dan GRATIS 🙌 \n Kamu cukup masuk ke laman Wishlist, lalu klik fitur request. \nTim Sekitar akan mencoba membantu mencarikan dan mensurvei kost yang kamu butuhkan." },
  ],
  payments: [
    { q: "What do these roles – Admin, Editor, Author, and Translator – mean?", a: "Each role has different access levels and responsibilities." },
    { q: "What is onboarding support?", a: "Onboarding support helps new users get started efficiently." },
    { q: "What is an SLA?", a: "An SLA is a Service Level Agreement defining support expectations." },
  ],
  misc: [
    { q: "What is a locale?", a: "A locale defines language and regional formatting preferences." },
    { q: "What are roles?", a: "Roles define permissions and access levels within the system." },
  ],
};

const TABS = [
  {
    key: "definitions",
    label: `DEFINITIONS (${FAQ_DATA.definitions.length})`,
  },
  {
    key: "payments",
    label: `PAYMENTS & SUBSCRIPTIONS (${FAQ_DATA.payments.length})`,
  },
  {
    key: "misc",
    label: `MISCELLANEOUS (${FAQ_DATA.misc.length})`,
  },
];

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState("definitions");
  const [openIndex, setOpenIndex] = useState(0);

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

        {/* Tabs */}
        <div className="flex justify-center gap-8 border-b mb-10 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setOpenIndex(0);
              }}
              className={`pb-4 text-xs sm:text-sm font-semibold tracking-widest whitespace-nowrap
                ${
                  activeTab === tab.key
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQ_DATA[activeTab].map((item, index) => {
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
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}