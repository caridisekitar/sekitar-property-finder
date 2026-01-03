import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { User } from '@/types';
import { secureGet } from '@/lib/secureGet';
import { useAuth } from '@/hooks/useAuth';
import { formatDateID } from "@/lib/date";
import LoadingOverlay from "@/components/LoadingOverlay";
import DropdownMobileMenu from '@/components/profile/DropdownMobileMenu';

export default function SubscriptionsPage() {
  const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const { subscription } = useAuth();
    const [invoices, setInvoices] = useState<any[]>([]);

    const downloadInvoice = async (invoiceId: number) => {
      const res = await secureGet(`/invoices/${invoiceId}/${user.id}/signed-url`);
      window.open(res.url, "_blank");
    };
  
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


      useEffect(() => {
        if (!user?.id) return;

        const fetchInvoices = async () => {
          try {
            const dataInvoices = await secureGet(
              `/invoices/listing/${user.id}`
            );
            setInvoices(dataInvoices.invoices || []);
          } catch (error) {
            console.error("Failed to fetch invoices", error);
          }
        };

        fetchInvoices();
      }, [user]);

  
      if (loading) return <LoadingOverlay message="Memuat data Langgananmu..." />;
  
      if (!user) return null;


  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user}/>
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <DropdownMobileMenu user={user}/>
        <div className="flex justify-between items-center mb-8">
            <div className="w-full border-b border-gray-200 py-2">
                <h1 className="text-3xl font-bold text-brand-dark">Langgananku</h1>
                <p className="text-gray-500 mt-1"></p>
            </div>
            
            
        </div>

        <section className="w-full max-w-7xl mx-auto space-y-10">

  
          <div className={`rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
            ${subscription.plan === "PREMIUM" ? "bg-[#FEF3C7]" : "bg-[#DCF4FF]"}
            `}>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
                
                {subscription?.plan === "PREMIUM" ? (
                    <img src="/images/premium-tier.png" alt="" />
                )
                : (
                    <img src="/images/basic-tier.png" alt="" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {subscription?.plan === "PREMIUM" ? "Premium" : "Basic"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 py-1">
                  {subscription?.plan === "PREMIUM" ? "Unlimited Access" : "Limited Access"}
                  </p>
              </div>
            </div>

            {subscription?.plan === "PREMIUM" ? (
              <p className="text-sm text-gray-800">
                Masa berlaku sampai: <span className="font-medium">{formatDateID(subscription?.ends_at)}</span>
            </p>
            ) : (
              "Basic"
            )}
          </div>


          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Riwayat Langganan
            </h2>
          </div>

          {subscription?.plan === "BASIC" && invoices?.length === 0 && (
            <div>
              <div className="flex justify-center mb-6">
                <img
                  src="/images/free-account.png"
                  alt="Free account"
                  className="h-40"
                />
              </div>

              
              <h2 className="text-xl font-semibold text-center">
                Akunmu masih versi free
              </h2>
              <p className="text-sm text-gray-600 text-center !mt-0">
                Upgrade ke Premium biar bisa nikmatin fitur lengkap dan akses tanpa batas!
              </p>
              <div className="flex justify-center mt-6">
                <Link to="/profile/upgrade" className="text-sm text-white font-semibold border bg-[#18181B] px-3 py-3 rounded-lg">Mulai Langganan</Link>
              </div>
            </div>
          )}


          {invoices?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Tipe</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Masa berlaku sampai</th>
                    <th className="px-6 py-4">Status Pembayaran</th>
                    <th className="px-6 py-4">Metode Pembayaran</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                  <tr className="border-t">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{invoice?.orders.product_name}</td>
                    <td className="px-6 py-4">{formatDateID(invoice?.orders.created_at)}</td>
                    <td className="px-6 py-4">{formatDateID(invoice?.subscription.ends_at)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium border-yellow-800 bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">{invoice?.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      {invoice?.orders.status === "PENDING" ? (
                        <a href="#" className="text-blue-600 hover:underline">
                          Bayar
                        </a>
                      ) : (
                        invoice?.orders.status
                      )}
                      </td>
                    <td className="px-6 py-4 text-right">
                      <button
                          onClick={() => downloadInvoice(invoice?.orders.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Download invoice
                        </button>
                    </td>
                  </tr>
                    ) )}
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
          )}



        </section>

      </main>
    </div>
  );
}
