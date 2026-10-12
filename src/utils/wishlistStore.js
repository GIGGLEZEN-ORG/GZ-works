import { useState, useEffect } from "react";

const WISHLIST_STORAGE_KEY = "cineverse_wishlist";

export function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading wishlist:", err);
    return [];
  }
}

export function isItemWishlisted(id) {
  if (!id) return false;
  const list = getWishlist();
  return list.some((item) => String(item.id) === String(id));
}

export function toggleWishlistItem(item) {
  if (!item || !item.id) return [];
  try {
    const current = getWishlist();
    const index = current.findIndex((i) => String(i.id) === String(item.id));
    let updated;
    if (index >= 0) {
      // Remove from wishlist
      updated = current.filter((i) => String(i.id) !== String(item.id));
    } else {
      // Add to wishlist
      const itemToSave = {
        id: item.id,
        title: item.title || item.name || "Untitled",
        poster: item.poster || item.image || item.posterFallback || "",
        genre: item.genre || item.category || (Array.isArray(item.formats) ? item.formats.join(", ") : ""),
        format: Array.isArray(item.formats) ? item.formats[0] : (item.format || ""),
        rating: item.rating || null,
        isMovie: item.isMovie !== undefined ? item.isMovie : !item.category,
        dateAdded: new Date().toISOString()
      };
      updated = [itemToSave, ...current];
    }
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("cineverse_wishlist_updated", {
        detail: { wishlist: updated, toggledId: item.id }
      })
    );
    return updated;
  } catch (err) {
    console.error("Error updating wishlist:", err);
    return [];
  }
}

export function removeFromWishlist(id) {
  if (!id) return [];
  try {
    const current = getWishlist();
    const updated = current.filter((i) => String(i.id) !== String(id));
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("cineverse_wishlist_updated", {
        detail: { wishlist: updated, toggledId: id }
      })
    );
    return updated;
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    return [];
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => getWishlist());

  useEffect(() => {
    const handleUpdate = () => {
      setWishlist(getWishlist());
    };
    window.addEventListener("cineverse_wishlist_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cineverse_wishlist_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return wishlist;
}
