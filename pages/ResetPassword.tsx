import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { securePost } from "@/lib/securePost";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* -------------------------
   * TOKEN CHECK
   * ------------------------- */
  useEffect(() => {
    if (!token) {
      setError("Token reset tidak valid atau sudah kadaluarsa");
    }
  }, [token]);

  /* -------------------------
   * SUBMIT RESET
   * ------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirm) {
      setError("Password wajib diisi");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    try {
      setLoading(true);

      const res = await securePost("/auth/reset-password", "POST", {
        token,
        password,
        password_confirmation: confirm,
      });

      if (!res.success) {
        setError(res.message || "Gagal reset password");
        return;
      }

      setSuccess("Password berhasil diperbarui. Silakan login kembali.");

      // redirect after short delay
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Token tidak valid atau sudah kadaluarsa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">

      {/* MOBILE IMAGE */}
      <div
        className="md:hidden block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-login.webp')" }}
      />

      {/* LEFT */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 p-4 md:p-8 lg:p-8 bg-white rounded-xl shadow-sm">

          {/* HEADER */}
          <div>
            <img
              alt="Logo"
              src="/images/logo-header-sekitar.png"
              className="h-[44px] md:h-[54px] w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />

            <h2 className="mt-6 text-[20px] md:text-[28px] font-semibold text-gray-900">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Masukkan password baru untuk akun kamu
            </p>
          </div>

          {/* FORM */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password Baru
              </label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
                <Lock size={18} className="text-gray-500" />
                <input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  className="w-full outline-none px-2 py-1 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* CONFIRM */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Konfirmasi Password
              </label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
                <Lock size={18} className="text-gray-500" />
                <input
                  type="password"
                  placeholder="Ulangi password"
                  className="w-full outline-none px-2 py-1 text-sm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
              disabled={loading || !token}
              className="w-full py-3 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>
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
