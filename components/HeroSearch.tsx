import { useEffect, useRef, useState } from "react"
import { SearchIcon } from "lucide-react"
import { secureGet } from "@/lib/secureGet"
import { ArrowRight } from "lucide-react"

type Kost = {
  id: string
  name: string
  address?: string
}

export default function HeroSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Kost[]>([])
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  // 🔁 Debounced Search
  useEffect(() => {
  // 🔥 RESET IMMEDIATELY WHEN EMPTY
    if (!query) {
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        }
        setResults([])
        setOpen(false)
        return
    }

    // 🔁 Clear previous debounce
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
    }

    const currentQuery = query // 🔐 capture latest query

    timeoutRef.current = window.setTimeout(async () => {
        try {
        const res = await secureGet(
            `/search?q=${encodeURIComponent(currentQuery)}`
        )

        // ❌ Ignore stale response
        if (currentQuery !== query) return

        const items = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
            ? res.data
            : []

        const topFive = items.slice(0, 5)

        setResults(topFive)
        setOpen(true)
        } catch (err) {
        if (currentQuery !== query) return
        setResults([])
        setOpen(true)
        }
    }, 300)

    // 🧹 Cleanup on unmount / next run
    return () => {
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        }
    }
    }, [query])


  return (
    <div className="relative w-full max-w-lg">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
        placeholder="Tulis nama kost atau area..."
        className="w-full pl-12 pr-28 py-4 rounded-full shadow-lg text-gray-800 focus:ring-2 focus:ring-brand-blue outline-none"
      />

      <button
        onClick={() => window.location.href = `/search?q=${query}`}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold"
      >
        Cari
      </button>

      {/* 🔽 SUGGESTION RESULT */}
       {open && (
            <div className="absolute mt-3 w-full bg-white rounded-2xl shadow-xl overflow-hidden z-50">

                {/* ✅ HAS RESULT */}
                {results.length > 0 ? (
                <>
                    {results.map((kost) => (
                    <button
                        key={kost.id}
                        onClick={() => window.location.href = `/kost/${kost.slug}`}
                        className="w-full px-4 py-3 text-sm text-gray-800 hover:bg-brand-blue/10"
                    >
                        <div className="flex items-center justify-between gap-4">
                        {/* LEFT CONTENT */}
                        <div className="text-left">
                            <div className="font-medium">{kost.name}</div>
                            {kost.city && (
                            <div className="text-xs text-gray-400">{kost.city}</div>
                            )}
                        </div>

                        {/* RIGHT ARROW */}
                        <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                    </button>
                    ))}

                    <div className="px-4 py-2 text-xs text-gray-400 font-semibold">
                    Total {results.length} Hasil Pencarian
                    </div>
                </>
                ) : (
                /* ❌ NO RESULT */
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                    Tidak ada hasil untuk pencarian
                    <span className="font-semibold text-gray-800 me-2"> “{query}”</span>
                    Coba kata kunci lain.
                </div>
                )}
            </div>
            )}

    </div>
  )
}
