const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const EARLIEST_DOB = "1900-01-01";

type DateParts = { year: number; month: number; day: number };

function parseIsoDate(value: string): DateParts | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** Calendar date in India, as YYYY-MM-DD. */
export function todayInIndia(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Latest birth date that is already 18 on `todayIso`. */
export function latestAdultDob(todayIso: string): string {
  const today = parseIsoDate(todayIso);
  if (!today) return "";
  const year = today.year - 18;
  const candidate = `${year}-${pad(today.month)}-${pad(today.day)}`;
  if (parseIsoDate(candidate)) return candidate;
  return `${year}-02-28`;
}

export function dateOfBirthError(
  value: string,
  todayIso = todayInIndia(),
): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!parseIsoDate(trimmed) || trimmed < EARLIEST_DOB) {
    return "Enter a valid date of birth.";
  }
  const max = latestAdultDob(todayIso);
  if (max && trimmed > max) return "You must be 18 or older.";
  return "";
}

export function formatDateOfBirth(value: string): string {
  const parts = parseIsoDate(value);
  if (!parts) return value;
  return `${pad(parts.day)}/${pad(parts.month)}/${parts.year}`;
}

export const DATE_OF_BIRTH_MIN = EARLIEST_DOB;
