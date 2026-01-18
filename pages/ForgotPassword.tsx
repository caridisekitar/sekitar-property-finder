import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { securePost } from "@/lib/securePost";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* -------------------------
   * REDIRECT IF LOGGED IN
   * ------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  /* -------------------------
   * SUBMIT FORGOT PASSWORD
   * ------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await securePost(
        "/auth/forgot-password",
        "POST",
        { email }
      );

      if (!res.success) {
        setError(res.message || "Gagal mengirim email reset");
        return;
      }

      setSuccess(
        "Link reset password sudah dikirim ke email kamu. Silakan cek inbox / spam."
      );

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">

      {/* MOBILE BG */}
      <div
        className="md:hidden lg:hidden block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-login.webp')" }}
      />

      {/* LEFT */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 p-4 md:p-8 lg:p-8">

          {/* HEADER */}
          <div>
            <div className="flex cursor-pointer" onClick={() => navigate("/")}>
              <img
                alt="Logo"
                src="/images/logo-header-sekitar.png"
                className="h-[44px] md:h-[54px] w-auto"
              />
            </div>

            <h2 className="mt-6 text-[20px] md:text-[32px] font-semibold text-gray-900">
              Lupa Password?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Masukkan email akun kamu, kami akan kirimkan link reset password.
            </p>
          </div>

          {/* FORM */}
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
                <Mail size={20} className="text-gray-500" />
                <input
                  type="email"
                  placeholder="Masukkan e-mail kamu"
                  className="w-full outline-none px-3 py-1 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {/* SUCCESS */}
            {success && (
              <p className="text-sm text-green-600">{success}</p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>

          {/* BACK TO LOGIN */}
          <p className="text-sm text-gray-600 text-center">
            Ingat password?{" "}
            <Link to="/login" className="font-medium text-blue-600">
              Kembali ke login
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT */}
      <div
        className="hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-login.webp')" }}
      />
    </div>
  );
}
