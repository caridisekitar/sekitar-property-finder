import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { securePost } from "@/lib/securePost";
import { secureGet } from '@/lib/secureGet';
import { User } from '@/types';
import SidebarMenu from '@/components/profile/SidebarMenu';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking | success | pending | failed
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const merchantOrderId = params.get("merchantOrderId");
  const reference = params.get("reference");

  useEffect(() => {
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
    if (!merchantOrderId) return;

    const checkStatus = async () => {
      try {
        const res = await securePost(
          "/duitku/check-status",
          "POST",
          {
            merchantOrderId,
            reference
          }
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
            <SidebarMenu user={user}/>
                <div className="px-5 h-screen flex flex-col items-center justify-center mx-auto">
                <img src="/images/payment-success.png" alt="Payment Success" className="w-[300px] h-[300px]" />
                <h5 className="mt-3 font-bold text-[24px]">Selamat! Akun Premium-mu aktif</h5>
                <p className="text-gray-500 mt-1 text-[14px]">Akunmu sekarang sudah jadi Premium. Lebih bebas, lebih lengkap, lebih seru.
Nikmati semua akses tanpa hambatan mulai sekarang!</p>
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
        <img src="/images/payment-success.png" alt="Payment Success" className="w-[300px] h-[300px]" />
        <h5 className="mt-3 font-bold text-[24px]">Pembayaran Pending ⏳</h5>
        <p className="text-gray-500 mt-1 text-[14px]">Kami akan memproses pembayaran Anda</p>
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
      </div>
    </div>
  );
}
