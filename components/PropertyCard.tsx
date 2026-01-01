import { useNavigate } from 'react-router-dom';

type Property = {
  title: string;
  location: string;
  price: number;
  lng: number;
  lat: number;
  image: string;
  type: string;
};

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const navigate = useNavigate();
  return (
    <div className="absolute
    top-4 lg:top-auto lg:bottom-4
    left-1/2 -translate-x-1/2
    w-[90%] max-w-md
    bg-white rounded-xl shadow-xl
    overflow-visible
    z-50">
      {/* IMAGE */}
      <div className="relative h-56">
        <img
          src={property.image}
          alt={property.title}
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
            {property.title}
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
            {property.location}
          </div>

          {/* PRICE */}
          <div className="mt-4 bg-sky-50 rounded-xl py-2 text-center text-xl font-bold text-gray-900">
            Rp{property.price.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="px-4 pb-4">
        <button
        onClick={() => navigate(`/kost/${property.id}`)}
        className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-medium"
        >
        Lihat detail
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
