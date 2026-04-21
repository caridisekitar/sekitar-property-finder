// "use client"

import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Mail, Phone, Lock } from "lucide-react"
import { securePost } from "@/lib/securePost"
import { getDeviceId } from "@/lib/device"
import LocationSelectModal from "@/components/LocationSelectModal"

type Plan = "BASIC" | "PREMIUM" | "PREMIUM_PLUS"

// Added slug — required by backend, used for location guard and subscription_locations
type Location = {
  id: string
  slug: string
  name: string
  image: string
}

export default function Register() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState<Plan>("BASIC")
  const [planId, setPlanId] = useState<number | null>(null)
  const [locations, setLocations] = useState<Location[]>([])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const BLOCK_REGEX = /@(email\.com|gmail\.cpm|gmail\.con|gmail\.comm|yopmail\.com)$/i

  /* ===============================
     INIT PLAN + MODAL FLOW
  =============================== */
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/", { replace: true })
      return
    }

    const action = JSON.parse(localStorage.getItem("postLoginAction") || "null")
    const detectedPlan: Plan = action?.payload?.plan || "BASIC"
    const detectedPlanId: number | null = action?.payload?.plan_id || null

    setPlan(detectedPlan)
    setPlanId(detectedPlanId)

    if (detectedPlan !== "BASIC") {
      setOpen(true)
    }
  }, [navigate])

  /* ===============================
     SUBMIT REGISTER
  =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !phone || !password) {
      setError("Semua field wajib diisi")
      return
    }

    if (BLOCK_REGEX.test(email)) {
      setError("Email kamu tidak valid")
      return
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter")
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const deviceId = getDeviceId()

      const res = await securePost(
        "/auth/register",
        "POST",
        {
          name,
          email,
          phone,
          password,
          // null for BASIC — backend treats missing plan_id as BASIC
          plan_id: planId ?? undefined,
          // backend expects slugs only — modal uses `id` as slug
          locations: locations.map((l) => l.slug),
        },
        { "X-Device-Id": deviceId }
      )

      if (!res.success) {
        setError(res.message || "Registrasi gagal")
        return
      }

      // Save auth context
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      localStorage.removeItem("postLoginAction")

      /* ===============================
         ROUTING AFTER REGISTER
         Backend tells us what to do next via next_step.
         "payment" → call Duitku immediately with payment_context
         "home"    → BASIC, subscription already active
      =============================== */
      if (res.data.next_step === "payment" && res.data.payment_context) {
        const ctx = res.data.payment_context

        const paymentRes = await securePost(
          "/duitku/create",
          "POST",
          {
            plan_id:      ctx.plan_id,
            amount:       ctx.amount,
            product_name: ctx.product_name,
            email:        email,
            locations:    ctx.locations, // already slugs, echoed back from register
          },
          { "X-Device-Id": deviceId }
        )

        if (!paymentRes.success || !paymentRes.paymentUrl) {
          setError("Gagal membuat invoice pembayaran. Silakan coba lagi.")
          return
        }

        // Hard redirect — leaves the app, goes to Duitku payment page
        window.location.href = paymentRes.paymentUrl
        return
      }

      // BASIC or fallback
      navigate("/", { replace: true })

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">

      {/* LOCATION MODAL */}
      <LocationSelectModal
        isOpen={open}
        plan={plan}
        onClose={() => setOpen(false)}
        onSubmit={(selectedLocations: Location[]) => {
          setLocations(selectedLocations)
          setOpen(false)
        }}
      />

      {/* MOBILE IMAGE */}
      <div
        className="md:hidden lg:hidden block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-login.webp')" }}
      />

      {/* FORM */}
      <div className="flex items-center justify-center py-2 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-6 p-4 lg:p-8">

          <div>
            <div className="flex cursor-pointer" onClick={() => navigate("/")}>
              <img
                alt="Logo"
                src="/images/logo-header-sekitar.png"
                className="h-[44px] lg:h-[54px]"
              />
            </div>

            <h2 className="mt-6 text-[20px] lg:text-[32px] font-semibold text-gray-900">
              Daftar ke Sekitar
            </h2>

            <p className="mt-2 text-xs text-gray-600">
              Cuma butuh 3 detik untuk daftar, dan kamu bisa langsung akses ratusan kost!
            </p>
          </div>

          {/* Block form until location is picked (non-BASIC plans) */}
          {(plan === "BASIC" || locations.length > 0) ? (
            <form className="space-y-5" onSubmit={handleSubmit}>

              <Input label="Nama Lengkap" icon={<User size={18} />} value={name} onChange={setName} placeholder="Masukkan nama lengkap kamu" />
              <Input label="Email" icon={<Mail size={18} />} value={email} onChange={setEmail} placeholder="Masukkan email kamu" type="email" />
              <Input label="Nomor Telepon" icon={<Phone size={18} />} value={phone} onChange={setPhone} placeholder="08xxxxxxxxx" type="tel" />
              <Input label="Password" icon={<Lock size={18} />} value={password} onChange={setPassword} placeholder="Minimal 8 karakter" type="password" />

              {/* Show selected locations as confirmation for paid plans */}
              {locations.length > 0 && (
                <div className="text-xs text-gray-500">
                  Lokasi dipilih:{" "}
                  <span className="font-medium text-gray-700">
                    {locations.map((l) => l.name).join(", ")}
                  </span>
                  {" · "}
                  <button
                    type="button"
                    className="text-blue-500 underline"
                    onClick={() => setOpen(true)}
                  >
                    Ubah
                  </button>
                </div>
              )}

              {error && <div className="text-sm text-red-500">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white text-sm font-medium ${
                  loading ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {loading ? "Mendaftar..." : "Daftar"}
              </button>

            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Pilih lokasi terlebih dahulu untuk melanjutkan pendaftaran.
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full py-3 rounded-lg border border-gray-900 text-gray-900 text-sm font-medium hover:bg-gray-50"
              >
                Pilih Lokasi
              </button>
            </div>
          )}

          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Masuk
            </Link>
          </p>

        </div>
      </div>

      {/* DESKTOP IMAGE */}
      <div
        className="hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-login.webp')" }}
      />
    </div>
  )
}

/* ===============================
   INPUT COMPONENT
=============================== */
function Input({ label, icon, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
        <span className="text-gray-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full outline-none text-sm"
          required
        />
      </div>
    </div>
  )
}
