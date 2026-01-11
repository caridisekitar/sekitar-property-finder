import type { Kost } from "@/types";

export const dummyKosts: Kost[] = Array.from({ length: 8 }, (_, i) => ({
  id: `dummy-${i + 1}` as any, // avoid collision with real IDs
  name: "Kost Nyaman & Strategis",
  type: "Kost Campur",
  city: "Jakarta",
  price_monthly: null, // hide real price
  img_cover: `https://picsum.photos/seed/${(i % 8) + 1}/400/300`,
  isNew: false,
}));
