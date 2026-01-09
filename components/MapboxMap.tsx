import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import PropertyCard from './PropertyCard';
import { secureGet } from '@/lib/secureGet';
import { formatHargaRange } from '@/lib/helper';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

type Property = {
  name: string;
  slug: string;
  city: string;
  price_monthly: number;
  longitude: number;
  latitude: number;
  img_cover: string;
  type: string;
};

type PropertyCardProps = {
  property: Property;
  onClose: () => void;
};

const MapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [kostBasic, setKostBasic] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let isMounted = true;

    const initMap = async () => {
      const res = await secureGet('/kost/basic');
      if (!isMounted) return;

      // setKostBasic(res.data);

      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [106.816666, -6.200000],
        zoom: 11.5,
      });

      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      res.data.forEach((property: Property) => {
        const el = document.createElement('div');
        el.className =
          'flex items-center gap-1 bg-[#18181B] px-3 py-1 rounded-full shadow-md text-sm font-semibold cursor-pointer border border-gray-200 text-white';

        const icon = document.createElement('img');
        icon.src = '/images/icons/icon-map.svg';
        icon.className = 'w-6 h-6';

        const price = document.createElement('span');
        price.innerText = `Rp ${formatHargaRange(property.price_monthly)}`;

        el.appendChild(icon);
        el.appendChild(price);

        el.onclick = () => {
          setSelectedProperty(property);
          map.flyTo({
            center: [property.longitude, property.latitude],
            zoom: 15,
            offset: [0, 120],
          });
        };

        const marker = new mapboxgl.Marker(el)
          .setLngLat([property.longitude, property.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    initMap();

  return () => {
      isMounted = false;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
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
