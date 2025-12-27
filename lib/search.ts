// src/services/search.ts
import { secureGet } from "@/lib/secureGet";

export async function searchKost(query: string) {
  if (!query.trim()) return [];

  return secureGet("/search", {
    q: query,
  });
}
