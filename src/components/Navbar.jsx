import React, { useState, useEffect, useRef } from "react";
import { 
  Film, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Ticket, 
  Search, 
  Palette, 
  Clapperboard, 
  Menu, 
  X, 
  LogOut, 
  UserRound,
  MapPin,
  Calendar,
  ChevronDown,
  Check,
  Bell,
  Heart,
  Gift,
  HelpCircle,
  ExternalLink,
  Home,
  Zap,
  Tag,
  Flame,
  Star
} from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { moviesData, cinemaEvents, cinemaAmbients } from "../data/moviesData";
import { sketchAvatars, sketchAvatarCategories } from "../data/sketchAvatars";
import { useWishlist, removeFromWishlist } from "../utils/wishlistStore";

const navItems = [
  { id: "movies", label: "Movies", Icon: Clapperboard, color: "text-rose-500" },
  { id: "events", label: "Events", Icon: Calendar, color: "text-amber-400" }
];

const popularCities = [
  "Mumbai",
  "Delhi-NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Chandigarh",
  "Jaipur"
];

function ProfileDropdown({
  user,
  tickets,
  onSignOut,
  onInspectTicket,
  onUpdateProfile,
  onClose
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [profileImage, setProfileImage] = useState(user.profileImage || "");
  const [selectedAvatarCategory, setSelectedAvatarCategory] = useState("All");
  const [profileError, setProfileError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const recentTickets = tickets.slice(0, 3);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError("Choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        setProfileError("");
      } else {
        setProfileError("Unable to read this image. Try another file.");
      }
    };
    reader.onerror = () => setProfileError("Unable to read this image. Try another file.");
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    const normalizedName = name.trim();
    if (normalizedName.length < 2) {
      setProfileError("Enter a name using at least 2 characters.");
      return;
    }

    setIsSaving(true);
    setProfileError("");
    try {
      onUpdateProfile({ name: normalizedName, profileImage });
      setIsEditing(false);
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-84 sm:w-96 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0b101b] shadow-2xl">
      <div className="flex border-b border-white/10 p-2" role="tablist" aria-label="Profile sections">
        {[
          { id: "profile", label: "Profile" },
          { id: "recent", label: `Recent (${tickets.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? "bg-rose-500/15 text-rose-300"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" ? (
        <div className="p-4">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Active Profile Avatar Preview */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="relative flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-rose-500/60 bg-slate-100 shadow-md shadow-rose-500/20">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-6 w-6 text-slate-700" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">Active Avatar</span>
                    {profileImage && (
                      <button
                        type="button"
                        onClick={() => {
                          cinemaAudio.playHoverTick();
                          setProfileImage("");
                        }}
                        className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {profileImage ? "Sketch profile avatar selected" : "Default user avatar"}
                  </p>
                </div>
              </div>

              {/* Display Name Input */}
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-400">Display name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-rose-500/50"
                />
              </label>

              {/* Sketch Avatars Selection Section */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Sketch Profile Avatars
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Male · Female · Kids · Another
                  </span>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {sketchAvatarCategories.map((cat) => {
                    const isActive = selectedAvatarCategory === cat;
                    const count = cat === "All" ? sketchAvatars.length : sketchAvatars.filter(a => a.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          cinemaAudio.playHoverTick();
                          setSelectedAvatarCategory(cat);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                          isActive
                            ? "bg-rose-600 text-white shadow-sm"
                            : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[9px] px-1 rounded ${isActive ? "bg-black/30 text-white" : "bg-white/5 text-slate-500"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Grid of Hand-Drawn Sketch Avatars */}
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1.5 rounded-xl bg-slate-900/40 border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
                  {sketchAvatars
                    .filter((av) => selectedAvatarCategory === "All" || av.category === selectedAvatarCategory)
                    .map((av) => {
                      const isSelected = profileImage === av.url || profileImage === av.fallbackUrl;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            cinemaAudio.playHoverTick();
                            setProfileImage(av.url);
                            setProfileError("");
                          }}
                          title={`${av.name} (${av.category} Sketch)`}
                          className={`group relative p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? "border-rose-500 bg-rose-500/20 shadow-md shadow-rose-500/30 scale-102"
                              : "border-white/10 bg-slate-900/80 hover:border-white/30 hover:bg-slate-800"
                          }`}
                        >
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-slate-100 p-0.5 border border-slate-300 shadow-sm group-hover:scale-105 transition-transform">
                            <img
                              src={av.url}
                              alt={av.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <span className="text-[9px] font-bold text-slate-300 group-hover:text-white truncate max-w-full text-center">
                            {av.name}
                          </span>
                          <span className="text-[8px] text-slate-500 uppercase -mt-1">
                            {av.category}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-sm">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Upload from device fallback */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5">
                <span>Or upload from device:</span>
                <label className="cursor-pointer font-semibold text-rose-300 hover:text-rose-200">
                  Choose file
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              </div>

              {profileError && <p role="alert" className="text-[11px] text-rose-300">{profileError}</p>}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 px-3 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/30 disabled:opacity-60 cursor-pointer transition-all"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name);
                    setProfileImage(user.profileImage || "");
                    setProfileError("");
                    setIsEditing(false);
                  }}
                  className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-800 text-rose-300">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={`${user.name}'s profile`} className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{user.name}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-4 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-left text-xs font-semibold text-slate-300 transition hover:border-rose-500/40 hover:text-white"
              >
                Edit profile
              </button>
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="mt-2 flex w-full items-center gap-2 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-left text-xs font-semibold text-slate-300 transition hover:border-rose-500/40 hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="max-h-72 space-y-2 overflow-y-auto p-3">
          {recentTickets.length === 0 ? (
            <p className="px-2 py-5 text-center text-xs text-slate-400">
              No tickets booked yet.
            </p>
          ) : (
            recentTickets.map((ticket) => (
              <button
                key={ticket.bookingId}
                type="button"
                onClick={() => {
                  onInspectTicket(ticket);
                  onClose();
                }}
                className="w-full rounded-xl border border-white/5 bg-white/3 p-3 text-left transition hover:border-rose-500/30 hover:bg-white/6"
              >
                <span className="block truncate text-xs font-bold text-white">
                  {ticket.movie.title}
                </span>
                <span className="mt-1 block truncate text-[11px] text-slate-400">
                  {ticket.date} · {ticket.seats.map((seat) => seat.id).join(", ")}
                </span>
                <span className="mt-1 block font-mono text-[10px] text-cyan-400">
                  Ref: {ticket.bookingId}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function QuickMenuModal({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  myTickets = [],
  onInspectTicket,
  onOpenMyTickets,
  notificationsCount = 2,
  rewardsPoints = 250,
  initialTab = null,
  autoCloseDelay = null
}) {
  const wishlist = useWishlist();
  const [activeModalTab, setActiveModalTab] = useState(initialTab || null);
  const [faqSearch, setFaqSearch] = useState("");
  const [ticketQuerySubmitted, setTicketQuerySubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveModalTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Auto-close drawer after delay (5s when triggered after wishlisting)
  useEffect(() => {
    if (!isOpen || !autoCloseDelay) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDelay);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-4 bg-black/80 animate-in fade-in">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      
      <div className="relative w-full max-w-sm sm:rounded-3xl border border-white/10 bg-[#0b0f19] shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[85vh] mt-0 sm:mt-16">
        
        {/* Auto-closing progress indicator bar */}
        {autoCloseDelay && (
          <div className="absolute top-0 inset-x-0 h-1 bg-white/10 overflow-hidden z-20">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400"
              style={{
                animation: `autoCloseProgress ${autoCloseDelay}ms linear forwards`
              }}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/2">
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col gap-1 w-5 h-4 justify-center">
              <span className="h-0.5 w-5 bg-rose-500 rounded-full"></span>
              <span className="h-0.5 w-3.5 bg-rose-400 rounded-full"></span>
              <span className="h-0.5 w-5 bg-rose-500 rounded-full"></span>
            </div>
            <h3 className="font-bold text-white text-base">Menu & Quick Access</h3>
            {autoCloseDelay && (
              <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full ml-1">
                Auto-closing in 5s
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Menu Options */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1">

          {/* 1. My Tickets (Recent Bookings List) */}
          <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden transition hover:border-white/15">
            <button
              onClick={() => setActiveModalTab(activeModalTab === "tickets" ? null : "tickets")}
              className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">My Tickets</h4>
                  <p className="text-[11px] text-slate-400">Recent bookings & digital passes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  myTickets.length > 0 
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                    : "bg-white/5 text-slate-500"
                }`}>
                  {myTickets.length} Booked
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeModalTab === "tickets" ? "rotate-180" : ""}`} />
              </div>
            </button>

            {activeModalTab === "tickets" && (
              <div className="px-3.5 pb-4 pt-2 border-t border-white/5">
                {myTickets.length === 0 ? (
                  <div className="py-5 text-center space-y-2.5">
                    <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-xs">No booked tickets yet</p>
                      <p className="text-slate-400 text-[11px] max-w-[220px] mx-auto leading-relaxed mt-0.5">
                        {user 
                          ? "Your reserved movie seats and live event passes will appear right here."
                          : "Sign in to view your tickets or reserve movie seats and event passes."}
                      </p>
                    </div>
                    {!user && onOpenAuth && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenAuth();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Sign In to View Tickets
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-0.5">
                    {myTickets.map((t) => (
                      <div
                        key={t.bookingId}
                        onClick={() => {
                          cinemaAudio.playHoverTick();
                          if (onInspectTicket) {
                            onInspectTicket(t);
                            onClose();
                          }
                        }}
                        className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 hover:border-cyan-500/40 hover:bg-slate-800/90 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-white text-xs truncate group-hover:text-cyan-300 transition-colors">
                              {t.movie?.title}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                              <span>{t.date}</span>
                              {t.time?.time && <span>• {t.time.time}</span>}
                              {t.theater?.name && <span>• {t.theater.name.split(":")[0]}</span>}
                            </p>
                            {t.seats && t.seats.length > 0 && (
                              <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
                                Seats: {t.seats.map(s => s.id).join(", ")}
                              </p>
                            )}
                          </div>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
                            {t.bookingId}
                          </span>
                        </div>
                      </div>
                    ))}
                    {onOpenMyTickets && (
                      <button
                        type="button"
                        onClick={() => {
                          cinemaAudio.playHoverTick();
                          onClose();
                          onOpenMyTickets();
                        }}
                        className="w-full mt-2 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition cursor-pointer"
                      >
                        View All Booked Passes ({myTickets.length}) →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 2. Notifications */}
          <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden transition hover:border-white/15">
            <button
              onClick={() => setActiveModalTab(activeModalTab === "notifications" ? null : "notifications")}
              className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Notifications</h4>
                  <p className="text-[11px] text-slate-400">Movie alerts & booking updates</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  {notificationsCount} New
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeModalTab === "notifications" ? "rotate-180" : ""}`} />
              </div>
            </button>

            {activeModalTab === "notifications" && (
              <div className="px-3.5 pb-3.5 pt-1 border-t border-white/5 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5">
                  <p className="font-semibold text-rose-300">🎟️ Oppenheimer 70mm IMAX Fest</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">Tickets are selling fast for Friday midnight screener.</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">15 mins ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5">
                  <p className="font-semibold text-amber-300">🍿 VIP Lounge Access Unlocked</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">Show your Cineverse pass at the concession counter for 20% off.</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">2 hours ago</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Your Wishlist */}
          <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden transition hover:border-white/15">
            <button
              onClick={() => setActiveModalTab(activeModalTab === "wishlist" ? null : "wishlist")}
              className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Your Wishlist</h4>
                  <p className="text-[11px] text-slate-400">Saved movies & upcoming releases</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  wishlist.length > 0 
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                    : "bg-white/5 text-slate-500"
                }`}>
                  {wishlist.length} Saved
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeModalTab === "wishlist" ? "rotate-180" : ""}`} />
              </div>
            </button>

            {activeModalTab === "wishlist" && (
              <div className="px-3.5 pb-4 pt-2 border-t border-white/5">
                {wishlist.length === 0 ? (
                  <div className="py-5 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <Heart className="w-5 h-5" />
                    </div>
                    <p className="text-white font-semibold text-xs">No wishlisted items yet</p>
                    <p className="text-slate-400 text-[11px] max-w-[220px] mx-auto leading-relaxed">
                      Tap the heart icon on any movie or event to save it to your wishlist.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center justify-between gap-2.5 hover:border-white/15 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.poster ? (
                            <img
                              src={item.poster}
                              alt={item.title}
                              className="w-9 h-12 object-cover rounded-lg shrink-0 border border-white/10"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-9 h-12 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                              <Film className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate text-xs">{item.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{item.genre || item.format || "Cinema Item"}</p>
                            {item.rating && (
                              <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                                ★ {item.rating}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            cinemaAudio.playHoverTick();
                            removeFromWishlist(item.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer shrink-0"
                          title="Remove from wishlist"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Rewards */}
          <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden transition hover:border-white/15">
            <button
              onClick={() => setActiveModalTab(activeModalTab === "rewards" ? null : "rewards")}
              className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Rewards</h4>
                  <p className="text-[11px] text-slate-400">Cineverse Club points & perks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  {rewardsPoints} pts
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeModalTab === "rewards" ? "rotate-180" : ""}`} />
              </div>
            </button>

            {activeModalTab === "rewards" && (
              <div className="px-3.5 pb-3.5 pt-1 border-t border-white/5 space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-linear-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-white">Tier: Silver Member</span>
                    <span className="text-[11px] text-purple-300 font-semibold">{rewardsPoints} / 500 to Gold</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-linear-to-r from-purple-500 to-pink-500" style={{ width: "50%" }}></div>
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-white/5 text-[11px]">
                    <span className="text-slate-200">🍿 Free Caramel Popcorn Upgrade</span>
                    <span className="text-purple-400 font-bold">150 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-white/5 text-[11px]">
                    <span className="text-slate-200">💺 Free Recliner Seat Upgrade</span>
                    <span className="text-purple-400 font-bold">300 pts</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Help & Support */}
          <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden transition hover:border-white/15">
            <button
              onClick={() => setActiveModalTab(activeModalTab === "support" ? null : "support")}
              className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Help & Support</h4>
                  <p className="text-[11px] text-slate-400">FAQs, refunds & 24/7 concierge</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeModalTab === "support" ? "rotate-180" : ""}`} />
            </button>

            {activeModalTab === "support" && (
              <div className="px-3.5 pb-3.5 pt-1 border-t border-white/5 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1.5">
                  <p className="font-semibold text-cyan-300">Frequently Asked Questions</p>
                  <p className="text-[11px] text-slate-300">• How do I cancel or reschedule a booked ticket?</p>
                  <p className="text-[11px] text-slate-300">• Where do I retrieve my 3D Hologram digital ticket?</p>
                  <p className="text-[11px] text-slate-300">• What is the IMAX 70mm entry dress policy?</p>
                </div>
                {ticketQuerySubmitted ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] text-center">
                    ✓ Support request received. Our cinema concierge will reach out shortly!
                  </div>
                ) : (
                  <button
                    onClick={() => setTicketQuerySubmitted(true)}
                    className="w-full py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 font-bold text-center transition cursor-pointer"
                  >
                    Contact Cinema Concierge
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-white/2 text-center">
          <p className="text-[11px] text-slate-500">
            CINEVERSE Cinemas · v2.4.0
          </p>
        </div>

      </div>
    </div>
  );
}

export default function Navbar({
  currentAmbient,
  setAmbient,
  isSoundEnabled,
  setIsSoundEnabled,
  myTicketsCount,
  myTickets,
  onOpenMyTickets,
  onInspectRecentTicket,
  user,
  onOpenAuth,
  onSignOut,
  onUpdateProfile,
  searchQuery,
  setSearchQuery,
  onScrollToSection,
  selectedCity: propSelectedCity,
  onSelectCity,
  currentPage = "movies",
  onNavigatePage
}) {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [quickMenuInitialTab, setQuickMenuInitialTab] = useState(null);
  const [quickMenuAutoCloseDelay, setQuickMenuAutoCloseDelay] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Listen for open wishlist events (auto-closes drawer after 5s)
  useEffect(() => {
    const handleOpenWishlist = () => {
      setQuickMenuInitialTab("wishlist");
      setQuickMenuAutoCloseDelay(5000);
      setIsQuickMenuOpen(true);
    };
    window.addEventListener("cineverse_open_wishlist", handleOpenWishlist);
    return () => window.removeEventListener("cineverse_open_wishlist", handleOpenWishlist);
  }, []);

  // Location / City selection
  const [internalCity, setInternalCity] = useState(() => {
    try {
      return localStorage.getItem("cineverse_city") || "Mumbai";
    } catch {
      return "Mumbai";
    }
  });

  const selectedCity = propSelectedCity || internalCity;
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const handleSelectCity = (city) => {
    cinemaAudio.playHoverTick();
    setInternalCity(city);
    if (onSelectCity) {
      onSelectCity(city);
    }
    setShowLocationPicker(false);
    try {
      localStorage.setItem("cineverse_city", city);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search dropdown & direct navigation
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const desktopProfileContainerRef = useRef(null);
  const mobileProfileContainerRef = useRef(null);
  const profileCloseTimerRef = useRef(null);

  // Compute matched items (movies + events)
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    
    const matchedMovies = moviesData
      .filter((m) => 
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.cast.some(c => c.name.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .map((m) => ({
        type: "movie",
        id: m.id,
        targetId: `movie-card-${m.id}`,
        title: m.title,
        subtitle: `${m.rating} ★ · ${m.genres.join(", ")}`,
        badge: "Movie",
        image: m.poster
      }));

    const matchedEvents = cinemaEvents
      .filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.subtitle.toLowerCase().includes(q) ||
        (e.city && e.city.toLowerCase().includes(q)) ||
        (e.hall && e.hall.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .map((e) => ({
        type: "event",
        id: e.id,
        targetId: `event-card-${e.id}`,
        title: e.title,
        subtitle: `${e.city ? e.city + " · " : ""}${e.category} · ${e.date}`,
        badge: e.city || "Event",
        image: e.image
      }));

    return [...matchedMovies, ...matchedEvents];
  }, [searchQuery]);

  // Navigate directly to the related card
  const navigateToCard = (targetId) => {
    cinemaAudio.playHoverTick();
    setIsSearchDropdownOpen(false);
    setIsMobileMenuOpen(false);

    // If it's an event, switch to events page
    if (targetId && targetId.startsWith("event-card-")) {
      const eventId = targetId.replace("event-card-", "");
      const foundEvent = cinemaEvents.find((e) => e.id === eventId);
      if (foundEvent && foundEvent.city && foundEvent.city !== "All Cities") {
        if (onSelectCity && foundEvent.city !== selectedCity) {
          onSelectCity(foundEvent.city);
        }
      }
      if (currentPage !== "events" && onNavigatePage) {
        onNavigatePage("events");
      }
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("ring-4", "ring-amber-500", "ring-offset-4", "ring-offset-slate-950", "scale-103", "transition-all", "duration-500");
          setTimeout(() => {
            element.classList.remove("ring-4", "ring-amber-500", "ring-offset-4", "ring-offset-slate-950", "scale-103");
          }, 2500);
        }
      }, 250);
      return;
    }

    // Otherwise it's a movie
    if (currentPage !== "movies" && onNavigatePage) {
      onNavigatePage("movies");
    }

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-4", "ring-rose-500", "ring-offset-4", "ring-offset-slate-950", "scale-103", "transition-all", "duration-500");
        setTimeout(() => {
          element.classList.remove("ring-4", "ring-rose-500", "ring-offset-4", "ring-offset-slate-950", "scale-103");
        }, 2500);
      } else {
        const section = document.getElementById("now-showing");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 250);
  };

  // Close dropdown & profile on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchDropdownOpen(false);
      }
      const isInsideDesktopProfile = desktopProfileContainerRef.current && desktopProfileContainerRef.current.contains(e.target);
      const isInsideMobileProfile = mobileProfileContainerRef.current && mobileProfileContainerRef.current.contains(e.target);
      if (!isInsideDesktopProfile && !isInsideMobileProfile) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (profileCloseTimerRef.current) {
        clearTimeout(profileCloseTimerRef.current);
      }
    };
  }, []);

  const toggleSound = () => {
    const nextState = cinemaAudio.toggleSound();
    setIsSoundEnabled(nextState);
    if (nextState) cinemaAudio.playHoverTick();
  };

  const handleNavigation = (target) => {
    cinemaAudio.playHoverTick();
    setIsMobileMenuOpen(false);

    if (target === "home") {
      if (onNavigatePage) onNavigatePage("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (target === "movies" || target === "now-showing") {
      if (onNavigatePage) onNavigatePage("movies");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (target === "events") {
      if (onNavigatePage) onNavigatePage("events");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (onScrollToSection) {
      onScrollToSection(target);
    }
  };

  // Dynamic top scrolling ads belt for movies, live events & exclusive cinema promotions
  const headerTapeAds = React.useMemo(() => [
    {
      id: "ad-1",
      badge: "LIMITED OFFER",
      badgeColor: "bg-rose-500 text-white",
      tag: "50% OFF",
      text: "Flash Sale: Flat 50% Off on 2nd Ticket for IMAX 70mm Screenings",
      code: "IMAX50",
      type: "movie",
      target: "movies",
      icon: Flame
    },
    {
      id: "ad-2",
      badge: "LIVE CONCERT",
      badgeColor: "bg-amber-500 text-slate-950 font-black",
      tag: "SELLING FAST",
      text: "A.R. Rahman Live Symphony Tour 2026 — Limited VIP Passes Available",
      code: "ARR2026",
      type: "event",
      target: "events",
      icon: Zap
    },
    {
      id: "ad-3",
      badge: "PREMIERE",
      badgeColor: "bg-purple-600 text-white",
      tag: "NOW BOOKING",
      text: "Christopher Nolan's THE ODYSSEY (4K Laser IMAX) — Advance Bookings Open",
      code: "PREMIERE",
      type: "movie",
      target: "movies",
      icon: Film
    },
    {
      id: "ad-4",
      badge: "F&B COMBO",
      badgeColor: "bg-emerald-500 text-slate-950 font-black",
      tag: "FREE POPCORN",
      text: "Pre-book Gourmet Tub & Truffle Fries to Get Free Bottomless Coke",
      code: "COMBOFREE",
      type: "fnb",
      target: "movies",
      icon: Tag
    },
    {
      id: "ad-5",
      badge: "STAND-UP SPECIAL",
      badgeColor: "bg-cyan-500 text-slate-950 font-black",
      tag: "EXCLUSIVE",
      text: "Zakir Khan Live Comedy Fest — 6 Passes Max per Account with Code",
      code: "ZAKIR6",
      type: "event",
      target: "events",
      icon: Sparkles
    },
    {
      id: "ad-6",
      badge: "STUDENT PASS",
      badgeColor: "bg-pink-500 text-white",
      tag: "FLAT ₹150",
      text: "College Students Special: All Weekday Matinee Shows at ₹150 Only",
      code: "CAMPUS150",
      type: "movie",
      target: "movies",
      icon: Star
    }
  ], []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#07090e]/98 border-white/15 shadow-2xl shadow-black/80"
            : "bg-[#07090e]/95 border-white/10 shadow-lg shadow-black/40"
        }`}
      >
        {/* Continuous Scrolling Tape Ads Belt (Fixed atop the header with matched header sizing) */}
        <aside 
          aria-label="Promotional Ads Banner Tape"
          className="w-full h-11 sm:h-12 bg-[#090d18] border-b border-white/10 relative overflow-hidden flex items-center select-none"
        >
          {/* Edge fade gradients for seamless tape appearance */}
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-[#090d18] via-[#090d18]/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#090d18] via-[#090d18]/90 to-transparent z-10 pointer-events-none" />

          {/* Continuous scrolling tape marquee tracks */}
          <div className="animate-tape-scroll flex items-center gap-6 sm:gap-8 px-4 cursor-pointer">
            {[...headerTapeAds, ...headerTapeAds].map((ad, idx) => {
              const IconComp = ad.icon;
              return (
                <div
                  key={`${ad.id}-${idx}`}
                  onClick={() => {
                    cinemaAudio.playHoverTick();
                    if (ad.target === "events") {
                      if (onNavigatePage) onNavigatePage("events");
                    } else {
                      if (onNavigatePage) onNavigatePage("movies");
                    }
                  }}
                  className="flex items-center gap-2.5 sm:gap-3 py-1 px-3 sm:px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all shrink-0 group active:scale-98"
                >
                  <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 ${ad.badgeColor}`}>
                    <IconComp className="w-3 h-3 stroke-[2.5]" />
                    {ad.badge}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate max-w-[280px] sm:max-w-[420px] md:max-w-none">
                    {ad.text}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-white/10 text-cyan-300 border border-cyan-400/30 shrink-0">
                    {ad.code}
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                    →
                  </span>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* 1. Brand Logo & Name (Navigates to Home Section) */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => {
            cinemaAudio.playHoverTick();
            if (onNavigatePage) onNavigatePage("home");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              cinemaAudio.playHoverTick();
              if (onNavigatePage) onNavigatePage("home");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          aria-label="CINEVERSE Home"
          title="Go to Home"
          className="flex shrink-0 items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform duration-300">
            <Film className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute -inset-1 rounded-xl bg-rose-500/20 blur-sm -z-10 group-hover:bg-rose-500/40 transition-all"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-base sm:text-xl text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-rose-400 group-hover:from-white group-hover:to-pink-300 transition-all">
                CINEVERSE
              </span>
            </div>
            <p className="text-[9px] text-slate-400 hidden sm:block tracking-widest uppercase group-hover:text-rose-400 transition-colors">
              Next-Gen Cinema
            </p>
          </div>
        </div>

        {/* 2. Menus: Movies, Events */}
        <nav className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-300 shrink-0">
          {navItems.map(({ id, label, Icon, color }) => {
            const isActive = currentPage === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigation(id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? id === "events"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span>{label}</span>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${id === "events" ? "bg-amber-400" : "bg-rose-400"} animate-pulse`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Prominent Search Bar with Direct Navigation - visible on Mobile, Tab, iPad & Desktop */}
        <div ref={searchContainerRef} className="flex flex-1 min-w-0 max-w-[190px] xs:max-w-[240px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-1 sm:mx-2 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search movies, events..."
            value={searchQuery}
            onFocus={() => setIsSearchDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchDropdownOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchResults.length > 0) {
                navigateToCard(searchResults[0].targetId);
              }
            }}
            className="w-full pl-8 sm:pl-10 pr-7 sm:pr-8 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIsSearchDropdownOpen(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          )}

          {/* Interactive Search Suggestions Dropdown */}
          {isSearchDropdownOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/15 bg-[#090d16] shadow-2xl overflow-hidden z-50 animate-in fade-in max-h-96 overflow-y-auto">
              <div className="p-2 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 px-3">
                <span>Jump directly to card:</span>
                <span className="text-[10px] text-rose-400 font-mono">
                  {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching movies or events found.
                </div>
              ) : (
                <div className="p-1 space-y-1">
                  {searchResults.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onClick={() => navigateToCard(item.targetId)}
                      className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                    >
                      <img
                        src={item.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-10 h-12 rounded-lg object-cover bg-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                            {item.title}
                          </h4>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                            item.type === "movie" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 group-hover:text-rose-400 font-semibold uppercase tracking-wider shrink-0 transition-colors">
                        Jump →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Desktop Controls: Location + Theme + Sound + Tickets + Profile */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          
          {/* Location Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                cinemaAudio.playHoverTick();
                setShowLocationPicker(!showLocationPicker);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer"
              title="Select Cinema City"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="max-w-20 truncate">{selectedCity}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showLocationPicker ? "rotate-180" : ""}`} />
            </button>

            {showLocationPicker && (
              <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl shadow-2xl border border-white/15 bg-[#090d16] z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    Select Cinema City
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(false)}
                    className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search city..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white mb-2 outline-none focus:border-rose-500/50"
                />
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {popularCities
                    .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                    .map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition cursor-pointer ${
                          selectedCity === city
                            ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{city}</span>
                        {selectedCity === city && <Check className="w-3 h-3 text-rose-400 shrink-0" />}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div
            ref={desktopProfileContainerRef}
            className="relative"
            onMouseEnter={() => {
              if (profileCloseTimerRef.current) {
                clearTimeout(profileCloseTimerRef.current);
                profileCloseTimerRef.current = null;
              }
            }}
            onMouseLeave={() => {
              if (isProfileOpen) {
                if (profileCloseTimerRef.current) {
                  clearTimeout(profileCloseTimerRef.current);
                }
                profileCloseTimerRef.current = setTimeout(() => {
                  setIsProfileOpen(false);
                }, 200);
              }
            }}
          >
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((open) => !open)}
                  aria-expanded={isProfileOpen}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-rose-500/40 hover:text-white cursor-pointer"
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <UserRound className="h-4 w-4 text-rose-300" />
                  )}
                  <span>{user.name.split(" ")[0]}</span>
                </button>
                {isProfileOpen && (
                  <ProfileDropdown
                    user={user}
                    tickets={myTickets}
                    onSignOut={onSignOut}
                    onInspectTicket={onInspectRecentTicket}
                    onUpdateProfile={onUpdateProfile}
                    onClose={() => setIsProfileOpen(false)}
                  />
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  onOpenAuth();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 px-3.5 py-2 text-xs font-bold text-rose-300 hover:text-white transition cursor-pointer shadow-sm"
              >
                <UserRound className="h-4 w-4 text-rose-300" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* 3-Lined Menu Button (Desktop only - mobile and tablet use persistent bottom navigation) */}
          <button
            type="button"
            onClick={() => {
              cinemaAudio.playHoverTick();
              setIsQuickMenuOpen(true);
            }}
            aria-label="Open More Options"
            title="My Tickets, Notifications, Wishlist, Rewards, Support"
            className="hidden lg:flex flex-col items-center justify-center gap-1 w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 hover:text-white transition-all cursor-pointer group active:scale-95 shadow-sm"
          >
            <span className="w-5 h-0.5 bg-slate-200 group-hover:bg-rose-400 rounded-full transition-colors"></span>
            <span className="w-4 h-0.5 bg-slate-200 group-hover:bg-rose-400 rounded-full transition-colors"></span>
            <span className="w-5 h-0.5 bg-slate-200 group-hover:bg-rose-400 rounded-full transition-colors"></span>
          </button>
        </div>

        {/* Mobile Header Right (Location pill, Profile, Menu) */}
        <div className="md:hidden flex shrink-0 items-center gap-2">
          {/* Mobile Location button */}
          <button
            type="button"
            onClick={() => {
              cinemaAudio.playHoverTick();
              setShowLocationPicker(!showLocationPicker);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-200"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="max-w-16 truncate">{selectedCity}</span>
          </button>

          {/* Mobile Profile / Sign In */}
          <div
            ref={mobileProfileContainerRef}
            className="relative"
            onMouseEnter={() => {
              if (profileCloseTimerRef.current) {
                clearTimeout(profileCloseTimerRef.current);
                profileCloseTimerRef.current = null;
              }
            }}
            onMouseLeave={() => {
              if (isProfileOpen) {
                if (profileCloseTimerRef.current) {
                  clearTimeout(profileCloseTimerRef.current);
                }
                profileCloseTimerRef.current = setTimeout(() => {
                  setIsProfileOpen(false);
                }, 200);
              }
            }}
          >
            {user ? (
              <>
                <button
                  type="button"
                  aria-label="Open profile"
                  aria-expanded={isProfileOpen}
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-rose-300 transition-colors hover:border-rose-500/40 cursor-pointer"
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </button>
                {isProfileOpen && (
                  <ProfileDropdown
                    user={user}
                    tickets={myTickets}
                    onSignOut={onSignOut}
                    onInspectTicket={onInspectRecentTicket}
                    onUpdateProfile={onUpdateProfile}
                    onClose={() => setIsProfileOpen(false)}
                  />
                )}
              </>
            ) : (
              <button
                type="button"
                aria-label="Sign in"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  onOpenAuth();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-300 transition-colors hover:border-rose-500/40 cursor-pointer"
              >
                <UserRound className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Location Dropdown overlay if open */}
      {showLocationPicker && (
        <div className="md:hidden border-t border-white/10 bg-[#090d16] p-4">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Select Cinema City
            </span>
            <button
              onClick={() => setShowLocationPicker(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Search city..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-lg text-white mb-2 outline-none focus:border-rose-500/50"
          />
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
            {popularCities
              .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
              .map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition cursor-pointer ${
                    selectedCity === city
                      ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="truncate">{city}</span>
                  {selectedCity === city && <Check className="w-3 h-3 text-rose-400 shrink-0" />}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-white/10 bg-[#07090e] px-4 sm:px-6 pb-6 pt-3">
          
          {/* Mobile Search input with direct card navigation */}
          <div className="mb-4 relative">
            <Search className="pointer-events-none absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search movies, events, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white outline-none focus:border-rose-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}

            {/* Mobile Search Results */}
            {searchQuery.trim() && (
              <div className="mt-2 rounded-xl border border-white/10 bg-slate-900/95 overflow-hidden max-h-56 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <p className="p-3 text-center text-xs text-slate-400">No matches found</p>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={`mob-${item.type}-${item.id}`}
                      type="button"
                      onClick={() => navigateToCard(item.targetId)}
                      className="w-full p-2.5 border-b border-white/5 flex items-center gap-2.5 text-left hover:bg-white/5"
                    >
                      <img src={item.image} alt="" referrerPolicy="no-referrer" className="w-8 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                        Jump →
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {!user ? (
            <button
              type="button"
              onClick={() => {
                cinemaAudio.playHoverTick();
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full mb-3 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <UserRound className="h-4 w-4" />
              Sign In / Register
            </button>
          ) : (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-rose-300 border border-white/10">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">{user.name}</p>
                  <p className="truncate text-[10px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onSignOut();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}

          <nav className="flex flex-col text-sm font-medium text-slate-300 gap-1">
            {navItems.map(({ id, label, Icon, color }) => {
              const isActive = currentPage === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavigation(id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                    isActive
                      ? id === "events"
                        ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30"
                        : "bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span>{label}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/10">Active</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-3 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => {
                cinemaAudio.playHoverTick();
                setIsMobileMenuOpen(false);
                setIsQuickMenuOpen(true);
              }}
              className="w-full flex items-center justify-between rounded-xl bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5 w-3.5">
                  <span className="h-0.5 w-3.5 bg-rose-400 rounded-full"></span>
                  <span className="h-0.5 w-2.5 bg-rose-400 rounded-full"></span>
                  <span className="h-0.5 w-3.5 bg-rose-400 rounded-full"></span>
                </div>
                More Options (My Tickets, Notifications, Wishlist, Rewards, Support)
              </span>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      </header>

      {/* Mobile & Tablet Bottom Navigation Dock */}
      <nav 
        aria-label="Mobile and Tablet Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/98 border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.85)] px-2 sm:px-6 py-1.5"
      >
        <div className="max-w-md md:max-w-xl mx-auto grid grid-cols-4 items-center gap-1 sm:gap-2">
          {/* 1. Home Button */}
          <button
            type="button"
            onClick={() => {
              handleNavigation("home");
              setIsQuickMenuOpen(false);
              setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
              currentPage === "home" && !isQuickMenuOpen
                ? "text-cyan-400 bg-cyan-500/15 font-bold border border-cyan-500/30 shadow-xs shadow-cyan-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5 font-medium border border-transparent"
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 ${currentPage === "home" && !isQuickMenuOpen ? "text-cyan-400 scale-105" : "text-slate-300"} transition-transform`} />
              {currentPage === "home" && !isQuickMenuOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs tracking-tight mt-1">Home</span>
          </button>

          {/* 2. Movies Button */}
          <button
            type="button"
            onClick={() => {
              handleNavigation("movies");
              setIsQuickMenuOpen(false);
              setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
              currentPage === "movies" && !isQuickMenuOpen
                ? "text-rose-400 bg-rose-500/15 font-bold border border-rose-500/30 shadow-xs shadow-rose-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5 font-medium border border-transparent"
            }`}
          >
            <div className="relative">
              <Clapperboard className={`w-5 h-5 ${currentPage === "movies" && !isQuickMenuOpen ? "text-rose-400 scale-105" : "text-slate-300"} transition-transform`} />
              {currentPage === "movies" && !isQuickMenuOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs tracking-tight mt-1">Movies</span>
          </button>

          {/* 3. Events Button */}
          <button
            type="button"
            onClick={() => {
              handleNavigation("events");
              setIsQuickMenuOpen(false);
              setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
              currentPage === "events" && !isQuickMenuOpen
                ? "text-amber-400 bg-amber-500/15 font-bold border border-amber-500/30 shadow-xs shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5 font-medium border border-transparent"
            }`}
          >
            <div className="relative">
              <Calendar className={`w-5 h-5 ${currentPage === "events" && !isQuickMenuOpen ? "text-amber-400 scale-105" : "text-slate-300"} transition-transform`} />
              {currentPage === "events" && !isQuickMenuOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs tracking-tight mt-1">Events</span>
          </button>

          {/* 4. Menu Section Button */}
          <button
            type="button"
            onClick={() => {
              cinemaAudio.playHoverTick();
              setIsQuickMenuOpen(!isQuickMenuOpen);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
              isQuickMenuOpen
                ? "text-rose-400 bg-rose-500/15 font-bold border border-rose-500/30 shadow-xs shadow-rose-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5 font-medium border border-transparent"
            }`}
          >
            <div className="relative flex flex-col items-center justify-center w-5 h-5 gap-1">
              <span className={`h-0.5 w-4 rounded-full transition-colors ${isQuickMenuOpen ? "bg-rose-400" : "bg-slate-300"}`}></span>
              <span className={`h-0.5 w-3 rounded-full transition-colors ${isQuickMenuOpen ? "bg-rose-400" : "bg-slate-300"}`}></span>
              <span className={`h-0.5 w-4 rounded-full transition-colors ${isQuickMenuOpen ? "bg-rose-400" : "bg-slate-300"}`}></span>
              {myTickets.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#07090e]" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs tracking-tight mt-1">Menu</span>
          </button>
        </div>
      </nav>

      {/* 3-Lined Quick Menu Drawer / Modal */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => {
          setIsQuickMenuOpen(false);
          setQuickMenuInitialTab(null);
          setQuickMenuAutoCloseDelay(null);
        }}
        user={user}
        onOpenAuth={onOpenAuth}
        myTickets={myTickets}
        onInspectTicket={onInspectRecentTicket}
        onOpenMyTickets={onOpenMyTickets}
        notificationsCount={2}
        rewardsPoints={250}
        initialTab={quickMenuInitialTab}
        autoCloseDelay={quickMenuAutoCloseDelay}
      />
    </>
  );
}
