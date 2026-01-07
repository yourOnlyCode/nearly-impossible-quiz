/**
 * Date utility functions for consistent date handling
 * All dates are normalized to UTC to avoid timezone issues
 */

/**
 * Normalize a date to the start of the day (00:00:00.000) in UTC
 * This ensures we're comparing calendar dates, not timestamps
 */
export function normalizeDateToDayStart(date: Date): Date {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0,
    0
  ))
}

/**
 * Check if two dates are on the same calendar day (year, month, day)
 */
export function isSameCalendarDay(date1: Date, date2: Date): boolean {
  const year1 = date1.getUTCFullYear()
  const month1 = date1.getUTCMonth()
  const day1 = date1.getUTCDate()
  
  const year2 = date2.getUTCFullYear()
  const month2 = date2.getUTCMonth()
  const day2 = date2.getUTCDate()
  
  return year1 === year2 && month1 === month2 && day1 === day2
}

/**
 * Check if a date is before today (in the past)
 */
export function isPastDate(date: Date): boolean {
  const today = getTodayUTC()
  return date < today
}

/**
 * Check if a date is after today (in the future)
 */
export function isFutureDate(date: Date): boolean {
  const today = getTodayUTC()
  return date > today
}

/**
 * Get today's date normalized to start of day in UTC
 * This uses the server's date/time, not the client's
 */
export function getTodayUTC(): Date {
  const now = new Date()
  return normalizeDateToDayStart(now)
}

/**
 * Format date as YYYY-MM-DD string
 */
export function formatDateString(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse YYYY-MM-DD string to Date at start of day in UTC
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
}

/**
 * Normalize a date to the start of the day in the client's local timezone
 * This extracts year, month, day from local time and creates a UTC date at start of that day
 */
export function normalizeDateToLocalDayStart(date: Date): Date {
  // Get the local year, month, day
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  
  // Create a UTC date at the start of that calendar day
  // This represents "January 7th" in the client's timezone, stored as UTC
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
}

/**
 * Get a date's calendar day components (year, month, day) in local timezone
 */
export function getLocalCalendarDay(date: Date): { year: number; month: number; day: number } {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  }
}

/**
 * Check if two dates are on the same calendar day using local timezone
 */
export function isSameLocalCalendarDay(date1: Date, date2: Date): boolean {
  const day1 = getLocalCalendarDay(date1)
  const day2 = getLocalCalendarDay(date2)
  
  return day1.year === day2.year && day1.month === day2.month && day1.day === day2.day
}

/**
 * Parse a YYYY-MM-DD string representing a client's local date
 * This creates a UTC date at the start of that calendar day
 */
export function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  // Create UTC date representing this calendar day
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
}
