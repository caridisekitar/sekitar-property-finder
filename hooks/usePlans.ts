import { useEffect, useState } from "react"
import { secureGet } from "@/lib/secureGet"

export type PlanType = "BASIC" | "PREMIUM" | "PREMIUM_PLUS"

export type PlanConfig = {
  id: number
  name: PlanType
  amount: number
  product_name: string
  max_locations: number | null
}

export function usePlans() {
  const [plans, setPlans] = useState<Record<PlanType, PlanConfig> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await secureGet("/plans")

        const mapped: Record<PlanType, PlanConfig> = {
          BASIC: {} as PlanConfig,
          PREMIUM: {} as PlanConfig,
          PREMIUM_PLUS: {} as PlanConfig,
        }

        res.forEach((p: any) => {
          mapped[p.name] = {
            id: p.id,
            name: p.name,
            amount: p.price,
            product_name: p.product_name,
            max_locations: p.max_location_groups,
          }
        })

        setPlans(mapped)
      } catch (err) {
        console.error("Failed to fetch plans", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  return { plans, loading }
}