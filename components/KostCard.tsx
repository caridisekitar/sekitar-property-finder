import React from 'react';
import type { Kost } from '../types';
import HomeIcon from './icons/HomeIcon';
import LocationIcon from './icons/LocationIcon';
import SparklesIcon from './icons/SparklesIcon';

const KostCard: React.FC<{ kost: Kost }> = ({ kost }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 h-full flex flex-col">
        <div className="relative">
            <img className="w-full h-48 object-cover" src={kost.imageUrl} alt={kost.name} />
            <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow">
                    <HomeIcon className="w-3 h-3 text-gray-600"/> {kost.type}
                </span>
                {kost.isNew && (
                    <div className="relative">
                         <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow">
                            <SparklesIcon className="w-3 h-3"/> New
                        </span>
                        <div className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-orange-500"></div>
                    </div>
                )}
            </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-md font-bold truncate">{kost.name}</h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 truncate"><LocationIcon className="w-4 h-4 flex-shrink-0"/>{kost.location}</p>
            <div className="mt-auto pt-4">
                <div className="bg-brand-light-blue text-brand-dark text-center font-bold py-2 rounded-lg">
                    Rp{kost.price.toLocaleString('id-ID')}
                </div>
            </div>
        </div>
    </div>
);

export default KostCard;