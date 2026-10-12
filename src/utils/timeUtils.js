/**
 * Utilities for checking and blocking past showtimes based on local date and time.
 */

export function getLocalTodayStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Checks whether a given showtime string (e.g. "11:00 AM", "02:45 PM")
 * has already passed for the given dateStr (YYYY-MM-DD).
 *
 * - If dateStr is in the future: returns false (available).
 * - If dateStr is in the past: returns true (blocked).
 * - If dateStr is today: compares against the current local clock.
 */
export function isShowtimePast(timeStr, dateStr) {
  if (!timeStr) return false;

  const todayStr = getLocalTodayStr();
  const targetDate = dateStr || todayStr;

  // If selecting a future date, showtimes have not passed yet
  if (targetDate > todayStr) return false;
  // If selecting an older date, all showtimes are past
  if (targetDate < todayStr) return true;

  // For Today: compare hour and minute with current local time
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3] ? match[3].toUpperCase() : null;

  if (meridian === "PM" && hours < 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  const now = new Date();
  const showDateTime = new Date();
  showDateTime.setHours(hours, minutes, 0, 0);

  return now.getTime() >= showDateTime.getTime();
}

/**
 * Finds the first available (non-past) showtime for a given date.
 */
export function getFirstAvailableShowtime(showtimes = [], dateStr) {
  if (!showtimes || showtimes.length === 0) return null;
  const available = showtimes.find((st) => !isShowtimePast(st.time, dateStr));
  return available || null;
}
