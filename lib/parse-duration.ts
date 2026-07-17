/** Parses free-text durations like "1h 45m", "1.5h", "90m", "45" into whole minutes. */
export function parseDurationToMinutes(input: string): number {
  const text = input.trim().toLowerCase();
  if (!text) return 0;

  const hoursMatch = text.match(/(\d+(?:\.\d+)?)\s*h/);
  const minutesMatch = text.match(/(\d+(?:\.\d+)?)\s*m/);

  if (hoursMatch || minutesMatch) {
    const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseFloat(minutesMatch[1]) : 0;
    return Math.max(0, Math.round(hours * 60 + minutes));
  }

  const plainNumber = parseFloat(text);
  return Number.isFinite(plainNumber) ? Math.max(0, Math.round(plainNumber)) : 0;
}

/** Formats whole minutes back into "1h 45m" / "1h" / "45m" / "0m". */
export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours && remainder) return `${hours}h ${remainder}m`;
  if (hours) return `${hours}h`;
  return `${remainder}m`;
}
