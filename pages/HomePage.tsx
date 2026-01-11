import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Kost, Business, Testimonial } from '../types';
import { useAuth } from '@/hooks/useAuth';
import SearchIcon from '../components/icons/SearchIcon';
import FilterMenu from '../components/layout/FilterMenu';
import HouseLogo from '@/components/icons/HouseLogo';
import StarIcon from '@/components/icons/StarIcon';
import SparklesIcon from '@/components/icons/SparklesIcon';
import SearchKost from '@/components/SearchKost';
import SubscriptionModal from '@/components/SubscriptionModal';
import KostCard from '../components/KostCard';
import { secureGet } from '@/lib/secureGet';
import BusinessSection from '@/components/BusinessSection';
import HeroSearch from '@/components/HeroSearch';
import Pagination from '@/components/Pagination';


const mockKostData: Kost[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: 'Kost Dahlia Indah',
    type: 'Kost Putri',
    city: 'Mampang, Jakarta Selatan',
    price_monthly: "1500000",
    img_cover: `https://picsum.photos/seed/${i+1}/400/300`,
    isNew: 0,
    link: `/kost/${i+1}/detail`,
}));

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "Hasil survey nya quite good. Helpful & bisa jadi advisor terkait kebutuhan cari kos. Result survey nya very clear dan detail, termasuk dijelasin juga plus minus nya. Which good!",
        author: "Faisal R",
        role: "Pegawai Swasta",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        quote: "Hasil survey nya sangat helpful!",
        author: "Marsha D",
        role: "Pegawai swasta, perantauan",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        quote: "Aku dulu pembeli e-book rekomendasi kost nya, beneran super helpfull😭🫶🏻!",
        author: "S",
        role: "Followers tiktok @caridisekitar.com",
        imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
];

const VISIBLE_COUNT = 5;


