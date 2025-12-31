import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import PropertyCard from './PropertyCard';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

type Property = {
  id: string;
  title: string;
  price: number;
  lng: number;
  lat: number;
  image: string;
  type: string;
};

const MapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [106.816666, -6.200000],
      zoom: 12,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const properties: Property[] = [
    {
        id: '1',
        title: 'Modern Apartment Menteng',
        price: 2500000,
        lng: 106.816666,
        lat: -6.200000,
        image: 'https://picsum.photos/seed/apt1/400/300',
        type: 'kost apartment',
    },
    {
        id: '2',
        title: 'Minimalist House Kemang',
        price: 1800000,
        lng: 106.8105,
        lat: -6.2615,
        image: 'https://picsum.photos/seed/house2/400/300',
        type: 'kost campuran',
    },
    {
        id: '3',
        title: 'Cozy Studio Sudirman',
        price: 2200000,
        lng: 106.8230,
        lat: -6.2146,
        image: 'https://picsum.photos/seed/studio3/400/300',
        type: 'kost putri',
    },
    {
        id: '4',
        title: 'Luxury Residence SCBD',
        price: 3500000,
        lng: 106.8069,
        lat: -6.2275,
        image: 'https://picsum.photos/seed/lux4/400/300',
        type: 'kost putra',
    },
    {
        id: '5',
        title: 'Family House Tebet',
        price: 2000000,
        lng: 106.8566,
        lat: -6.2262,
        image: 'https://picsum.photos/seed/family5/400/300',
        type: 'kost campuran',
    },
    {
        id: '6',
        title: 'Affordable Kost Cikini',
        price: 1200000,
        lng: 106.8413,
        lat: -6.1921,
        image: 'https://picsum.photos/seed/kost6/400/300',
        type: 'kost putri',
    },
    ];

    function formatPriceJt(price: number): string {
    if (price >= 1_000_000) {
        const jt = price / 1_000_000;

        // Remove trailing .0, keep 1 decimal if needed
        const formatted = jt % 1 === 0
        ? jt.toString()
        : jt.toFixed(1).replace('.', ',');

        return `${formatted}jt`;
    }

    return price.toLocaleString('id-ID');
    }



    properties.forEach((property) => {
        // 1. Root marker element
        const el = document.createElement('div');
        el.className =
            'flex items-center gap-1 bg-[#18181B] px-3 py-1 rounded-full shadow-md text-sm font-semibold cursor-pointer border border-gray-200 text-white';

        // 2. SVG icon (inline)
        const icon = document.createElement('img');
        icon.src = '/images/icons/icon-map.svg'; // <-- your SVG path
        icon.alt = 'Property';
        icon.className = 'w-6 h-6';

        // 3. Price text
        const price = document.createElement('span');
        price.innerText = `Rp ${formatPriceJt(property.price)} `;

        // 4. Append icon + price
        el.appendChild(icon);
        el.appendChild(price);

        // 5. Click handler
        el.onclick = () => {
            setSelectedProperty(property);

            map.flyTo({
            center: [property.lng, property.lat],
            zoom: 15,
            offset: [0, 10], // space for card + arrow
            });
        };

        // 6. Add marker to map
        new mapboxgl.Marker(el)
            .setLngLat([property.lng, property.lat])
            .addTo(map);
        });


    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* MAP */}
      <div
        ref={mapContainerRef}
        className="h-[650px] rounded-xl"
      />

      {/* PROPERTY CARD */}
      {selectedProperty && (
        <PropertyCard
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default MapPage;
