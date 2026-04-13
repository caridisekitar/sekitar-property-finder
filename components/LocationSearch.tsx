"use client";

import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type LocationItem = {
  name: string;
  slug: string;
  image?: string;
};

type SectionProps = {
  title: string;
  locations: LocationItem[];
  onRequireSubscription?: () => void;
};

export default function LocationSearch({
  title,
  locations,
  onRequireSubscription,
}: SectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // 🔥 parse multiple locations
  const activeLokasi = searchParams.get("lokasi")
    ? searchParams.get("lokasi")!.split(",")
    : [];

  const updateParams = (newLocations: string[]) => {
    const current = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...current,
      lokasi: newLocations.join(","), // 🔥 join array
      page: "1",
    });
  };

  const handleToggle = (loc: LocationItem) => {
    // Guest (no user) cannot browse other listings
    if (!user) {
      onRequireSubscription?.();
      return;
    }

    let updated = [...activeLokasi];

    if (updated.includes(loc.name)) {
      updated = updated.filter((l) => l !== loc.name);
    } else {
      updated.push(loc.name);
    }

    updateParams(updated);
  };

  const handleRemove = (name: string) => {
    const updated = activeLokasi.filter((l) => l !== name);
    updateParams(updated);
  };

  const handleReset = () => {
    const current = Object.fromEntries(searchParams.entries());
    delete current.lokasi;

    setSearchParams({
      ...current,
      page: "1",
    });
  };

  return (
    <section className="mb-10">
      {/* Title */}
      <div className="inline-block bg-[#F3EDE4] text-[#7C6F60] text-sm font-semibold px-3 py-1 rounded-md mb-4">
        {title}
      </div>

      {/* 🔥 Active Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {activeLokasi.map((loc) => (
          <div
            key={loc}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#96C8E2] text-white text-sm"
          >
            {loc}
            <button onClick={() => handleRemove(loc)}>✕</button>
          </div>
        ))}

        {activeLokasi.length > 0 && (
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* 🔥 Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {locations.map((loc, index) => {
          const isActive = activeLokasi.includes(loc.name);

          return (
            <div
              key={index}
              onClick={() => handleToggle(loc)}
              className={`
                relative min-w-[220px] h-[120px]
                rounded-2xl overflow-hidden cursor-pointer
                flex-shrink-0 group
                border-2 transition
                ${
                  isActive
                    ? "border-[#96C8E2] ring-2 ring-[#96C8E2]/30"
                    : "border-transparent"
                }
              `}
            >
              {/* Image */}
              <img
                src={loc.image || `/images/${loc.slug}.jpg`}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Active tint overlay */}
              {isActive && (
                <div className="absolute inset-0 bg-[#96C8E2]/20" />
              )}

              {/* Text */}
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="font-semibold text-lg">{loc.name}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}