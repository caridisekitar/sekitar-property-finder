import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import PropertyCard from './PropertyCard';
import { formatHargaRange } from '@/lib/helper';
import LockedOverlay from './LockedOverlay';
import SubscriptionModal from "@/components/SubscriptionModal";

mapboxgl.accessToken = process.env.MAPBOX_TOKEN as string;

type Property = {
  id: string | number;
  name: string;
  slug?: string;
  city?: string;
  price_monthly?: number | null;
  longitude: number;
  latitude: number;
  img_cover?: string;
  type?: string;
};

type MapboxMapProps = {
  properties: Property[];
  plan: 'FREE' | 'BASIC' | 'PREMIUM';
  onUpgrade: () => void;
};

const MapboxMap: React.FC<MapboxMapProps> = ({ properties, plan, onUpgrade }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [blockedProperty, setBlockedProperty] = useState<Property | null>(null);
  const [showLocked, setShowLocked] = useState(false);
  const [open, setOpen] = useState(false);


  /* =========================
     INIT MAP (ONCE)
  ========================== */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [106.816666, -6.2],
      zoom: 11.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* =========================
     UPDATE MARKERS
  ========================== */
  useEffect(() => {
    if (!mapRef.current) return;

    // remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    properties.forEach(property => {
      if (!property.latitude || !property.longitude) return;

      const el = document.createElement('div');
      el.className =
        'flex items-center gap-1 bg-[#18181B] px-3 py-1 rounded-full shadow-md text-sm font-semibold cursor-pointer border border-gray-200 text-white';

      const icon = document.createElement('img');
      icon.src = '/images/icons/icon-map.svg';
      icon.className = 'w-6 h-6';

      const label = document.createElement('span');
      label.innerText =
        property.price_monthly != null
          ? `Rp ${formatHargaRange(property.price_monthly)}`
          : 'Detail';

      el.appendChild(icon);
      el.appendChild(label);

      // 🔥 CLICK HANDLER (IMPORTANT)
      el.addEventListener('click', () => {
        if (plan === 'BASIC') {
          setBlockedProperty(property);
          return;
        }

        if (plan === 'PREMIUM') {
          setSelectedProperty(property);
          mapRef.current?.flyTo({
            center: [property.longitude, property.latitude],
            zoom: 15,
            offset: [0, 120],
          });
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([property.longitude, property.latitude])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [properties, plan]);

  return (
    <div className="relative w-full">
      {/* MAP */}
      <div
        ref={mapContainerRef}
        className="h-[650px] rounded-xl pointer-events-auto"
      />

      {/* PREMIUM DETAIL CARD */}
      {selectedProperty && (
        <PropertyCard
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* BASIC BLOCKED MODAL */}
      {blockedProperty && (
        <LockedOverlay
            message="Please subscribe to unlock search"
            onClose={() => setBlockedProperty(null)}
            onSubscribe={() => setOpen(true)}
          />
      )}
      <SubscriptionModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default MapboxMap;
