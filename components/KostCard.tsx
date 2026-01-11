import React from 'react';
import type { Kost } from '../types';
import BedIcon from '@/components/icons/BedIcon';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatHargaRange } from '@/lib/helper';
import { getVideoPoster, getImageCover } from "@/lib/image";

const KostCard: React.FC<{ kost: Kost }> = ({ kost }) => (
  <div>
    {/* <div className="flex-shrink-0 w-full lg:w-[240px] bg-white rounded-xl shadow-md overflow-hidden snap-center"> */}
    <div
  className="
    hidden lg:block
    flex-shrink-0
    w-[300px] lg:w-[220px]
    bg-white rounded-xl shadow-md
    overflow-hidden snap-start
  "
>
        <Link to={`/kost/${kost.slug}`}>
        {/* IMAGE */}
      <div className="relative lg:h-[360px] w-auto">
        <img
              src={getImageCover(kost.images) || kost.img_cover}
              alt={kost.name}
              className="h-full w-full object-cover"
            />

        {/* TYPE BADGE */}
        <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-2xl flex items-center gap-2 shadow-sm">
          {/* <img src="/images/bed.svg" alt="bed"  /> */}
          <BedIcon className="w-3 h-3"/> 
          <span className="font-medium text-gray-900 text-[10px]">
            {kost.type}
          </span>
        </div>

        {/* NEW BADGE */}
        {kost.isNew && (
          <div className="absolute top-1 -right-2 text-white py-2 rounded-l-xl rounded-r-sm flex items-center gap-2 shadow-sm">
            <img src="/images/new.svg" alt="new" />
          </div>
        )}

        {/* FLOATING INFO CARD */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[90%] bg-white rounded-xl shadow-lg p-3">
        <h3 className="text-[14px] font-medium text-gray-900 truncate" alt={kost.name}>
          {kost.name || ''}
        </h3>

        {/* LOCATION */}
        <div className="flex items-center text-gray-500 mt-1 mb-3 text-xs truncate">
          <MapPin size={16} className="mr-1" />
          {kost.city}
        </div>

        {/* PRICE */}
        <div className="bg-[#EAF6FF] rounded-xl py-3 text-center">
          <span className="text-[16px] font-bold text-gray-900">
            Rp {formatHargaRange(kost.price_monthly)}

          </span>
        </div>
      </div>
      </div>
        </Link>
    </div>
    {/* Mobile View */}
    <Link to={`/kost/${kost.slug}`}>
    <div className="relative lg:hidden
    flex-shrink-0
    overflow-hidden rounded-xl
    bg-gray-200 snap-start shadow-md">
      {/* Background Image */}
      <img
        src={getImageCover(kost.images) || kost.img_cover}
        alt="Kost Room"
        className="max-h-[200px] w-full object-cover"
      />

      {/* Overlay Card */}
      <div className="w-full rounded-b-xl bg-white p-3 shadow-xl px-2">
        {/* Type */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F0F9FF] px-3 py-1 text-xs font-medium truncate">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
            <path d="M3 7l9-4 9 4" />
          </svg>
          {kost.type}
        </div>

        {/* Title */}
        <h3 className="text-xs font-bold text-gray-900 truncate">
          {kost.name || ''}
        </h3>

        {/* Location */}
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
            <circle cx="12" cy="11" r="2" />
          </svg>
          {kost.city}
        </p>

        {/* Price */}
        <div className="mt-1 rounded-lg bg-[#F0F9FF] py-2 text-center text-sm font-bold text-gray-900">
          Rp {formatHargaRange(kost.price_monthly)}
        </div>
      </div>
    </div>
    </Link>

    
  </div>
);

export default KostCard;