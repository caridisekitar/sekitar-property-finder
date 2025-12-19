/**
 * Convert MySQL datetime → formatted date
 * Example: "2026-12-17 21:18:13" → "17 December 2026"
 */

export const formatDate = (
  dateString: string,
  locale: string = "en-GB"
): string => {
  if (!dateString) return "-";

  // Fix MySQL datetime for JS Date
  const isoDate = dateString.replace(" ", "T");

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
};


export const formatDateID = (dateString: string): string => {
  if (!dateString) return "-";

  const isoDate = dateString.replace(" ", "T");

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
};


export const formatDateTime = (
  dateString: string,
  locale: string = "en-GB"
): string => {
  if (!dateString) return "-";

  const isoDate = dateString.replace(" ", "T");

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
};
