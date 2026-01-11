import { useNavigate } from 'react-router-dom';
import { formatHargaRange } from '@/lib/helper';

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

const PropertyCard: React.FC<{ property: Property }> = ({ property, onClose }) => {
    const navigate = useNavigate();
    const videoPosterUrl = property.images?.find(img => img.is_video_poster)?.image_url ?? property.img_cover;

  return (
    <div className="absolute
    top-4 lg:top-auto lg:bottom-4
    left-1/2 -translate-x-1/2
    w-[90%] max-w-md
    bg-white rounded-xl shadow-xl
    overflow-visible
    z-50">
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-50
                  bg-white/90 hover:bg-white
                  rounded-full p-2 shadow"
      >
        ✕
      </button>
      {/* IMAGE */}
      <div className="relative h-56">
        
        <img
          src={videoPosterUrl}
          alt={property.name}
          className="h-full w-full object-cover rounded-t-xl"
        />
        

        {/* TYPE BADGE */}
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center gap-2 shadow">
          <span className="text-sm">🛏️</span>
          {/* <span className="text-sm font-medium">{property.type}</span> */}
        </div>
      </div>

      {/* INFO CARD */}
      <div className="relative -mt-14 px-4">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">
            {property.name}
          </h3>

          {/* LOCATION */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
              <circle cx="12" cy="11" r="2" />
            </svg>
            {property.city}
          </div>

          {/* PRICE */}
          <div className="mt-4 bg-sky-50 rounded-xl py-2 text-center text-xl font-bold text-gray-900">
            Rp {formatHargaRange(property.price_monthly)}
          </div>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="px-4 pb-4">
        <button
        onClick={() => navigate(`/kost/${property.slug}`)}
        className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-medium"
        >
        Lihat detail
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
