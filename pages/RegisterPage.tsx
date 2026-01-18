import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { secureGet } from '@/lib/secureGet';
import { securePost } from '@/lib/securePost';
import { getDeviceId } from '@/lib/device';

type Plan = "basic" | "premium";
const ALLOWED_PLANS: Plan[] = ["basic", "premium"];

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const paramPlan = params.get("new");
  const isUpgrade = Boolean(paramPlan);


  const selectedPlan: Plan =
    ALLOWED_PLANS.includes(paramPlan as Plan)
      ? (paramPlan as Plan)
      : "basic";

  const [plan, setPlan] = useState<Plan>(selectedPlan);



  /* ===============================
     CHECK EXISTING SESSION
  =============================== */
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  // 👇 if upgrading, DO NOT redirect
  if (paramPlan) 
    return alert('Upgrade');

  (async () => {
    try {
      await secureGet('/auth/me');
      navigate('/profile', { replace: true });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  })();
}, [navigate, paramPlan]);


  /* ===============================
     SUBMIT REGISTER
  =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Semua field wajib diisi');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    if (loading) return; // 🚫 prevent spam
    setLoading(true);

    try {
    // ✅ device_id MUST exist BEFORE request
    const deviceId = getDeviceId();

    const res = await securePost(
      '/auth/register',
      'POST',
      {
        name,
        email,
        phone,
        password,
        plan,
      },
      {
        'X-Device-Id': deviceId,
      }
    );

    if (!res.success) {
      setError(res.message || 'Registrasi gagal');
      return;
    }

    // ✅ Store auth
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    // 🔥 PREMIUM → PAYMENT
    if (plan === 'premium') {
      const payment = await securePost(
        '/duitku/create',
        'POST',
        {
          amount: 99000,
          product_name: 'Subscription Premium',
          user_id: res.data.user.id,
          email: res.data.user.email,
          phone: res.data.user.phone,
          name: res.data.user.name,
        },
        {
          Authorization: `Bearer ${res.data.token}`,
          'X-Device-Id': deviceId,
        }
      );

      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
        return;
      }
    }

    navigate('/profile', { replace: true });

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
    style={{
      backgroundImage: "url('/images/bg-login.webp')"
    }}
  ></div>

  {/* LEFT: REGISTER FORM */}
  <div className="flex items-center justify-center py-2 lg:py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-xl w-full space-y-4 md:space-y-8 lg:space-y-8 p-2 md:p-8 lg:p-8">

      {/* Logo + Title */}
      <div className="">
        <div
          className="flex cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img alt="Logo" src="/images/logo-header-sekitar.png" className="h-[44px] md:h-[54px] lg:h-[54px] w-auto text-blue-400"/>
        </div>

        <h2 className="mt-6 text-[20px] md:text-[32px] lg:text-[32px] font-semibold text-gray-900">
          Daftar ke Sekitar
        </h2>
        <p className="mt-2 text-xs text-gray-600">
          Cuma butuh 3 detik untuk daftar, dan kamu bisa langsung akses ratusan kost, lho!
        </p>
      </div>

      {/* FORM */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">

          {/* NAME */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Lengkap
            </label>
            <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
              <User size={20} className="w-6 h-6 text-gray-500"/>
              <input 
              id="name"
              name="name" 
              type="text" 
              required 
              placeholder="Masukkan nama lengkap kamu" 
              className="w-full outline-none px-3 py-1 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" 
              value={name} onChange={(e) => setName(e.target.value)} />

            </div>
          </div>

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
              value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>


          {/* PHONE NUMBER */}
          <div className="mb-4">
            <label
              htmlFor="phone-number"
              className="block text-sm font-medium text-gray-700 mb-1 mt-4"
            >
              Nomor Telepon
            </label>
            <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
              <Phone size={20} className="w-6 h-6 text-gray-500"/>

              <input 
              id="phone-number" 
              name="phone" 
              type="tel" 
              required 
              placeholder="Masukkan no telepon kamu yang terhubung ke WhatsApp, contoh: 08xxxxxxxxx" 
              className="w-full outline-none px-3 py-1 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" 
              value={phone} onChange={(e) => setPhone(e.target.value)} />
              
            </div>

          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password-code"
              className="block text-sm font-medium text-gray-700 mb-1 mt-4"
            >
              Password
            </label>
            <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
              <Lock size={20} className="w-6 h-6 text-gray-500"/>

              <input 
              id="password-code" 
              name="password" 
              type="password" 
              required 
              placeholder="Masukkan kata sandi kamu" 
              className="w-full outline-none px-3 py-1 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" 
              value={password} onChange={(e) => setPassword(e.target.value)} />
              
            </div>

          </div>


          
        </div>
        {/* ERROR MESSAGE */}
        {error && (
          <div className="text-sm text-red-500 mb-2">
            {error}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div>
          <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors
                ${loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'}`}
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
        </div>
      </form>

      {/* LOGIN LINK */}
      <div className="">
        <p className="text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  </div>

  {/* RIGHT: BACKGROUND IMAGE */}
  <div
    className="hidden lg:block bg-cover bg-center"
    style={{
      backgroundImage: "url('/images/bg-login.webp')"
    }}
  ></div>
</div>

  );
}

function Input({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
        <span className="text-gray-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full outline-none text-sm"
          required
        />
      </div>
    </div>
  );
}