import React, { useEffect, useState, cache } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { User } from '@/types';
import { secureGet } from '@/lib/secureGet';
import { securePost } from '@/lib/securePost';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from "@/components/LoadingOverlay";

export default function UpgradePlanPage() {
  const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const { subscription } = useAuth();
  
    useEffect(() => {
        if (!token) {
          navigate('/login', { replace: true });
          return;
        }
  
        const fetchProfile = async () => {
            try {
              const data = await secureGet("/auth/me");
    
                // Adjust based on your API response shape
                setUser(data.user ?? data);
    
            } catch (err) {
                // Token invalid / expired / unauthorized
                localStorage.removeItem("token");
                localStorage.removeItem("user");
    
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };
  
        fetchProfile();
      }, [token, navigate]);
  
      if (loading) return <LoadingOverlay message="Memuat ..." />;
  
      if (!user) return null;

    const handleUpgrade = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await securePost(
                "/duitku/create",
                "POST",
                {
                  amount: 99000,
                  product_name: "Subscription Premium",
                  user_id: user.id,
                  email: user.email,
                  phone: user.phone,
                  name: user.name,
                } 
              );
        // Redirect ke halaman pembayaran Duitku
        if (res.paymentUrl) {
          window.location.href = res.paymentUrl;
        }

        // Redirect to invoice detail / payment page
        // navigate(`/invoices/${data.invoice_id}`);
      } catch (err) {
      alert(err.message || "Gagal memproses pembayaran");
      } finally {
        setLoading(false);
      }
    };
      
  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user}/>
      
            <div className="max-w-6xl mx-auto text-center p-4">

                {/* Cards */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* BASIC */}
                {/* <div className="border rounded-2xl p-8 shadow-sm"> */}
                <div className="border rounded-2xl p-8 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <img src="/images/icons/basic.png" alt="basic" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-900">Basic</p>
                        <p className="text-sm text-gray-400">Limited</p>
                    </div>
                    </div>

                    <h2 className="text-4xl font-bold mb-2">Gratis</h2>
                    <p className="text-gray-500 mb-8 text-xs">
                    Mau coba yang gratis dulu? Ngga jadi masalah, we got you!
                    </p>

                    <Feature text="Akses ratusan informasi kost" limited />
                    <Feature text="Akses fitur Kalkulator" limited />
                    <Feature text="Akses fitur Maps" limited />
                    <Feature text="Bebas request kost via fitur Wishlist" />
                    <Feature text="Newsletter personal setiap minggu" />
                    <Feature text="Akses fitur Daftarkan Kost Mu" disabled />
                    <Feature text="Akses fitur Daftarkan Kost Bisnis Mu" disabled />
                    <Feature text="Jumlah list kost akan terus bertambah setiap bulan" disabled />
                    { subscription?.plan === 'BASIC' && (
                        
                        <div className="mt-auto pt-8">
                            <div className="w-full bg-gray-500 text-white py-3 rounded-lg font-medium text-center opacity-50 cursor-not-allowed">
                            Plan sekarang
                            </div>
                        </div>
                    )}
                </div>

                {/* PREMIUM */}
                <div className="relative border-2 border-blue-400 rounded-2xl p-8 shadow-lg">
                    <span className="absolute top-4 right-4 bg-black text-white text-xs px-3 py-1 rounded-full">
                    Recommended for you
                    </span>

                    <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <img src="/images/icons/premium.png" alt="premium" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-900">Premium</p>
                        <p className="text-sm text-gray-400">Unlimited</p>
                    </div>
                    </div>

                    <p className="text-red-500 line-through mb-1 text-left">Rp150.000</p>
                    <div className="flex items-end gap-2 mb-2">
                    <h2 className="text-4xl font-bold">Rp99.000</h2>
                    <span className="text-gray-500 mb-1 text-xs lg:text-sm">per tahun</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        Promo 🎉
                    </span>
                    </div>

                    <p className="text-gray-500 mb-8 text-xs">
                    Cuma Rp8.200 perbulan, lebih murah dari harga kopi kamu sehari ☕
                    </p>

                    <Feature text="Akses ratusan informasi kost tanpa batas" />
                    <Feature text="Akses fitur Kalkulator sepuasnya" />
                    <Feature text="Akses fitur Maps" />
                    <Feature text="Bebas request kost via fitur Wishlist" />
                    <Feature text="Akses fitur Daftarkan Kost Mu" />
                    <Feature text="Akses fitur Daftarkan Bisnis Mu" />
                    <Feature text="Newsletter personal setiap minggu" />
                    <Feature text="Jumlah list kost terus bertambah setiap bulan" />

                    <div className="mt-auto pt-8">
                        {subscription?.plan === 'BASIC' ? (
                          <button
                              onClick={handleUpgrade}
                              disabled={loading}
                              className={`w-full py-3 rounded-lg font-medium transition ${
                                loading
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[#96C8E2] text-white hover:bg-blue-200"
                              }`}
                            >
                              {loading ? "Membuat invoice..." : "Upgrade langganan"}
                            </button>
                        ) : (
                        <div className="w-full bg-gray-500 text-white py-3 rounded-lg font-medium text-center opacity-50 cursor-not-allowed">
                            Plan sekarang
                        </div>
                        )}
                    </div>

                    
                </div>

                </div>
            </div>

    </div>
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