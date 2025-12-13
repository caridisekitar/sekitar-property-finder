import { Link } from "react-router-dom";
import KostCard from "@/components/KostCard";
import type { Kost } from '@/types';

const mockKostData: Kost[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: 'Kost Dahlia Indah',
    type: 'Kost Putri',
    location: 'Mampang, Jakarta Selatan',
    price: 1500000,
    imageUrl: `https://picsum.photos/seed/${i+1}/400/300`,
    link: `/kost/${i+1}/detail`,
}));

const items = [
  { id: 1, name: "Kost Dahlia Indah", price: "Rp1.500.000" },
  { id: 2, name: "Kost Dahlia Indah", price: "Rp1.500.000" },
  { id: 3, name: "Kost Dahlia Indah", price: "Rp1.500.000" },
];

export default function RekomendasiKos() {
  return (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Rekomendasi lainnya</h2>
        <Link to="/" className="text-sm text-sky-600">Lihat lainnya →</Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {mockKostData.map(kost => (
                <KostCard key={kost.id} kost={kost} />
            ))}
      </div>
    </section>
  );
}
