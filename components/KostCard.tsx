import React from 'react';
import type { Kost } from '../types';
import BedIcon from '@/components/icons/BedIcon';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const KostCard: React.FC<{ kost: Kost }> = ({ kost }) => (
    <div className="flex-shrink-0 w-full lg:w-[240px] bg-white rounded-xl shadow-md overflow-hidden snap-center">
        <Link to={`/kost/${kost.slug}`}>
        {/* IMAGE */}
      <div className="relative h-[360px] w-auto">
        <img
              src={kost.img_cover || ''}
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
        <h3 className="text-[14px] font-medium text-gray-900">
          {kost.name || ''}
        </h3>

        {/* LOCATION */}
        <div className="flex items-center text-gray-500 mt-1 mb-3 text-xs">
          <MapPin size={16} className="mr-1" />
          {kost.location}
        </div>

        {/* PRICE */}
        <div className="bg-[#EAF6FF] rounded-xl py-3 text-center">
          <span className="text-[16px] font-bold text-gray-900">
            {kost.price_monthly.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
      </div>
        </Link>
    </div>
);

export default KostCard;