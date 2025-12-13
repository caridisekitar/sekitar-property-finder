import { Link } from 'react-router-dom';
export default function KostDetail() {
  return (
    <div className="px-5 h-screen flex flex-col items-center justify-center bg-white">
      <h5 className="mt-3 font-bold text-[24px]">Detail kos.</h5>
      
      <Link
        to="/"
        className="mt-8 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
