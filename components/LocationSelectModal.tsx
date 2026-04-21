import { useState } from "react"
import { useNavigate } from "react-router-dom"

type Plan = "BASIC" | "PREMIUM" | "PREMIUM_PLUS"

type Location = {
  id: string
  name: string
  slug: string
  color: string
  icon: string
  image: string
}

const locations: Location[] = [
  { id: "1", name: "Jakarta", slug: "jakarta", color: "bg-sky-400", icon: "🏙️", image: "/images/jakarta.jpg" },
  { id: "5", name: "Bali", slug: "bali", color: "bg-yellow-400", icon: "🏢", image: "/images/bali.jpg" },
  { id: "7", name: "Jogja", slug: "jogja", color: "bg-green-500", icon: "🏘️", image: "/images/jogja.jpg" },
  { id: "4", name: "Depok", slug: "depok", color: "bg-purple-400", icon: "🌉", image: "/images/depok.jpg" },
  { id: "3", name: "Bandung", slug: "bandung", color: "bg-pink-300", icon: "🏖️", image: "/images/bogor.jpg" },
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
  lockedSlugs = [],
}: {
  isOpen: boolean
  plan: Plan
  onClose: () => void
  onSubmit: (locations: Location[]) => void
  lockedSlugs?: string[]
}) {
  const navigate = useNavigate()

  // Only track NEW picks — locked ones come from props, never from state
  const [newPicks, setNewPicks] = useState<Location[]>([])
  const [limitHit, setLimitHit] = useState(false)

  if (!isOpen || plan === "BASIC") return null

  const newPickLimit = PLAN_LIMIT[plan]
  const lockedLocations = locations.filter((l: Location) => lockedSlugs.includes(l.slug))

  const isLocked = (slug: string) => lockedSlugs.includes(slug)
  const isNewPick = (id: string) => newPicks.some((l) => l.id === id)
  const isActive = (location: Location) => isLocked(location.slug) || isNewPick(location.id)

  const toggleLocation = (location: Location) => {
    if (isLocked(location.slug)) return

    if (isNewPick(location.id)) {
      // deselect
      setNewPicks((prev) => prev.filter((l: Location) => l.id !== location.id))
      setLimitHit(false)
      return
    }

    if (newPicks.length >= newPickLimit) {
      setLimitHit(true)
      return
    }

    setLimitHit(false)
    setNewPicks((prev) => [...prev, location])
  }

  const canContinue = newPicks.length === newPickLimit
  const isUpgrade = lockedSlugs.length > 0

  return (
    <div className="fixed inset-0 z-[60] bg-black/60">
      <div className="w-full h-full bg-white flex flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-10">
          <p className="text-sm tracking-widest text-gray-400 mb-2">STEP 1</p>

          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Select Location
          </h2>

          <p className="text-gray-500 mb-4">
            Choose your preferred locations to personalize your experience.
          </p>

          <p className="text-sm mb-6 font-medium text-gray-600">
            {plan === "PREMIUM" && "You can select 1 location"}
            {plan === "PREMIUM_PLUS" && (
              isUpgrade
                ? `Pilih ${newPickLimit} lokasi tambahan (lokasi saat ini tetap aktif)`
                : `You can select up to ${newPickLimit} locations`
            )}
          </p>

          {/* COUNTER — shows new picks only */}
          <div className="mb-2 text-sm font-semibold">
            {newPicks.length} / {newPickLimit} selected
          </div>

          {limitHit && (
            <p className="mb-4 text-xs text-orange-600 font-medium">
              {plan === "PREMIUM"
                ? "Upgrade to Premium+ for more locations"
                : "Maximum locations reached"}
            </p>
          )}

          <button
            disabled={!canContinue}
            onClick={() => {
              setNewPicks([])
              setLimitHit(false)
              onSubmit([...lockedLocations, ...newPicks])
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              canContinue
                ? "bg-black text-white hover:opacity-80"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            CONTINUE
          </button>

          <button
            onClick={() => {
              setNewPicks([])
              setLimitHit(false)
              navigate(-1)
            }}
            className="mt-4 text-sm text-gray-400 underline text-center"
          >
            Cancel
          </button>
        </div>

        {/* RIGHT GRID */}
        <div className="w-full md:w-1/2 grid grid-cols-2 md:grid-cols-3">
          {locations.map((location) => {
            const locked   = isLocked(location.slug)
            const active   = isActive(location)
            const disabled = !locked && !isNewPick(location.id) && newPicks.length >= newPickLimit

            return (
              <div
                key={location.id}
                onClick={() => !disabled && toggleLocation(location)}
                className={`
                  group relative overflow-hidden
                  flex items-center justify-center
                  p-6 text-white
                  transition-all duration-300
                  ${locked   ? "cursor-default" : disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  ${active   ? "scale-95 ring-4 ring-white/80" : ""}
                `}
              >
                {/* IMAGE */}
                <div
                  style={{ backgroundImage: `url(${location.image})` }}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div className={`absolute inset-0 transition-all duration-300 ${active ? "bg-black/60" : "bg-black/50 group-hover:bg-black/0"}`} />

                {/* NAME */}
                <div className="relative z-10 text-center">
                  <p className="text-sm md:text-lg lg:text-xl font-semibold uppercase tracking-wide drop-shadow-md">
                    {location.name}
                  </p>
                </div>

                {/* LOCKED BADGE */}
                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 mt-16">
                    <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-bold shadow">
                      Aktif
                    </span>
                  </div>
                )}

                {/* NEW PICK BADGE */}
                {!locked && active && (
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
