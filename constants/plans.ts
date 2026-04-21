// /src/constants/plans.ts

export type PlanType = "PREMIUM" | "PREMIUM_PLUS";

export const PLAN_CONFIG: Record<
  PlanType,
  {
    amount: number;
    product_name: string;
  }
> = {
  PREMIUM: {
    amount: 99000,
    product_name: "Subscription Premium",
  },
  PREMIUM_PLUS: {
    amount: 199000,
    product_name: "Subscription Premium+",
  },
};