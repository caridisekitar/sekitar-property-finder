import { useEffect, useRef, useState } from "react"
import { SearchIcon, ArrowRight } from "lucide-react"
import { secureGet } from "@/lib/secureGet"
import { useNavigate } from "react-router-dom"

type Kost = {
  id: string
  name: string
  city?: string
  slug: string
}

export default function HeroSearch() {
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Kost[]>([])
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  /* ==============================
     🔁 Debounced Search
  ============================== */
  useEffect(() => {
    if (!query) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setResults([])
      setOpen(false)
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    const currentQuery = query

    timeoutRef.current = window.setTimeout(async () => {
      try {
        const res = await secureGet("/search", {
          q: currentQuery,
        })

        if (currentQuery !== query) return

        const items = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : []

        setResults(items.slice(0, 5))
        setOpen(true)
      } catch (err: any) {
        if (currentQuery !== query) return
        // Don't show dropdown on auth errors — backend may gate /search for guests
        if (err?.status === 401 || err?.status === 403) {
          setOpen(false)
          return
        }
        setResults([])
        setOpen(true)
      }
    }, 300)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [query])

  /* ==============================
     🔍 HANDLE SEARCH
  ============================== */
  const handleSearch = () => {
    if (!query.trim()) return
    navigate(`/cari-kost?q=${encodeURIComponent(query.trim())}`)
    setOpen(false)
  }

  /* ==============================
     ⌨️ ENTER SUPPORT
  ============================== */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="relative w-full max-w-lg">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKeyDown} // ✅ ENTER SUPPORT
        placeholder="Tulis nama kost atau area..."
        className="w-full pl-12 pr-28 py-4 rounded-full shadow-lg text-gray-800 focus:ring-2 focus:ring-brand-blue outline-none"
      />

      {/* 🔘 BUTTON */}
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold"
      >
        Cari
      </button>

      {/* 🔽 SUGGESTION */}
      {open && (
        <div className="absolute mt-3 w-full bg-white rounded-2xl shadow-xl overflow-hidden z-50">

          {results.length > 0 ? (
            <>
              {results.map((kost) => (
                <button
                  key={kost.id}
                  onClick={() => navigate(`/kost/${kost.slug}`)} // ✅ router-safe
                  className="w-full px-4 py-3 text-sm text-gray-800 hover:bg-brand-blue/10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left">
                      <div className="font-medium">{kost.name}</div>
                      {kost.city && (
                        <div className="text-xs text-gray-400">{kost.city}</div>
                      )}
                    </div>

                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              ))}

              <div className="px-4 py-2 text-xs text-gray-400 font-semibold">
                Total {results.length} Hasil Pencarian
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">
              Tidak ada hasil untuk
              <span className="font-semibold text-gray-800"> “{query}”</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}