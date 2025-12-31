import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Kebijakan Privasi
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Terakhir diperbarui: 1 Januari 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Intro */}
        <p className="text-gray-700 leading-relaxed">
          Privasi Anda penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda saat Anda menggunakan situs web dan layanan kami.
        </p>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Kami dapat mengumpulkan informasi pribadi seperti nama Anda, alamat email, nomor telepon, data lokasi, dan informasi lain yang Anda berikan secara sukarela saat menggunakan layanan kami.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            2. Bagaimana Kami Menggunakan Informasi Anda
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Menyediakan dan memelihara layanan kami</li>
            <li>Meningkatkan pengalaman pengguna</li>
            <li>Mengirimkan pembaruan atau notifikasi penting</li>
            <li>Memastikan keamanan dan mencegah penipuan</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            3. Berbagi dan Pengungkapan Data
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Kami tidak menjual atau menyewakan data pribadi Anda. Informasi Anda hanya akan dibagikan dengan pihak ketiga terpercaya yang membantu kami dalam mengoperasikan layanan kami, dan hanya sebagaimana diperlukan.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            4. Keamanan Data
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang tepat untuk melindungi informasi pribadi Anda dari akses, perubahan, atau pengungkapan yang tidak sah.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            5. Hak Anda
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Anda berhak untuk mengakses, memperbarui, atau menghapus data pribadi Anda. Anda juga dapat menolak atau membatasi aktivitas pemrosesan tertentu sebagaimana diizinkan oleh hukum.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            6. Perubahan pada Kebijakan Ini
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan apa pun akan diposting di halaman ini dengan tanggal revisi yang diperbarui.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            7. Hubungi Kami
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
          </p>

          <div className="mt-3 rounded-lg border bg-white p-4 text-sm">
            <p className="font-medium text-gray-900">Email:</p>
            <p className="text-gray-600">caridisekitar@gmail.com</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
