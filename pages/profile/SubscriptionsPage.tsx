import React, { useEffect, useState, cache } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { User } from '@/types';
import { secureGet } from '@/lib/secureGet';
import { useAuth } from '@/hooks/useAuth';
import { formatDateID } from "@/lib/date";

export default function SubscriptionsPage() {
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
  
      if (loading) return <div>Loading profile...</div>;
  
      if (!user) return null;


  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user}/>
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
            <div className="w-full border-b border-gray-200 py-2">
                <h1 className="text-3xl font-bold text-brand-dark">Langgananku</h1>
                <p className="text-gray-500 mt-1"></p>
            </div>
            
            
        </div>

        <section className="w-full max-w-7xl mx-auto space-y-10">

  
          <div className={`rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
            ${subscription.plan === "PREMIUM" ? "bg-[#FFF7D1]" : "bg-gray-100"}
            `}>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16l-1.5-9L7 9l5-6 5 6 3.5-2-1.5 9H5z"/>
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{subscription?.plan}</h3>
                  {subscription?.plan === "FREE" && (
                    <Link to="/profile/upgrade" className="text-sm font-semibold border bg-[#DCF4FF] px-3 py-1 rounded-full">Upgrade Plan</Link>
                  )}
                </div>
                <p className="text-sm text-gray-600 py-1">
                  {subscription?.plan === "PREMIUM" ? "Unlimited Access" : "Limited Access"}
                  </p>
              </div>
            </div>

            <p className="text-sm text-gray-800">
              Masa berlaku sampai: <span className="font-medium">{formatDateID(subscription?.ends_at)}</span>
            </p>
          </div>


          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Riwayat Langganan
            </h2>
          </div>

          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">


            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Tipe</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Masa berlaku sampai</th>
                    <th className="px-6 py-4">Metode Pembayaran</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-6 py-4">1</td>
                    <td className="px-6 py-4">{subscription?.plan}</td>
                    <td className="px-6 py-4">{formatDateID(subscription?.starts_at)}</td>
                    <td className="px-6 py-4">{formatDateID(subscription?.ends_at)}</td>
                    <td className="px-6 py-4">
                      {subscription?.plan === "PREMIUM" && "Virtual Account"}
                      {subscription?.plan === "FREE" && "-"}
                      </td>
                    <td className="px-6 py-4 text-right">
                      {subscription?.plan === "PREMIUM" && (
                        <a href="#" className="text-blue-600 hover:underline">
                          Download invoice
                        </a>
                      )}
                      {subscription?.plan === "FREE" && "-"}
                      
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            
            <div className="md:hidden divide-y">
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipe</span>
                  <span className="font-medium">Premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span>31 Oktober 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Berlaku sampai</span>
                  <span>31 Oktober 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pembayaran</span>
                  <span>Virtual Account</span>
                </div>
                <div className="pt-2">
                  <a href="#" className="text-blue-600 font-medium">
                    Download invoice
                  </a>
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}
