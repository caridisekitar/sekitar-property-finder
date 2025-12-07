'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, Phone } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    console.log('Logging in with:', phone);
    navigate('/confirm-otp');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">

    <div
    className="md:hidden lg:hidden block bg-cover bg-center"
    style={{
      backgroundImage: "url('/images/bg-login.webp')"
    }}
  ></div>
  {/* LEFT: LOGIN FORM */}
  <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-xl w-full space-y-8 p-4 md:p-8 lg:p-8">

      <div className="">
        <div className="flex cursor-pointer" onClick={() => navigate('/')}>
          <img alt="Logo" src="/images/logo-header-sekitar.png" className="h-[44px] md:h-[54px] lg:h-[54px] w-auto text-blue-400"/>
        </div>

        <h2 className="mt-6 text-[20px] md:text-[32px] lg:text-[32px] font-semibold text-gray-900">Masuk ke Sekitar</h2>
      </div>

      <form className="mt-3 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          
          {/* PHONE NUMBER */}
          <div className="mb-4">
            <label
              htmlFor="phone-number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nomor Telepon
            </label>
            <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
              <Phone size={20} className="w-6 h-6 text-gray-500"/>
              
              <input 
                id="phone-number"
                name="phone"
                type="phone" 
                placeholder="Masukkan nomor telepon kamu"
                className="w-full outline-none px-3 py-1 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

        </div>
        <div className="w-full max-w-xl">
            
          </div>

        {/* REMEMBER ME + FORGOT */}
        <div className="flex items-center justify-between">
          <div className="bg-[#E0F2FE] rounded-lg p-3 flex items-center gap-2">
            <Info size={40} className="text-gray-500 mr-2"/>
            <p className="text-xs text-gray-600">OTP dikirim via WhatsApp. Pastikan nomor kamu terhubung dengan WhatsApp, ya!</p>
          </div>
          
          
        </div>

        {/* SIGN IN BUTTON */}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
        >
          Kirim OTP
        </button>
      </form>

      {/* REGISTER LINK */}
      <div className="">
        <p className="text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  </div>

  {/* RIGHT: FULL IMAGE BACKGROUND */}
  <div
    className="hidden lg:block bg-cover bg-center"
    style={{
      backgroundImage: "url('/images/bg-login.webp')"
    }}
  ></div>
</div>

  );
}