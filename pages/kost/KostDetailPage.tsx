import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Heart, Bookmark } from "lucide-react";
import ImageGallery from "@/components/kost/ImageGallery";
import Tabs from "@/components/kost/Tabs";
import RekomendasiKos from "@/components/kost/RekomendasiKos";
import type { Kost } from "@/types";
import NotFoundKost from "@/components/NotFoundKost";
import { secureGet } from '@/lib/secureGet';
import { securePost } from '@/lib/securePost';
import LoadingOverlay from "@/components/LoadingOverlay";
import { formatHargaRange, formatDeposit, formatHargaRangeID } from "@/lib/helper";
import { useAuth } from "@/hooks/useAuth";
import SubscriptionModal from "@/components/SubscriptionModal";
import { toggleLike, toggleBookmark } from "@/lib/kostActions";


const KosDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState("fasilitas");
  const [kost, setKost] = useState<Kost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { subscription, user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Liked and bookmarked
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);


   useEffect(() => {
    if (!slug) return;

    const fetchKostDetail = async () => {
      try {
        setLoading(true);

        // const data = await secureGet(`/kosts/${slug}`);
        const data = await securePost(`/kosts/${slug}`,
          "POST",
          {
            user_id: user?.id
          }
        );
        setKost(data);
        setLiked(data.is_liked_by_me);
        setLikesCount(data.likes_count);
        setBookmarked(data.is_bookmarked_by_me);

      } catch (err) {
        console.error(err);
        setError("Kost not found");
      } finally {
        setLoading(false);
      }
    };

    fetchKostDetail();
  }, [slug]);

  // ✅ EFFECT 2 — subscription status
  useEffect(() => {
    setIsSubscribed(subscription?.plan === "PREMIUM");
    }, [subscription]);

    // ⛔ returns AFTER hooks
    if (loading) {
      return <LoadingOverlay message="Memuat detail kos ..." />;
    }

    if (error || !kost) {
      return error ? <p>{error}</p> : <NotFoundKost />;
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

  const handleLike = async () => {
      if (!user || likeLoading || !kost) return;

      setLikeLoading(true);

      // optimistic UI (correct)
      setLiked(prev => {
        const next = !prev;
        setLikesCount(c => (next ? c + 1 : c - 1));
        return next;
      });

      try {
        const res = await toggleLike(kost.id);
        setLiked(res.liked);
        setLikesCount(res.likes_count);
      } catch {
        // rollback
        setLiked(liked);
        setLikesCount(likesCount);
      } finally {
        setLikeLoading(false);
      }
    };

    const handleBookmark = async () => {
      if (!user || bookmarkLoading || !kost) return;

      setBookmarkLoading(true);

      // optimistic UI (correct)
      setBookmarked(prev => {
        const next = !prev;
        return next;
      });

      try {
        const res = await toggleBookmark(kost.id);
        setBookmarked(res.bookmarked);
      } catch {
        // rollback
        setBookmarked(bookmarked);
      } finally {
        setBookmarkLoading(false);
      }
    };



  



  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {!isSubscribed && (
        <div className="relative mt-6">
          <div
            className="
              blur-lg pointer-events-none select-none
            "
          >

            
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-800">Home</Link> /
        <Link to="/cari-kost" className="mx-1 hover:text-gray-800">Kost</Link> /
        <span className="mx-1 text-gray-800 font-medium">Lorem Ipsum</span>
      </nav>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2">
          <ImageGallery images={["https://picsum.photos/seed/1/400/301"]} />

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Lorem Ipsum
          </h1>

          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            Lorem Ipsum
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white border rounded-xl p-5 h-fit">
          <div className="text-2xl font-bold text-gray-900">
            Rp
            <span className="text-sm font-medium text-gray-500"> /bulan</span>
          </div>

          {kost.deposit && (
            <div className="grid grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr] gap-2 justify-center items-center">
                <div className="flex mt-2">
                    <img src="/images/icons/deposit.svg" alt="deposit" className="w-4 h-4 inline mr-1" />
                </div>
                <div>
                    <p className="text-sm text-gray-600 mt-2">
                    Deposit: -
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

            <button
                className="mt-4 w-full bg-gray-900 text-white py-3 rounded-lg
                        hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Hubungi Pemilik Sekarang
            </button>
            </>


          <div className="flex gap-3 mt-4 justify-end">
            <button className="p-2 border border-[#18181B] rounded-lg me-2">
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
                        alt="Lorem Ipsum"
                        className="w-4 h-4 object-contain"
                    />
                    <span>Lorem Ipsum</span>
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
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=-6.1786755,106.8271231&z=15&output=embed`}>
                </iframe>
          </div>
        )}

        {activeTab === "insight" && (
            <div className="space-y-4">
                <div className="border rounded-xl p-4 text-sm text-gray-500">
                    Belum ada insight untuk kos ini.
                </div>
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

            {/* LOCK OVERLAY */}
                <div className="absolute inset-0 flex items-start justify-center mt-[100px] md:mt-[200px] lg:mt-[200px]">
                  <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
                    <div className="flex justify-center mb-4">
                      <img
                        src="/images/icons/icon-locked.png"
                        alt="Lock Icon"
                        className="w-16 h-16"
                      />
                    </div>

                    <h3 className="text-xl font-bold mb-2">Yah terkunci nih!</h3>

                    <p className="text-gray-600 mb-6">
                      Jangan khawatir, kamu bisa akses ratusan informasi kost
                      dengan harga bersahabat.
                    </p>

                    <button
                      onClick={() => setOpen(true)}
                      className="px-6 py-3 rounded-xl bg-[#96C8E2] text-white font-semibold hover:bg-blue-600 transition"
                    >
                      Mulai langganan
                    </button>
                  </div>
                </div>
          </div>
      )}

      {/* PREMIUM Access  */}
      {isSubscribed && (
          
          <div className="relative mt-6">

            
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-800">Home</Link> /
        <Link to="/cari-kost" className="mx-1 hover:text-gray-800">Kost</Link> /
        <span className="mx-1 text-gray-800 font-medium">{kost.name}</span>
      </nav>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2">
          <ImageGallery
              images={
                kost.images
                  ?.filter(img => !img.is_video_poste)
                  .map(img => img.image_url) ?? [kost.img_cover]
              }
              videoPoster={
                kost.images?.find(img => img.is_video_poster)?.image_url
              }
              videoURL={kost.video_url}
            />


          <div className="grid grid-cols-2 gap-2 mt-4">
             <div className="flex-col items-center gap-2 text-sm text-gray-500">
              <h1 className="mt-4 text-xl font-semibold text-gray-900">
                {kost.name}
              </h1>

              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {kost.city}
              </div>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500 justify-end">
                <div className="flex-col gap-3 mt-4 text-right">
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className="p-2 border border-[#18181B] rounded-lg me-2 disabled:opacity-50"
                  >
                    <Heart
                      className={`w-5 h-5 transition ${
                        liked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                  <button 
                  onClick={handleBookmark}
                  disabled={likeLoading}
                  className="p-2 border border-[#18181B] rounded-lg">
                    <Bookmark className={`w-5 h-5 transition ${
                        bookmarked ? "fill-red-500 text-red-500" : ""
                      }`}/>
                  </button>
                  <br />
                  <p className="mt-2">{likesCount} orang menyukai kos ini</p>
                </div>
                
             </div>
          </div>
          
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white border rounded-xl p-5 h-fit">
          <div className="text-2xl font-bold text-gray-900">
            Rp{formatHargaRangeID(kost.price_monthly)}
            <span className="text-sm font-medium text-gray-500"> /bulan</span>
          </div>

          {kost.deposit && (
            <div className="grid grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr] gap-2 justify-center items-center">
                <div className="flex mt-2">
                    <img src="/images/icons/deposit.svg" alt="deposit" className="w-4 h-4 inline mr-1" />
                </div>
                <div>
                    <p className="text-sm text-gray-600 mt-2">
                    Deposit: {formatDeposit(kost.deposit)}
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
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
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

                    <p className="mt-2">
                        {insight.content}
                    </p>

                    {/* <span className="block mt-2 text-xs text-gray-400">
                        {new Date(insight.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        })}
                    </span> */}
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

      )}
      <SubscriptionModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default KosDetailPage;
