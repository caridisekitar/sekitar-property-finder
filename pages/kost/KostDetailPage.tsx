import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Heart, Bookmark } from "lucide-react";
import ImageGallery from "@/components/kost/ImageGallery";
import Tabs from "@/components/kost/Tabs";
import RekomendasiKos from "@/components/kost/RekomendasiKos";

const KosDetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("fasilitas");

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-800">Home</Link> /
        <Link to="/maps" className="mx-1 hover:text-gray-800">Maps</Link> /
        <span className="text-gray-800 font-medium">Jakarta Selatan</span>
      </nav>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <ImageGallery />

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Kos Dahlia Putri
          </h1>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            Mampang, Jakarta Selatan
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white border rounded-xl p-5 h-fit">
          <div className="text-2xl font-bold text-gray-900">
            Rp1.500.000
            <span className="text-sm font-medium text-gray-500"> /bulan</span>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            Deposit: Rp300.000
          </p>

          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
            <strong>Tips Hubungi Pemilik</strong>
            <p className="mt-1">
              Gunakan bahasa sopan dan jelaskan tujuan kamu agar komunikasi nyaman 🙂
            </p>
          </div>

          <button className="mt-4 w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Hubungi Pemilik Sekarang
          </button>

          <div className="flex gap-3 mt-4 justify-end">
            <button className="p-2 border rounded-lg">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 border rounded-lg">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <Tabs active={activeTab} onChange={setActiveTab} />

      {/* TAB CONTENT */}
      <div className="mt-6">
        {activeTab === "fasilitas" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              "Kamar mandi dalam",
              "AC",
              "Wifi",
              "Kitchen",
              "Laundry",
              "Water Heater",
              "Kasur",
              "Lemari",
              "Meja",
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                • <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "lokasi" && (
          <div className="bg-sky-100 rounded-xl h-[250px] flex items-center justify-center">
            <span className="text-gray-600">Map Preview Here</span>
          </div>
        )}

        {activeTab === "insight" && (
          <div className="border rounded-xl p-4 text-sm text-gray-700">
            <strong>Admin</strong>
            <p className="mt-2">
              Kos sangat nyaman, bersih, dan dekat minimarket serta transportasi umum.
            </p>
            <span className="text-xs text-gray-400">15 Juni 2025</span>
          </div>
        )}
      </div>

      {/* DISCLAIMER */}
      <div className="mt-8 bg-sky-50 p-4 rounded-xl text-xs text-gray-600">
        Semua foto milik pemilik kos. Kami tidak mengambil komisi apa pun.
      </div>

      {/* REKOMENDASI */}
      <RekomendasiKos />
    </div>
  );
};

export default KosDetailPage;
