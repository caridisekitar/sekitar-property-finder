export function formatHargaRange(range) {
  if (!range) return ""

  const format = (value) => {
    const jt = value / 1_000_000
    return Number.isInteger(jt)
      ? `${jt}jt`
      : `${jt.toFixed(1).replace(".", ",")}jt`
  }

  // RANGE VALUE (e.g. "2500000-3000000")
  if (range.includes("-")) {
    const [min, max] = range.split("-").map(Number)
    return `${format(min)} - ${format(max)}`
  }

  // SINGLE VALUE (e.g. "2000000")
  return format(Number(range))
}


export function formatDeposit(value) {
  if (!value) return "-"

  const raw = value.toString().toLowerCase().trim()

  // ❌ NO DEPOSIT
  if (
    raw === "0" ||
    raw.includes("tanpa deposit") ||
    raw.includes("tidak ada")
  ) {
    return "Tanpa deposit"
  }

  // ✅ FULL PAYMENT
  if (
    raw.includes("full") ||
    raw.includes("setara harga")
  ) {
    return "Full payment"
  }

  // 🔢 PERCENTAGE (e.g. 30%-50%)
  if (raw.includes("%")) {
    return raw.replace(/\s+/g, "")
  }

  // 🔢 NUMBER RANGE (500000-1000000 or 500.000-1.000.000)
  if (raw.includes("-")) {
    const parts = raw.split("-").map(cleanNumber)
    if (parts.every(Boolean)) {
      return `${formatJt(parts[0])} - ${formatJt(parts[1])}`
    }
  }

  // 🔢 SINGLE NUMBER
  const number = cleanNumber(raw)
  if (number) {
    return formatJt(number)
  }

  // 🧠 FALLBACK (show original text nicely)
  return capitalize(value)
}

/* ---------------- HELPERS ---------------- */

function cleanNumber(str) {
  const num = str.replace(/[^\d]/g, "")
  return num ? Number(num) : null
}

function formatJt(value) {
  const jt = value / 1_000_000
  return Number.isInteger(jt)
    ? `${jt}jt`
    : `${jt.toFixed(1).replace(".", ",")}jt`
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
