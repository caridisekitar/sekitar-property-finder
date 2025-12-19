import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Heart, Bookmark } from "lucide-react";
import ImageGallery from "@/components/kost/ImageGallery";
import Tabs from "@/components/kost/Tabs";
import RekomendasiKos from "@/components/kost/RekomendasiKos";
import type { Kost } from "@/types";
import NotFoundKost from "@/components/NotFoundKost";
import { secureGet } from '@/lib/secureGet';

const KosDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState("fasilitas");
  const [kost, setKost] = useState<Kost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

   useEffect(() => {
    if (!slug) return;

    const fetchKostDetail = async () => {
      try {
        setLoading(true);

        const data = await secureGet(`/kosts/${slug}`);
        setKost(data);
      } catch (err) {
        console.error(err);
        setError("Kost not found");
      } finally {
        setLoading(false);
      }
    };

    fetchKostDetail();
  }, [slug]);

  if (loading) {
    return <p className="text-center py-10">Loading detail kos...</p>;
  }

  if (error || !kost) {
    return (
      error ?? <NotFoundKost />
    );
  }

  const handleContactOwner = () => {
    if (!kost?.whatsapp_number) return;

    // normalize phone number (remove leading 0, spaces, +)
    const phone = kost.whatsapp_number
        .replace(/\s+/g, "")
        .replace(/^0/, "62")
        .replace(/^\+/, "");

    const message = encodeURIComponent(
        `Halo, saya tertarik dengan kos "${kost.name}" di ${kost.city}. Apakah masih tersedia?`
    );

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    window.open(whatsappUrl, "_blank");
    };


  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-800">Home</Link> /
        <Link to="/cari-kost" className="mx-1 hover:text-gray-800">Kost</Link> /
        <span className="mx-1 text-gray-800 font-medium">{kost.city}</span>
      </nav>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2">
          <ImageGallery images={kost.images ?? [kost.img_cover]} />

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            {kost.name}
          </h1>

          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {kost.city}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white border rounded-xl p-5 h-fit">
          <div className="text-2xl font-bold text-gray-900">
            Rp{Number(kost.price_monthly).toLocaleString("id-ID")}
            <span className="text-sm font-medium text-gray-500"> /bulan</span>
          </div>

          {kost.deposit && (
            <div className="grid grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr] gap-2 justify-center items-center">
                <div className="flex mt-2">
                    <img src="/images/icons/deposit.svg" alt="deposit" className="w-4 h-4 inline mr-1" />
                </div>
                <div>
                    <p className="text-sm text-gray-600 mt-2">
                    Deposit: Rp{Number(kost.deposit).toLocaleString("id-ID")}
                    </p>
                </div>
              </div>
            
          )}


          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
            <div className="grid grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr] gap-2">
              <div>
                <img src="/images/icons/info-circle.svg" alt="warning" className="w-5 h-5 inline mr-1" />
              </div>
              <div>
                <strong>Tips Hubungi Pemilik</strong>
                    <p className="mt-1 text-orange-700 text-xs">
                    Yuk, tetap gunakan bahasa yang sopan saat menghubungi pemilik kos. Tulis pesan dengan jelas - sebutkan nama kamu dan tujuan, biar komunikasi jadi lebih nyaman 😊
                    </p>
              </div>
            </div>
            
          </div>


        <>
            {!kost.whatsapp_number && (
                <p className="text-xs text-red-500 mt-2">
                Nomor WhatsApp pemilik belum tersedia
                </p>
            )}

            <button
                onClick={handleContactOwner}
                disabled={!kost.whatsapp_number}
                className="mt-4 w-full bg-gray-900 text-white py-3 rounded-lg
                        hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Hubungi Pemilik Sekarang
            </button>
            </>


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
                {kost.facilities.length > 0 ? (
                kost.facilities.map((facility) => (
                    <div
                    key={facility.id}
                    className="flex items-center gap-2"
                    >
                    <img
                        src={`/images/icons/${facility.icon}`}
                        alt={facility.name}
                        className="w-4 h-4 object-contain"
                    />
                    <span>{facility.name}</span>
                    </div>
                ))
                ) : (
                <p className="col-span-full text-gray-500">
                    Fasilitas belum tersedia
                </p>
                )}
            </div>
            )}


        {activeTab === "lokasi" && (
          <div className="bg-sky-100 rounded-xl h-[250px] flex items-center justify-center">
            <iframe
                className="w-full h-full rounded-xl"
                width="100%"
                height="250"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${kost.latitude},${kost.longitude}&z=15&output=embed`}>
                </iframe>
          </div>
        )}

        {activeTab === "insight" && (
            <div className="space-y-4">
                {kost.insights && kost.insights.length > 0 ? (
                kost.insights.map((insight) => (
                    <div
                    key={insight.id}
                    className="border rounded-xl p-4 text-sm text-gray-700"
                    >
                    <strong>{insight.author ?? "Admin"}</strong>

                    <p className="mt-2">
                        {insight.content}
                    </p>

                    <span className="block mt-2 text-xs text-gray-400">
                        {new Date(insight.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        })}
                    </span>
                    </div>
                ))
                ) : (
                <div className="border rounded-xl p-4 text-sm text-gray-500">
                    Belum ada insight untuk kos ini.
                </div>
                )}
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
