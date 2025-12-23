import { Link } from 'react-router-dom';
export default function CallbackPage() {
  return (
    <div className="px-5 h-screen flex flex-col items-center justify-center bg-white">
      <img src="/images/free-account.png" alt="404 Not Found" className="w-[300px] h-[300px]" />
      <h5 className="mt-3 font-bold text-[24px]">Callback Page.</h5>
      <p className="text-gray-500 mt-1 text-[14px]"></p>
      <Link
        to="/"
        className="mt-8 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
