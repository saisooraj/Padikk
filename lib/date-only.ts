/**
 * Truncates a Date to its calendar day, represented as UTC midnight.
 * Postgres `@db.Date` columns store no timezone — writing a local-midnight
 * Date (e.g. from date-fns `startOfDay`) serializes to UTC and can land on
 * the previous calendar day for any positive UTC-offset timezone (IST
 * included). Building the instant from local Y/M/D at UTC midnight instead
 * keeps the calendar day stable across the write/read round trip.
 */
export function dateOnly(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}
