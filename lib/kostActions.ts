import { securePost } from "@/lib/securePost";

export const toggleLike = (kostId: number) =>
  securePost(`/kost/${kostId}/like`);

export const toggleBookmark = (kostId: number) =>
  securePost(`/kost/${kostId}/bookmark`);
