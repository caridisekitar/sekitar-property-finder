interface Props {
  active: string;
  onChange: (val: string) => void;
}

const tabs = [
  { id: "fasilitas", label: "Fasilitas" },
  { id: "lokasi", label: "Lokasi" },
  { id: "insight", label: "Local’s Insight" },
];

export default function Tabs({ active, onChange }: Props) {
  return (
    <div className="mt-8 border-b flex gap-6 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`pb-3 text-sm whitespace-nowrap ${
            active === tab.id
              ? "border-b-2 border-sky-500 text-sky-600 font-medium"
              : "text-gray-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
