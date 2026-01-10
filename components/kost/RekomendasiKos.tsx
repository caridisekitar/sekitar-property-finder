import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import KostCard from "@/components/KostCard";
import type { Kost } from "@/types";
import { secureGet } from '@/lib/secureGet';

export default function RekomendasiKos() {
  const [kosts, setKosts] = useState<Kost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const dataRecommendation = await secureGet('/kost/recommendations');
        setKosts(dataRecommendation.data);
      
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Rekomendasi lainnya</h2>
        <Link to="/" className="text-sm text-sky-600">
          Lihat lainnya →
        </Link>
      </div>

      {/* Loading */}
      {loading && <p className="text-sm text-gray-500">Loading rekomendasi...</p>}

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Cards */}
      {!loading && !error && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {kosts.map((kost) => (
            <KostCard key={kost.id} kost={kost} />
          ))}
        </div>
      )}
    </section>
  );
}
