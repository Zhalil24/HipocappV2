export const formatDateTR = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
};


export function formatTime(input: unknown) {
  if (input == null) {
    console.warn("formatDateTime: boş input geldi", input);
    return "--:--";
  }

  let dt: Date | null = null;

  if (input instanceof Date) {
    dt = input;
  } else if (typeof input === "number") {
    dt = new Date(input);
  } else if (typeof input === "string") {
    let parsed = Date.parse(input);
    if (Number.isNaN(parsed) && /^\d+$/.test(input)) {
      const n = Number(input);
      if (Number.isFinite(n)) parsed = n; 
    }
    if (!Number.isNaN(parsed)) dt = new Date(parsed);
  }

  if (!dt || Number.isNaN(dt.getTime())) {
    console.warn("formatDateTime: geçersiz tarih", input);
    return "--:--";
  }

  // TR yereli: 17.08.2025 23:47
  return dt.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
