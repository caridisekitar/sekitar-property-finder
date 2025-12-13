import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Store,
  Link as LinkIcon,
  Upload,
  Phone,
  Wallet
} from "lucide-react";

export default function DaftarkanBisnismu() {
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <Link to="/" className="text-gray-500 hover:text-brand-blue">Home</Link>
         <span className="mx-3">/</span>
         <span className="text-gray-900 font-medium">Daftarkan Bisnismu</span>
         <div className="w-full border-b border-gray-200 py-2"></div>
        <h1 className="text-base md:text-3xl  lg:text-4xl font-bold text-brand-dark py-4">Daftarkan Bisnismu</h1>
      </div>
      

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT CONTENT */}
        <div className="">
          <img
            src="/images/daftarkan-bisnis-hero.webp"
            alt="UMKM"
            className="w-full h-[260px] md:h-[320px] object-cover rounded-xl mb-6"
          />

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Kami percaya setiap usaha layak untuk tumbuh.
          </h2>

          <p className="text-gray-600 text-sm md:text-base">
            Karena itu, kami bantu <b>#TemanSekitar</b> mempromosikan bisnis kecil/UMKM
            secara gratis di website ini 💙 Yuk, daftarkan bisnismu hari ini.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="">
          <form className="space-y-5">
            
            {/* Owner Name */}
            <FormInput
              label="Nama Pemilik Bisnis"
              required
              icon={<User size={18} />}
              placeholder="Tulis nama pemilik bisnis"
            />

            {/* Business Name */}
            <FormInput
              label="Nama Bisnis"
              required
              icon={<Store size={18} />}
              placeholder="Tulis nama bisnismu"
            />

            {/* Website */}
            <FormInput
              label="Link website bisnismu"
              icon={<LinkIcon size={18} />}
              placeholder="https://"
            />

            {/* Upload */}
            <div>
              <label className="text-sm font-medium text-gray-900">
                Foto Produk (harap kirim 3 foto terbaikmu) <span className="text-red-500">*</span>
              </label>

              <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
                <Upload className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  <b>Klik untuk unggah foto</b> atau seret foto ke bagian ini
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  SVG, PNG, JPG (maks. 800×400px, 1MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              {images.length > 0 && (
                <div className="mt-3 text-xs text-gray-600">
                  {images.length} foto dipilih
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-gray-900">
                Alamat bisnis
              </label>
              <textarea
                rows={4}
                placeholder="Masukkan alamat kamu..."
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            {/* Price Range */}
            <FormInput
              label="Range Harga"
              required
              icon={<Wallet size={18} />}
              placeholder="10000 - 20000"
              helper="Masukkan harga tanpa koma atau titik"
            />

            {/* Phone */}
            <FormInput
              label="Nomor pemesanan"
              required
              icon={<Phone size={18} />}
              placeholder="08xxxxxxxxxx"
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Daftar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Input ---------- */
function FormInput({
  label,
  required,
  icon,
  placeholder,
  helper
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="mt-2 relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full rounded-lg border border-gray-300 py-3 text-sm
            ${icon ? "pl-10" : "pl-3"}
            focus:ring-2 focus:ring-gray-900 focus:border-gray-900`}
        />
      </div>

      {helper && (
        <p className="text-xs text-gray-500 mt-1">{helper}</p>
      )}
    </div>
  );
}
