import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { securePost } from '@/lib/securePost';
import { generateUUID } from '@/lib/uuid';


const OTP_LENGTH = 6;
const RESEND_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 3;

export default function ConfirmOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone =
    location.state?.phone ||
    sessionStorage.getItem('otp_phone');

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptLeft, setAttemptLeft] = useState(MAX_ATTEMPTS);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  

  // 🔐 Guard
  useEffect(() => {
    if (!phone) navigate('/login', { replace: true });
  }, [phone, navigate]);

  // ⏱ Resend timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const t = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const otpValue = otp.join('');
  const isOtpComplete = otpValue.length === OTP_LENGTH;
  if (!localStorage.getItem('device_id')) {
    localStorage.setItem('device_id', generateUUID());
  }

  // ✏️ Input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const v = e.target.value.replace(/\D/g, '');
    if (!v) return;

    const next = [...otp];
    next[idx] = v[0];
    setOtp(next);

    if (idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  // ⌫ Backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      const next = [...otp];
      next[idx] = '';
      setOtp(next);

      if (idx > 0) inputsRef.current[idx - 1]?.focus();
    }
  };

  // 📋 Paste OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pasted.length !== OTP_LENGTH) return;

    setOtp(pasted.split(''));
    inputsRef.current[OTP_LENGTH - 1]?.focus();
  };

  // ✅ Verify OTP
  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (!isOtpComplete || loading) return;

    setLoading(true);
    setError(null);

    try {

      const data = await securePost(
                "/auth/verify-otp",
                "POST",
                {
                  phone,
                  otp: otpValue,
                  device_id: localStorage.getItem('device_id')
                }
              );

    // 🎉 SUCCESS
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    sessionStorage.removeItem("otp_phone");
    // 🔁 restore redirect
    const redirectTo = localStorage.getItem("post_login_redirect");

    const safeRedirect =
      redirectTo && redirectTo.startsWith("/")
        ? redirectTo
        : "/";

    navigate(safeRedirect, { replace: true });
    localStorage.removeItem("post_login_redirect");

    // navigate("/", { replace: true });

    } 
    catch (err: any) {

      if (err.status === 409) {
        setError(err.message || "OTP sudah tidak valid");
        return;
      }

      if (err.attempt_left !== undefined) {
        setAttemptLeft(err.attempt_left);
      }

      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();

      setError(err.message || "Gagal verifikasi OTP");
    }
    // catch (err: any) {
    //   // Backend should return attempt_left on error
    //   if (err.attempt_left !== undefined) {
    //     setAttemptLeft(err.attempt_left);
    //   } else {
    //     setAttemptLeft(a => a - 1);
    //   }

    //   setOtp(Array(OTP_LENGTH).fill(""));
    //   inputsRef.current[0]?.focus();

    //   setError(err.message || "Gagal verifikasi OTP");
    // } 
    finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOTP = async () => {
    setError(null);
    if (!canResend || resendCount >= 3) return;

    const response = await securePost(
          "/otp/generate",
          "POST",
          { phone: phone }
        );

    setResendCount(c => c + 1);
    setTimeLeft(RESEND_SECONDS);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(''));
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
  <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-lg w-full space-y-8 p-6 md:p-8 lg:p-8">

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
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
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
            disabled={!isOtpComplete || loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            {loading ? 'Memverifikasi...' : 'Konfirmasi kode'}
          </button>
        </div>
      </form>
      { error && <div className="text-sm text-red-500">{error}</div> }

      {/* LOGIN LINK */}
      <div className="">
        <p className="text-sm text-gray-600">
          Tidak menerima kode?{" "}
          
          {/* <button
            type="button"
            onClick={handleResendOTP}
            disabled={!canResend}
            className={`font-medium ${
              canResend
                ? "text-blue-600 hover:text-blue-500"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Kirim Ulang Kode Disini
          </button> */}
          <button
            type="button"
            disabled={!canResend}
            onClick={handleResendOTP}
            className="font-medium text-sm text-blue-600 disabled:text-gray-400"
          >
            Kirim Ulang Kode Disini
          </button>
        </p>
        {!canResend && (
          <p className="text-xs text-gray-500">
            Kirim ulang dalam {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </p>
        )}
        {/* <p className="text-xs text-gray-600 mt-2">
          {canResend
            ? `Kamu bisa kirim ulang sekarang (${resendCount}/3)`
            : `Kirim ulang dalam ${formatTime(timeLeft)} (${resendCount}/3)`
          }
        </p> */}
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