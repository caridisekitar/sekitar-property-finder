"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

type Plan = "BASIC" | "PREMIUM" | "PREMIUM_PLUS"

type Location = {
  id: string
  name: string
  color: string
  icon: string
  image: string
}

const locations: Location[] = [
  { id: "jakarta", name: "Jakarta", color: "bg-sky-400", icon: "🏙️", image: "/images/jakarta.webp" },
  { id: "bali", name: "Bali", color: "bg-yellow-400", icon: "🏢", image: "/images/bali.jpg" },
  { id: "jogja", name: "Jogja", color: "bg-green-500", icon: "🏘️", image: "/images/jogja.jpg" },
  { id: "malang", name: "Malang", color: "bg-red-400", icon: "🌴", image: "/images/malang.jpg" },
  { id: "depok", name: "Depok", color: "bg-purple-400", icon: "🌉", image: "/images/depok.jpg" },
  { id: "bogor", name: "Bogor", color: "bg-pink-300", icon: "🏖️", image: "/images/bogor.jpg" },
]

const PLAN_LIMIT: Record<Plan, number> = {
  BASIC: 0,
  PREMIUM: 1,
  PREMIUM_PLUS: 3,
}

export default function LocationSelectModal({
  isOpen,
  plan,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  plan: Plan
  onClose: () => void
  onSubmit: (locations: Location[]) => void
}) {
  const [selected, setSelected] = useState<Location[]>([])
  const navigate = useNavigate()

  // ❌ BASIC → no modal
  if (!isOpen || plan === "BASIC") return null

  const limit = PLAN_LIMIT[plan]

  const toggleLocation = (location: Location) => {
  const exists = selected.find((c) => c.id === location.id)

  // ✅ If already selected → remove (always allowed)
  if (exists) {
    setSelected((prev) => prev.filter((c) => c.id !== location.id))
    return
  }

  // ❌ If limit reached → block
  if (selected.length >= limit) return

  // ✅ Add new selection
  setSelected((prev) => [...prev, location])
}

  const isSelected = (id: string) =>
    selected.some((c) => c.id === id)

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="w-full h-full bg-white flex flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-10">
          <p className="text-sm tracking-widest text-gray-400 mb-2">
            STEP 2
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Select Location
          </h2>

          <p className="text-gray-500 mb-4">
            Choose your preferred locations to personalize your experience.
          </p>

          <p className="text-sm mb-6 font-medium text-gray-600">
            {plan === "PREMIUM" && "You can select 1 location"}
            {plan === "PREMIUM_PLUS" && "You can select up to 3 locations"}
          </p>

          {/* COUNTER */}
          <div className="mb-6 text-sm font-semibold">
            {selected.length} / {limit} selected
          </div>

          <button
            disabled={selected.length !== limit}
            onClick={() => onSubmit(selected)}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              selected.length === limit
                ? "bg-black text-white hover:opacity-80"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            CONTINUE
          </button>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-gray-400 underline text-center"
            >
            Cancel
            </button>
        </div>

        {/* RIGHT GRID */}
        <div className="w-full md:w-1/2 grid grid-cols-2 md:grid-cols-3">
          {locations.map((location) => {
            const active = isSelected(location.id)
            const disabled =
              !active && selected.length >= limit

            return (
              <div
                key={location.id}
                onClick={() => !disabled && toggleLocation(location)}
                className={`
                    group relative overflow-hidden
                    flex items-center justify-center
                    p-6 text-white
                    transition-all duration-300

                    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    ${active ? "scale-95 ring-4 ring-white/80" : ""}
                `}
                >
                {/* ✅ IMAGE LAYER (THIS WILL ZOOM) */}
                <div
                    style={{
                    backgroundImage: `url(${location.image})`,
                    }}
                    className={`
                    absolute inset-0
                    bg-cover bg-center
                    transition-transform duration-500 ease-out

                    group-hover:scale-110
                    `}
                />

                {/* ✅ OVERLAY */}
                <div
                    className={`
                    absolute inset-0 transition-all duration-300
                    ${active ? "bg-black/60" : "bg-black/50 group-hover:bg-black/0"}
                    `}
                />

                {/* ✅ CONTENT */}
                <div className="relative z-10 text-center">
                    <p className="text-sm md:text-lg lg:text-xl font-semibold uppercase tracking-wide drop-shadow-md">
                    {location.name}
                    </p>
                </div>

                {/* ✅ SELECTED */}
                {active && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 mt-16">
                    <span className="bg-white text-black text-xs px-3 py-1 rounded-full font-bold shadow">
                        Selected
                    </span>
                    </div>
                )}
                </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}