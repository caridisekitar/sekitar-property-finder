import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { securePost } from "@/lib/securePost";
import { secureGet } from '@/lib/secureGet';
import { User } from '@/types';
import SidebarMenu from '@/components/profile/SidebarMenu';

type OrderPlan = { name: string };
type Order = { plan?: OrderPlan; product_name?: string; [key: string]: any };

function planLabel(order: Order | null): string {
  const name = order?.plan?.name ?? "";
  if (name === "PREMIUM_PLUS") return "Premium Plus";
  if (name === "PREMIUM") return "Premium";
  return "Premium";
}

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking | success | pending | failed
  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const merchantOrderId = params.get("merchantOrderId");
  const reference = params.get("reference");

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const data = await secureGet("/auth/me");
            setUser(data.user ?? data);
        } catch (err) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
        } finally {
            setLoading(false);
        }
    };
    if (!merchantOrderId) return;

    const checkStatus = async () => {
      try {
        const res = await securePost(
          "/duitku/check-status",
          "POST",
          { merchantOrderId, reference }
        );

        setOrder(res.order);

        if (res.status === "PAID") {
          setStatus("success");
        } else if (res.status === "PENDING") {
          setStatus("pending");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setStatus("failed");
      }
    };

    fetchProfile();
    checkStatus();
  }, [merchantOrderId]);

  // Poll every 3s while pending (up to 20 attempts = ~60s)
  // Handles delayed Duitku callbacks arriving after page load
  useEffect(() => {
    if (status !== "pending" || !merchantOrderId) return;

    let attempts = 0;
    const maxAttempts = 20;

    const poll = setInterval(async () => {
      attempts++;
      try {
        const res = await securePost("/duitku/check-status", "POST", {
          merchantOrderId,
          reference,
        });

        if (res.status === "PAID") {
          setOrder(res.order);
          setStatus("success");
          clearInterval(poll);
        } else if (res.status === "FAILED") {
          setStatus("failed");
          clearInterval(poll);
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
        }
      } catch {
        clearInterval(poll);
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [status, merchantOrderId]);

  // UI STATES
  if (status === "checking") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">Memverifikasi pembayaran...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
        <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
            {user && <SidebarMenu user={user} />}
                <div className="px-5 h-screen flex flex-col items-center justify-center mx-auto">
                <img src="/images/payment-success.png" alt="Payment Success" className="w-[300px] h-[300px]" />
                <h5 className="mt-3 font-bold text-[24px]">Selamat! Akun {planLabel(order)}-mu aktif</h5>
                <p className="text-gray-500 mt-1 text-[14px]">Akunmu sekarang sudah jadi {planLabel(order)}. Lebih bebas, lebih lengkap, lebih seru. Nikmati semua akses tanpa hambatan mulai sekarang!</p>
                <Link
                    to="/cari-kost"
                    className="mt-8 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    Mencari Kos
                </Link>
                </div>
            
            </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
        <SidebarMenu user={user}/>
        <div className="px-5 h-screen flex flex-col items-center justify-center mx-auto">
          <img src="/images/payment-success.png" alt="Payment Pending" className="w-[300px] h-[300px] opacity-60" />
          <h5 className="mt-3 font-bold text-[24px]">Memverifikasi Pembayaran ⏳</h5>
          <p className="text-gray-500 mt-2 text-[14px] text-center max-w-sm">
            Pembayaranmu sedang diproses. Halaman ini akan otomatis update begitu konfirmasi diterima — jangan tutup halaman ini.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Mengecek status...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-red-600">
          Pembayaran Gagal ❌
        </h1>
        <p className="mt-2 text-gray-600">
          Silakan coba kembali
        </p>
        <button
          onClick={() => navigate("/profile/upgrade")}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
