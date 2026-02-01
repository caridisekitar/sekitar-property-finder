import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { securePost } from "@/lib/securePost";
import { getDeviceId } from "@/lib/device";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------
   * AUTO REDIRECT IF LOGGED IN
   * ------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  /* -------------------------
   * SUBMIT LOGIN
   * ------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const deviceId = getDeviceId(); // ✅ always same per device

      const res = await securePost(
        "/auth/login",
        "POST",
        {
          email,
          password,
        },
        {
          "X-Device-Id": deviceId,
        }
      );

      if (!res.success) {
        setError(res.message || "Login gagal");
        return;
      }

      // ✅ store auth
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/", { replace: true });

    } catch (err: any) {
      setError(err.message || "Email atau password salah");
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

            {/* EMAIL */}
            <div className="mb-4">
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
                <Mail size={20} className="w-6 h-6 text-gray-500"/>
                
                <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                placeholder="Masukkan e-mail kamu" 
                className="w-full outline-none px-3 py-1 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
                <Lock size={18} className="text-gray-500" />
                <input
                  type="password"
                  className="w-full outline-none px-3 py-1 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {/* INFO */}
            {/* <div className="bg-[#E0F2FE] rounded-lg p-3 flex gap-2">
              <Info size={32} className="text-gray-500" />
              <p className="text-xs text-gray-600">
                OTP dikirim via WhatsApp. Pastikan nomor kamu aktif WhatsApp.
              </p>
            </div> */}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          {/* REGISTER */}
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-blue-600">
              Daftar sekarang
            </Link>
            <span className="mx-2">atau</span>
            <Link to="/forgot-password" className="font-medium text-blue-600">
              Lupa Password
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
