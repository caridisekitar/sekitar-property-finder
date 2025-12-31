type Props = {
  property: Property;
  onClose: () => void;
};

const PropertyCard: React.FC<Props> = ({ property, onClose }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
      <img
        src={property.image}
        alt={property.title}
        className="h-40 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{property.title}</h3>
        <p className="text-blue-600 font-bold mt-1">
          Rp {property.price.toLocaleString('id-ID')}
        </p>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
