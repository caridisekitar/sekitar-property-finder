import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  onGoHome: () => void;
};

export default function SuccessModal({ open, onClose, onGoHome }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 mx-4 animate-fadeIn">
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* illustration */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/business-success.png"
            alt="Success"
            className="h-40"
          />
        </div>

        {/* content */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Bisnismu Berhasil Didaftarkan!
        </h2>

        <p className="text-xs text-gray-600 text-center leading-relaxed">
          Selamat! Bisnismu sudah berhasil didaftarkan di{" "}
          <strong>caridisekitar.com</strong>.
          Tim kami akan meninjau dan memverifikasi informasi sebelum
          ditampilkan kepada pengguna.
        </p>

        <p className="text-xs text-gray-600 text-center mt-3">
          Terima kasih sudah mempercayakan promosi bisnismu bersama kami!
        </p>

        {/* actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium hover:bg-gray-50"
          >
            Tutup
          </button>

            <Link to="/profile/contributions" className="flex-1 rounded-xl bg-black text-white py-3 text-sm font-medium hover:bg-gray-900 text-center">
            Lihat Kontribusiku
            </Link>
        </div>
      </div>
    </div>
  );
}