const HomePage: React.FC = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const kostCarouselRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [kosts, setKosts] = useState<Kost[]>([]);
    const [kostBasic, setKostBasic] = useState<Kost[]>([]);
    const { subscription } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT);
    const [kostsRecommendation, setKostsRecommendation] = useState<Kost[]>([]);

    // 🔹 Fetch data from API
      useEffect(() => {
        const fetchKosts = async () => {
          try {
            setLoading(true);
            setError(null);

            const res = await secureGet('/search', {
              page: currentPage,
              per_page: ITEMS_PER_PAGE,
            });

            // paginated kost list
            setKosts(res.data);
            setCurrentPage(res.current_page);
            setLastPage(res.last_page);
            setTotal(res.total);

            // recommendation (no pagination)
            const dataRecommendation = await secureGet('/kost/recommendations');
            setKostsRecommendation(dataRecommendation.data);

            // basic (free preview)
            const basic = await secureGet('/kost/basic');
            setKostBasic(basic.data);
          } catch (err) {
            setError((err as Error).message || 'Failed to fetch data');
          } finally {
            setLoading(false);
          }
        };

        fetchKosts();
      }, [currentPage]);



    useEffect(() => {
        if (
          subscription?.plan === 'PREMIUM'
          ) {
            setIsSubscribed(true);
            setVisibleCount(100); // Show all items for subscribed users
          } else {
            setIsSubscribed(false);
          }
        }, [subscription]);
    
    
    // const visibleData = kosts.slice(0, visibleCount);
    const lockedData = mockKostData.slice(visibleCount, visibleCount * 2);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const scrollKostCarousel = (direction: 'left' | 'right') => {
        if (kostCarouselRef.current) {
            const scrollAmount = kostCarouselRef.current.offsetWidth * 0.8;
            kostCarouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };


  return (
    <>
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[35vh] md:h-[80vh] bg-cover lg:bg-repeat bg-center max-w-7xl rounded-3xl mx-auto" style={{ backgroundImage: "url('/images/hero-image-bg.webp')" }}>
        <div className="absolute inset-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-start h-full text-center text-white px-4 py-[7%]">
          <h1 className="text-xl md:text-4xl lg:text-6xl font-semibold !leading-[1.25] ">
             <span className="">Cari kost terasa lebih mudah,</span>
             <br /> <span className="inline-flex items-center gap-2">
                bersama
                <HouseLogo className="w-auto h-8 lg:h-[72px] lg:-mt-2"/>Sekitar.</span>
          </h1>
          <div className="mt-4 md:mt-8 lg:mt-8 w-full max-w-lg">
            <div className="relative">
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
       <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-bold tracking-widest mb-2 inline-flex items-center gap-2">
                    <StarIcon className="w-4 h-4"/>
                        ABOUT US</p>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <h2 className="text-lg md:text-3xl lg:text-3xl font-semibold mb-4 max-w-lg">Sama seperti jodoh, kadang kost dan hunian idaman bisa kamu <span className="text-[#96C8E2]">#CariDiSekitar</span></h2>
                <div className="flex items-end justify-end mb-4">
                    <SparklesIcon className="h-8 w-8 lg:w-12 lg:h-12 items-end hidden lg:block" />
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:gap-[200px]">
                <div className="grid grid-cols-2 max-w-[250px] lg:max-w-[450px]">
                    <img src="/images/about-1.webp" alt="House exterior 1" className="rounded-xl max-w-[100px] lg:max-w-[200px]" />
                    <img src="/images/about-2.webp" alt="House exterior 2" className="rounded-xl max-w-[100px] lg:max-w-[200px]" />
                </div>
                <div className="text-right">
                    <div className="flex items-end justify-end mb-4">
                    <SparklesIcon className="h-8 w-8 lg:w-12 lg:h-12 items-end lg:hidden" />
                </div>
                <h4 className="text-[#B3B3B3] text-md md:text-md lg:text-xl text-right font-semibold">Dengan data yang akurat dan filter yang personal, <span className="text-[#96C8E2]">Sekitar</span> hadir untuk bantu kamu menemukan kost terbaik yang sesuai dengan kebutuhan mu, di mana pun kamu berada.</h4>
                </div>
            </div>
        </div>
    </section>

    {/* Highlight Section */}
    <section className="py-12 lg:py-16">
        <div className="container px-4 lg:px-0 mx-auto py-8 sm:ps-6 lg:ps-8 bg-gray-50 rounded-xl">
            <p className="text-sm font-bold tracking-widest mb-2 inline-flex items-center gap-2">
                <StarIcon className="w-4 h-4"/> HIGHLIGHT</p>
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[30%_70%] lg:gap-0">
                <div className="flex flex-col justify-between h-full">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl md:text-4xl font-bold">5 Kost Pilihan Kami</h2>
                        <p className="text-[#757575] py-4 max-w-md text-md md:text-md lg:text-lg">Pusing ya pilih kos yang nyaman, aman, dan strategis? <br /> Tenang, ini dia 5 kost pilihan kami ✍️</p>
                    </div>
                    <div className="flex space-x-2 mb-8">
                        <button onClick={() => scrollKostCarousel('left')} aria-label="Previous Kost" className="w-12 h-12 bg-white border border-gray-300 rounded-full p-3 hover:bg-gray-100 transition-colors">&larr;</button>
                        <button onClick={() => scrollKostCarousel('right')} aria-label="Next Kost" className="w-12 h-12 bg-brand-dark text-white rounded-full p-3 hover:bg-gray-800 transition-colors">&rarr;</button>
                    </div>
                </div>
                <div className="">
                    <div
                        ref={kostCarouselRef}
                        className="
                          flex gap-4 overflow-x-auto pb-4
                          snap-x snap-mandatory
                          touch-pan-x
                          overscroll-x-contain
                        "
                        style={{ scrollbarWidth: "none" }}
                      >
                        {kostsRecommendation.map(kost => <KostCard key={kost.id} kost={kost} />)}
                    </div>
                </div>
            </div>
            
             
        </div>
    </section>

    {/* Search Form Section */}
<section className="py-12 lg:py-16">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-10">
      <p className="text-sm font-bold tracking-widest mb-2">✦ CARI KOS</p>
      <h2 className="text-3xl md:text-4xl font-bold">Mulai Cari Kos</h2>
      <p className="text-[#1E1E1E] mt-2 text-md md:text-md lg:text-lg text-opacity-50">
        Kalau biasanya kamu butuh 30 hari untuk cari kost yang sesuai,
        di Sekitar kamu hanya butuh 1 menit!
      </p>
    </div>

    {/* Search Component */}
    <SearchKost
        setIsFilterMenuOpen={setIsFilterMenuOpen}
        onResult={(res) => {
          // supports both paginated & non-paginated responses
          setKosts(res.data ?? res);
          setCurrentPage(res.current_page ?? 1);
          setLastPage(res.last_page ?? 1);
          setTotal(res.total ?? (res.data?.length ?? res.length));

          setVisibleCount(
            isSubscribed
              ? (res.data?.length ?? res.length)
              : VISIBLE_COUNT
          );
        }}
      />



    {/* RESULT */}
    <div className="mt-10">
      {/* COUNT */}
      <p className="text-gray-600 mb-6">
        Menampilkan {Math.min(visibleCount, kosts.length)} dari {total} hasil pencarian
      </p>

      {/* VISIBLE DATA */}
      <div className="px-2
          grid grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5 gap-4">
        {
        !isSubscribed
          ? kostBasic.map((kost) => (
              <KostCard key={kost.id} kost={kost} />
            ))
          : kosts.slice(0, visibleCount).map((kost) => (
              <KostCard key={kost.id} kost={kost} />
            ))
      }
      </div>

      {/* HERE */}

      {isSubscribed && lastPage > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={(page) => {
                if (page !== currentPage && !loading) {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </div>
        )}



      {/* Adjustment END */}



      {/* LOCKED DATA */}
      {!isSubscribed && kosts.length > visibleCount && (
        <div className="relative mt-6">
          <div
            className="
              flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory
              sm:grid sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-5
              sm:overflow-visible
              blur-lg pointer-events-none select-none
            "
          >
            {kosts.slice(visibleCount, visibleCount + VISIBLE_COUNT).map((kost) => (
              <KostCard key={kost.id} kost={kost} />
            ))}
          </div>

          {/* LOCK OVERLAY */}
          <div className="absolute inset-0 flex items-center justify-center">
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

      {/* EMPTY STATE */}
      {kosts.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-500">
          Belum ada hasil pencarian. Yuk mulai cari kost 👀
        </div>
      )}
    </div>
  </div>
</section>

    <SubscriptionModal open={open} onClose={() => setOpen(false)} />


    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-[#89CFF0] rounded-3xl p-8 md:p-10 flex flex-row items-center relative overflow-hidden h-[300px]">
             <div className="absolute left-0 bottom-0 w-1/2 h-full">
                <img src="/images/bisnis-kost.webp" className="w-full h-full object-cover object-center" alt="User" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#89CFF0]"></div>
             </div>
             <div className="absolute right-0 w-1/2 z-10">
               <div className="inline-block bg-white px-3 py-1 rounded-xl text-xs font-bold mb-4">Gratis</div>
               <h3 className="text-md md:text-3xl font-bold text-white mb-4">Daftarkan Kosmu</h3>
               <p className="text-white/90 text-xs lg:text-sm mb-6">Punya kos? Yuk, daftarkan sekarang dan buat kosmu lebih mudah ditemukan oleh ribuan pencari di sekitar kamu!</p>
               <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-xs lg:text-sm font-medium hover:bg-gray-800">Coming Soon!</button>
             </div>
          </div>

           <div className="bg-[#89CFF0] rounded-3xl p-8 md:p-10 flex flex-row items-center relative overflow-hidden h-[300px]">
              <div className="absolute left-0 bottom-0 w-1/2 h-full">
                <img src="/images/daftarkan-bisnis.webp" className="w-full h-full object-cover object-center" alt="Business owner" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#89CFF0]"></div>
             </div>
             <div className="absolute right-0 w-1/2 z-10">
               <div className="inline-block bg-white px-3 py-1 rounded-xl text-xs font-bold mb-4">Gratis</div>
               <h3 className="text-md md:text-3xl font-bold text-white mb-4">Daftarkan Bisnismu</h3>
               <p className="text-white/90 text-xs lg:text-sm mb-6">Punya usaha lokal? Yuk, daftarkan bisnismu biar makin dikenal dan mudah ditemukan orang di sekitar kamu!</p>
               <Link to="/daftar-bisnis" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-xs lg:text-sm font-medium hover:bg-gray-800">Daftar sekarang</Link>
             </div>
          </div>
        </div>
      </section>


    {/* Business Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-18 lg:py-16 mb-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-2">
             <span className="text-xl">✦</span> BISNIS
          </div>
          <h2 className="text-2xl md:text-[48px] lg:text-[48px] font-bold text-gray-900 mb-4">Bisnis Teman Sekitar</h2>
          <p className="text-[#1E1E1E] max-w-4xl mx-auto text-md md:text-md lg:text-md text-opacity-50">Kami percaya setiap usaha layak untuk tumbuh. Karena itu, kami bantu #TemanSekitar mempromosikan bisnis kecil/UMKM secara gratis di website ini.</p>
        </div>
        
        <BusinessSection />

        
         {/* <div className="flex justify-center mt-10">
           <button className="px-8 py-3 border border-[#18181B] rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Lihat semua</button>
         </div> */}
      </section>

      
      {/* Testimonials Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Apa Kata <span className="text-[#96C8E2]">#TemanSekitar</span></h2>
            <p className="text-[#1E1E1E] mt-2 text-md md:text-md lg:text-md text-opacity-50">Setiap pengguna punya cerita. Inilah pengalaman mereka menemukan kost yang tepat bersama Sekitar.🤍</p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="bg-[#F5F5F5] rounded-2xl flex flex-col md:flex-row items-center gap-8">
              {/* <img src={testimonials[currentTestimonial].imageUrl} alt={testimonials[currentTestimonial].author} className="w-full h-auto md:w-auto md:h-[300px] object-cover flex-shrink-0 rounded-l-xl" /> */}
              <div className="text-left md:text-left p-4 lg:p-8">
                <span className="text-5xl font-serif">“</span>
                <p className="text-md md:text-3xl lg:text-3xl text-gray-700 -mt-4 ms-4">{testimonials[currentTestimonial].quote}</p>
                <p className="font-bold mt-6 ms-4">&mdash; {testimonials[currentTestimonial].author}</p>
                <p className="text-xs text-gray-500 ms-4">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
            <button onClick={prevTestimonial} aria-label="Previous testimonial" className="w-10 h-10 absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 bg-white rounded-full p-2 border border-[#757575] text-[#757575] hover:bg-gray-100 transition-colors">&larr;</button>
            <button onClick={nextTestimonial} aria-label="Next testimonial" className="w-10 h-10 absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 bg-brand-dark text-white rounded-full p-2 border hover:bg-gray-800 transition-colors">&rarr;</button>
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`w-2 h-2 rounded-full ${currentTestimonial === index ? 'bg-brand-dark' : 'bg-gray-300'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

    </div>
    <FilterMenu isOpen={isFilterMenuOpen} setIsOpen={setIsFilterMenuOpen} />
    </>
  );
};

export default HomePage;
