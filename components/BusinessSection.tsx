import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { BUSINESSES } from '@/constants';

const BusinessSection: React.FC = () => {
  return (
    <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 blur-lg">
          {BUSINESSES.map((biz) => (
            <div key={biz.id} className="relative rounded-xl overflow-hidden bg-white shadow-md">
                <a href={`/business/`+ biz.id}>
        
                <div className="relative h-[360px] w-full">
                  <img
                    src={biz.image}
                    alt={biz.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[90%] bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-2">
                  <h3 className="text-[16px] lg:text-[16px] md:text-[16px] text-white">
                    {biz.name}
                  </h3>
                  
                  <div className="text-center flex justify-between items-end">
                    <span className="text-[16px] lg:text-[16px] md:text-[16px] font-bold text-white">
                      {biz.priceRange}
                    </span>
                    <div className="w-8 h-8 bg-white rounded-full p-2 hover:bg-gray-200 transition-colors">
                      <ChevronRight size={16} className="text-gray-900" />
                    </div>
                  </div>
                </div>
                </a>
              </div>

          ))}

          
        </div>

        {/* LOCK OVERLAY */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
              <div className="flex justify-center mb-4">
                <img
                  src="/images/favicon.webp"
                  alt="Lock Icon"
                  className="w-16 h-16"
                />
              </div>

              <h3 className="text-xl font-bold mb-2">Segera Hadir!</h3>

              {/* <button
                className="px-6 py-3 rounded-xl bg-[#96C8E2] text-white font-semibold hover:bg-blue-600 transition"
              >
                Coming Soon
              </button> */}
            </div>
          </div>
        </div>
      );
};

export default BusinessSection;