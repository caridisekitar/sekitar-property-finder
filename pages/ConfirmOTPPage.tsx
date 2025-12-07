'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ConfirmOTPPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const value = e.target.value.replace(/\D/g, ""); // Allow digits only
  if (!value) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // Move to next input
  if (index < 5 && value) {
    inputsRef.current[index + 1]?.focus();
  }
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  if (e.key === "Backspace") {
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);

    if (index > 0 && !otp[index]) {
      inputsRef.current[index - 1]?.focus();
    }
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock register logic
    console.log('Registering:', name);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">

  {/* LEFT: REGISTER FORM */}
  <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-lg w-full space-y-8 p-4 md:p-8 lg:p-8">

      {/* Logo + Title */}
      <div className="">
        <div
          className="flex cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img alt="Logo" src="/images/logo-header-sekitar.png" className="h-[44px] md:h-[54px] lg:h-[54px] w-auto text-blue-400"/>
        </div>

        <h2 className="mt-6 text-[20px] md:text-[32px] lg:text-[32px] font-semibold text-gray-900">
          Masukkan Kode OTP
        </h2>
        <p className="mt-2 text-xs text-gray-600">
          Kami sudah mengirimkan kode OTP ke WhatsApp kamu. Cek pesanmu dan masukkan kodenya untuk masuk ke website, ya!
        </p>
      </div>

      {/* FORM */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">

          {/* OTP INPUTS */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-14 text-center text-xl border border-gray-300 rounded-lg bg-white shadow-sm 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>


        </div>

        {/* SUBMIT BUTTON */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            Konfirmasi kode
          </button>
        </div>
      </form>

      {/* LOGIN LINK */}
      <div className="">
        <p className="text-sm text-gray-600">
          Tidak menerima kode?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Kirim Ulang Kode Disini
          </Link>
        </p>
        <p className="text-xs text-gray-600 mt-2">Kirim ulang dalam 00:59 (3/3)</p>
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