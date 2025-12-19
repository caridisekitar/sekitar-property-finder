import { Link } from 'react-router-dom';
import React from 'react';

const NotFoundKost: React.FC = () => {
  return (
        <div className="px-5 py-16 flex flex-col items-center justify-center bg-white">
          <img src="/images/not-found-kost.png" alt="Kost Not Found" className="w-[300px] h-[300px]" />
          <h5 className="mt-3 font-bold text-[24px]">Detail Kos Tidak Ditemukan!</h5>
          <p className="text-gray-500 mt-1 text-[14px]">Coba cari kos lain di menu pencarian.</p>
          <Link
            to="/cari-kost"
            className="mt-8 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-center w-full md:w-[250px] lg:w-[300px]"
          >
            Cari Kos
          </Link>
        </div>
      );
};

export default NotFoundKost;