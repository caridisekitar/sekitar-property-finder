import React, { useEffect, useState, cache } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, Phone } from 'lucide-react';
import { secureGet } from '@/lib/secureGet';
import { securePost } from '@/lib/securePost';
import { generateUUID } from '@/lib/uuid';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const checkSession = async () => {
      try {
        // If token is valid → returns user data
        const data = cache(useAuth());

        // Optional: sync user data
        localStorage.setItem("user", JSON.stringify(data));

        // Session valid
        navigate("/profile", { replace: true });

      } catch (err) {
        // Session invalid / expired / tampered
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    checkSession();
  }, [navigate]);

  if (!localStorage.getItem('device_id')) {
      localStorage.setItem('device_id', generateUUID());
    }


  const normalizePhone = (value: string): string | null => {
  const cleaned = value.replace(/\s|-/g, '');

  if (/^08\d{8,11}$/.test(cleaned)) {
    return '62' + cleaned.substring(1);
  }

  if (/^\+62\d{8,11}$/.test(cleaned)) {
    return cleaned.substring(1);
  }

  if (/^62\d{8,11}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      setError('Nomor telepon wajib diisi');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const normalizedPhone = normalizePhone(phone);

      if (!normalizedPhone) {
        setError('Format nomor tidak valid. Gunakan 08xxxx, 62xxxx, atau +62xxxx');
        return;
      }

      const response = await securePost(
          "/otp/generate",
          "POST",
          { phone: normalizedPhone }
        );


      // console.log("OTP sent:", response);
      // console.log(response.status);

      // 🔴 Rate limit detected
      if (response.status === 429 || response.status != 200) {
        // const data = await response.json();
        
        setError(response.message || "Terlalu banyak permintaan. Coba lagi besok.");
        return;
      }

      // ✅ Success
      navigate('/confirm-otp', {
        state: { phone: normalizedPhone },
      });

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">

      <div
        className="md:hidden lg:hidden block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-login.webp')" }}
      ></div>

      {/* LEFT */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 p-4 md:p-8 lg:p-8">

          <div>
            <div className="flex cursor-pointer" onClick={() => navigate('/')}>
              <img
                alt="Logo"
                src="/images/logo-header-sekitar.png"
                className="h-[44px] md:h-[54px] w-auto"
              />
            </div>

            <h2 className="mt-6 text-[20px] md:text-[32px] font-semibold text-gray-900">
              Masuk ke Sekitar
            </h2>
          </div>

          <form className="mt-3 space-y-6" onSubmit={handleSubmit}>
            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
                <Phone size={20} className="text-gray-500" />
                <input
                  type="tel"
                  placeholder="Masukkan nomor telepon kamu"
                  className="w-full outline-none px-3 py-1 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {/* INFO */}
            <div className="bg-[#E0F2FE] rounded-lg p-3 flex gap-2">
              <Info size={32} className="text-gray-500" />
              <p className="text-xs text-gray-600">
                OTP dikirim via WhatsApp. Pastikan nomor kamu aktif WhatsApp.
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Mengirim OTP...' : 'Kirim OTP'}
            </button>
          </form>

          {/* REGISTER */}
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-blue-600">
              Daftar sekarang
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT */}
      <div
        className="hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-login.webp')" }}
      ></div>
    </div>
  );
}
