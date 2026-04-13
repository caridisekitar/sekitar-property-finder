import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { User } from '@/types';
import { secureGet } from '@/lib/secureGet';
import { securePost } from '@/lib/securePost';
import { useAuth } from '@/hooks/useAuth';
import { formatDateID } from "@/lib/date";
import LoadingOverlay from "@/components/LoadingOverlay";
import DropdownMobileMenu from '@/components/profile/DropdownMobileMenu';


export const PAYMENT_METHODS = [
  { code: "VC", label: "Visa / Master Card / JCB" },
  { code: "BC", label: "BCA Virtual Account" },
  { code: "M2", label: "Mandiri Virtual Account" },
  { code: "VA", label: "Maybank Virtual Account" },
  { code: "I1", label: "BNI Virtual Account" },
  { code: "B1", label: "CIMB Niaga Virtual Account" },
  { code: "BT", label: "Permata Bank Virtual Account" },
  { code: "A1", label: "ATM Bersama" },
  { code: "AG", label: "Bank Artha Graha" },
  { code: "NC", label: "Bank Neo Commerce / BNC" },
  { code: "BR", label: "BRIVA" },
  { code: "SI", label: "Bank Sahabat Sampoerna" },
  { code: "DM", label: "Danamon Virtual Account" },
  { code: "BV", label: "BSI Virtual Account" },
  { code: "FT", label: "Pegadaian / ALFA / Pos" },
  { code: "IR", label: "Indomaret" },
  { code: "OV", label: "OVO (Support Void)" },
  { code: "SA", label: "ShopeePay Apps (Support Void)" },
  { code: "LF", label: "LinkAja Apps (Fixed Fee)" },
  { code: "LA", label: "LinkAja Apps (Percentage Fee)" },
  { code: "DA", label: "DANA" },
  { code: "SL", label: "ShopeePay Account Link" },
  { code: "OL", label: "OVO Account Link" },
  { code: "SP", label: "ShopeePay" },
  { code: "NQ", label: "Nobu" },
  { code: "GQ", label: "Gudang Voucher" },
  { code: "SQ", label: "Nusapay" },
  { code: "DN", label: "Indodana Paylater" },
  { code: "AT", label: "ATOME" },
  { code: "JP", label: "Jenius Pay" },
];


export default function SubscriptionsPage() {
  // const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const { subscription, user } = useAuth();
    const [invoices, setInvoices] = useState<{
      orders: any[];
      subscription?: any;
    }>({
      orders: [],
    });
    const [repayingId, setRepayingId] = useState<number | null>(null);
    const [repayError, setRepayError] = useState<string>("");

    const downloadInvoice = async (orderId: number) => {
      try {
        const res = await secureGet(
          `/invoices/${orderId}/${user?.id}/signed-url`
        );

        if (res.url) {
          window.open(res.url, "_blank", "noopener,noreferrer");
        }
      } catch (err) {
        console.error("Failed to open invoice", err);
      }
    };

    const getPaymentLabel = (code) =>
        PAYMENT_METHODS.find(m => m.code === code)?.label ?? code;

  
    useEffect(() => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const fetchProfile = async () => {
        try {
          const res = await secureGet("/auth/me");
        } catch {
          localStorage.clear();
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
          const res = await secureGet(`/invoices/listing/${user.id}`);
          console.log("[invoices raw]", res);
          setInvoices({
              orders: Array.isArray(res.invoices?.orders)
                ? res.invoices.orders
                : [],
              subscription: res.invoices?.subscriptions?.[0] ?? null,
            });
        } catch (err) {
          console.error("Failed to fetch invoices", err);
        }
      };

      fetchInvoices();
    }, [user]);

      if (loading) return <LoadingOverlay message="Memuat data Langgananmu..." />;
  
      if (!user) return null;

      const handlePendingPayment = async (orderId: number) => {
          setRepayError("");
          setRepayingId(orderId);
          try {
            const res = await securePost("/payment/repayment", "POST", {
              order_id: orderId
            });

            if (!res?.paymentUrl) {
              throw new Error("Payment URL tidak tersedia");
            }

            window.location.href = res.paymentUrl;
          } catch (err: any) {
            setRepayError(err?.message || "Gagal memproses pembayaran, coba lagi.");
          } finally {
            setRepayingId(null);
          }
        };

      const onlyExpiredOrder =
          invoices.orders.length > 0 &&
          invoices.orders.every((o) => o.status === "EXPIRED") &&
          invoices.orders.length === 1;



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
            ${subscription?.plan === "PREMIUM" ? "bg-[#FEF3C7]" : "bg-[#DCF4FF]"}
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


          {/* ── PENDING PAYMENT BANNER ── */}
          {subscription?.pending_payment && (
            <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-yellow-800">Pembayaran menunggu konfirmasi</p>
                <p className="text-sm text-yellow-700 mt-0.5">
                  {subscription.pending_payment.product_name} &middot; Rp{subscription.pending_payment.amount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Link pembayaran berlaku 60 menit sejak order dibuat.
                </p>
              </div>
              <button
                onClick={() => handlePendingPayment(subscription.pending_payment!.order_id)}
                disabled={repayingId === subscription.pending_payment.order_id}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition
                  ${repayingId === subscription.pending_payment.order_id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
              >
                {repayingId === subscription.pending_payment.order_id ? "Mengalihkan..." : "Lanjut Bayar"}
              </button>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Riwayat Langganan
            </h2>
          </div>

          {subscription?.plan === "BASIC" && invoices.orders.length === 0 || onlyExpiredOrder && (
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


          {repayError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {repayError}
            </div>
          )}

          {Array.isArray(invoices?.orders) && invoices.orders.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                {/* Scroll hint (mobile only) */}
                <div className="px-4 py-2 text-xs text-gray-400 md:hidden">
                  Geser ke kanan untuk melihat tabel →
                </div>

                <div className="relative overflow-x-auto">
                  <table className="min-w-[900px] md:min-w-full w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium sticky top-0 z-10">
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
                      {invoices.orders.map((order, index) => (
                        <tr key={order.id} className="border-t">
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4">{order.product_name ?? "-"}</td>
                          <td className="px-6 py-4">{formatDateID(order.created_at)}</td>
                          <td className="px-6 py-4">
                            {formatDateID(invoices.subscription?.ends_at)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium
                              ${order.status === "PAID"    ? "bg-green-100 text-green-800"  : ""}
                              ${order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                              ${order.status === "EXPIRED" || order.status === "FAILED" ? "bg-red-100 text-red-700" : ""}
                            `}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {order.payment_code ? (
                              <span className="inline-flex px-3 py-1 text-xs text-green-800">
                                {getPaymentLabel(order.payment_code)}
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1 text-xs text-red-800">
                                -
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {order.status === "PENDING" && (
                                <button
                                  onClick={() => handlePendingPayment(order.id)}
                                  disabled={repayingId === order.id}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition
                                    ${repayingId === order.id
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                  {repayingId === order.id ? "Mengalihkan..." : "Bayar Sekarang"}
                                </button>
                              )}

                              {order.status === "PAID" && (
                                <button
                                  onClick={() => '#'}
                                  className="text-blue-600 hover:underline"
                                >
                                  Download invoice (Segera hadir)
                                </button>
                              )}

                              {(order.status === "EXPIRED" || order.status === "FAILED") && (
                                <p>-</p>
                                // <button
                                //   onClick={() => handlePendingPayment(order.id)}
                                //   className="text-red-600 hover:underline"
                                // >
                                //   Bayar ulang
                                // </button>
                              )}
                            
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            )}




        </section>

      </main>
    </div>
  );
}
