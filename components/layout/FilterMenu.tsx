import React, { useState } from 'react';

interface FilterMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const propertyTypes = ['Kost', 'Villa', 'Apartemen'];
const rentalDurations = ['Harian', 'Bulanan', 'Tahunan'];
const sortOptions = ['Harga Terendah', 'Harga Tertinggi'];

const locations = ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara'];
const kostType = ['Kost Putri', 'Kost Putra', 'Kost Campur', 'Jendela luar', 'KM Dalam', 'Dekat transum'];
const priceRange = ['1000000 - 2000000', '2000000 - 3000000', '3000000 - 5000000', 'Diatas 5jt (eksklusif)'];

const FilterMenu: React.FC<FilterMenuProps> = ({ isOpen, setIsOpen }) => {
  // const [selectedLocation, setSelectedLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(false);

  const toggleLocation = (location: string) => {
  setSelectedLocation(prev =>
    prev.includes(location)
      ? prev.filter(l => l !== location) // remove
      : [...prev, location]              // add
  );
};

  const handleReset = () => {
    setSelectedLocation([]);
    setSelectedType(false);
    setSelectedPrice(false);
  };

  const handleApply = () => {
    // Apply filter logic here
    setIsOpen(false);
  };


  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-menu-title"
      >
        <div className="flex justify-between items-center mb-6">
            <h2 id="filter-menu-title" className="text-xl font-bold">Filter</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 text-4xl" aria-label="Close filter menu">&times;</button>
        </div>
        
        <div className="space-y-6">
            {/* Tipe properti */}
            <div>
                <h3 className="font-semibold mb-3">Tipe properti</h3>
                <div className="flex flex-wrap gap-2">
                    {locations.map(location => (
                        <button
                            key={location}
                            onClick={() => toggleLocation(location)}
                            className={`px-4 py-2 text-xs rounded-lg border transition-colors ${
                              selectedLocation.includes(location)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {location}
                          </button>
                    ))}
                </div>
            </div>

            {/* Durasi Sewa */}
            <div>
                <h3 className="font-semibold mb-3">Tipe Kos</h3>
                <div className="flex flex-wrap gap-2">
                    {kostType.map(type => (
                        <button key={type} onClick={() => setSelectedType(type)} className={`px-4 py-2 text-xs rounded-lg border transition-colors ${selectedType === type ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                            {type}
                        </button>
                    ))}
                </div>
            </div>

             {/* Urutkan */}
            <div>
                <h3 className="font-semibold mb-3">Harga</h3>
                <div className="flex flex-wrap gap-2">
                    {priceRange.map(price => (
                        <button key={price} onClick={() => setSelectedPrice(price)} className={`px-4 py-2 text-xs rounded-lg border transition-colors ${selectedPrice === price ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                            {price}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 gap-3">
             <button onClick={handleReset} className="w-full text-center px-4 py-3 text-brand-dark border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-semibold">
                Reset
              </button>
              <button onClick={handleApply} className="w-full text-center px-4 py-3 text-white bg-brand-dark rounded-md hover:bg-gray-800 transition-colors font-semibold">
                Terapkan
              </button>
        </div>
      </div>
    </>
  );
};

export default FilterMenu;
