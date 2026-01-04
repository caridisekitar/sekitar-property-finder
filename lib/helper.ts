export function formatHargaRange(range: unknown): string {
  if (range === null || range === undefined) return "";

  const str = String(range).trim();
  if (!str) return "";

  const format = (value: number) => {
    const jt = value / 1_000_000;
    return Number.isInteger(jt)
      ? `${jt}jt`
      : `${jt.toFixed(1).replace(".", ",")}jt`;
  };

  if (str.includes("-")) {
    const [min, max] = str.split("-").map(v =>
      Number(v.replace(/[^\d]/g, ""))
    );

    if (!isNaN(min) && !isNaN(max)) {
      return `${format(min)} - ${format(max)}`;
    }
  }

  const num = Number(str.replace(/[^\d]/g, ""));
  return isNaN(num) ? str : format(num);
}

export function formatHargaRangeID(range: unknown): string {
  if (range === null || range === undefined) return "";

  const str = String(range).trim();
  if (!str) return "";

  const format = (value: number) =>
    value.toLocaleString("id-ID");

  // Range value (e.g. 2000000-3000000)
  if (str.includes("-")) {
    const [min, max] = str.split("-").map(v =>
      Number(v.replace(/[^\d]/g, ""))
    );

    if (!isNaN(min) && !isNaN(max)) {
      return `${format(min)}-${format(max)}`;
    }
  }

  // Single value
  const num = Number(str.replace(/[^\d]/g, ""));
  return isNaN(num) ? str : format(num);
}




export function formatDeposit(deposit: unknown): string {
  if (deposit === null || deposit === undefined) return "-";

  const str = String(deposit).toLowerCase().trim();

  // TEXT CASES
  if (
    str.includes("tanpa") ||
    str.includes("tidak ada") ||
    str === "0"
  ) {
    return "Tanpa deposit";
  }

  if (str.includes("full")) {
    return "Full payment";
  }

  // PERCENTAGE
  if (str.includes("%")) {
    return str.replace(/\s+/g, "");
  }

  // RANGE NUMBER
  if (str.includes("-")) {
    const [min, max] = str.split("-").map(v =>
      Number(v.replace(/[^\d]/g, ""))
    );

    if (!isNaN(min) && !isNaN(max)) {
      return `Rp${min} - ${max}`;
    }
  }

  // SINGLE NUMBER
  const num = Number(str.replace(/[^\d]/g, ""));
  return str; //isNaN(num) ? str : formatJt(num);
}

function formatJt(value: number) {
  const jt = value / 1_000_000;
  return Number.isInteger(jt)
    ? `Rp${jt}jt`
    : `Rp${jt.toFixed(1).replace(".", ",")}jt`;
}

export function formatIDRNumber(value: string | number): string {
  const stringValue = String(value);
  const numeric = stringValue.replace(/\D/g, '');
  if (!numeric) return '';
  return new Intl.NumberFormat('id-ID').format(Number(numeric));
}

