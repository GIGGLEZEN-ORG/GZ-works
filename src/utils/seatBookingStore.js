// Utility to manage booked seats per movie, theater, date, and showtime
// Key format: cineverse_booked_seats_{movieId}_{theaterId}_{date}_{time}

function getSeatStorageKey(movieId, theaterId, dateStr, timeStr) {
  const m = String(movieId || "default").replace(/\s+/g, "-");
  const th = String(theaterId || "default").replace(/\s+/g, "-");
  const d = String(dateStr || "today");
  const t = String(timeStr || "default").replace(/\s+/g, "-");
  return `cineverse_booked_seats_${m}_${th}_${d}_${t}`;
}

export function getBookedSeatsForShowtime(movieId, theaterId, dateStr, timeStr) {
  try {
    const key = getSeatStorageKey(movieId, theaterId, dateStr, timeStr);
    const data = localStorage.getItem(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading booked seats:", err);
    return [];
  }
}

export function saveBookedSeatsForShowtime(movieId, theaterId, dateStr, timeStr, seatIds) {
  try {
    const key = getSeatStorageKey(movieId, theaterId, dateStr, timeStr);
    const existing = getBookedSeatsForShowtime(movieId, theaterId, dateStr, timeStr);
    const updated = Array.from(new Set([...existing, ...seatIds]));
    localStorage.setItem(key, JSON.stringify(updated));
    // Dispatch custom storage event so active modals update immediately
    window.dispatchEvent(new CustomEvent("cineverse_seats_updated", {
      detail: { movieId, theaterId, dateStr, timeStr, bookedSeats: updated }
    }));
    return updated;
  } catch (err) {
    console.error("Error saving booked seats:", err);
    return [];
  }
}

export function removeBookedSeatsForShowtime(movieId, theaterId, dateStr, timeStr, seatIds) {
  try {
    const key = getSeatStorageKey(movieId, theaterId, dateStr, timeStr);
    const existing = getBookedSeatsForShowtime(movieId, theaterId, dateStr, timeStr);
    const toRemove = new Set(seatIds);
    const updated = existing.filter((id) => !toRemove.has(id));
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cineverse_seats_updated", {
      detail: { movieId, theaterId, dateStr, timeStr, bookedSeats: updated }
    }));
    return updated;
  } catch (err) {
    console.error("Error removing booked seats:", err);
    return [];
  }
}
