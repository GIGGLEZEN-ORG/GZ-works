import React, { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "./components/Navbar";
import AuthPage from "./components/AuthPage";
import HomePage from "./components/HomePage";
import MoviesPage from "./components/MoviesPage";
import MovieDetailModal from "./components/MovieDetailModal";
import BookingFlowModal from "./components/BookingFlowModal";
import MyTicketsModal from "./components/MyTicketsModal";
import EventsPage from "./components/EventsPage";
import EventPassModal from "./components/EventPassModal";
import Footer from "./components/Footer";
import TicketReceipt3D from "./components/TicketReceipt3D";
import WishlistToast from "./components/WishlistToast";
import { moviesData, cinemaAmbients } from "./data/moviesData";
import { cinemaAudio } from "./utils/soundEffects";
import { removeBookedSeatsForShowtime } from "./utils/seatBookingStore";
import { X } from "lucide-react";

function getTicketsStorageKey(email) {
  return `cineverse_tickets_${encodeURIComponent(email.toLowerCase())}`;
}

function loadUserTickets(account) {
  try {
    const saved = localStorage.getItem(getTicketsStorageKey(account.email));
    if (!saved) return [];
    const tickets = JSON.parse(saved);
    return Array.isArray(tickets) ? tickets : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [ambient, setAmbient] = useState(cinemaAmbients[0]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem("cineverse_session");
      if (!savedSession) return null;
      const session = JSON.parse(savedSession);
      return session?.email && session?.name ? session : null;
    } catch {
      return null;
    }
  });

  // Filters & Search
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedFormat, setSelectedFormat] = useState("All Formats");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Active Selections
  const [bookingMovie, setBookingMovie] = useState(null);
  const [detailMovie, setDetailMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState(false);
  const [inspectingTicket, setInspectingTicket] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authContextMessage, setAuthContextMessage] = useState("");
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);
  const [pendingBookingMovie, setPendingBookingMovie] = useState(null);
  const [bookingTheater, setBookingTheater] = useState(null);
  const [pendingBookingTheater, setPendingBookingTheater] = useState(null);
  const [bookingShowtime, setBookingShowtime] = useState(null);
  const [pendingBookingShowtime, setPendingBookingShowtime] = useState(null);
  const [bookingStep, setBookingStep] = useState(null);
  const [pendingBookingStep, setPendingBookingStep] = useState(null);

  // Dedicated Page Navigation: "home" (default) vs "movies" vs "events"
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      if (window.location.hash === "#events") return "events";
      if (window.location.hash === "#movies") return "movies";
      return "home";
    } catch {
      return "home";
    }
  });
  const [passBookingEvent, setPassBookingEvent] = useState(null);

  // Sync back/forward button navigation with hash
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#events") {
        setCurrentPage("events");
      } else if (window.location.hash === "#movies") {
        setCurrentPage("movies");
      } else {
        setCurrentPage("home");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigatePage = (page) => {
    cinemaAudio.playHoverTick();
    setCurrentPage(page);
    if (page === "events") {
      window.location.hash = "events";
    } else if (page === "movies") {
      window.location.hash = "movies";
    } else {
      if (window.location.hash) {
        try {
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        } catch {
          window.location.hash = "";
        }
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInitiateEventBooking = (event) => {
    setPassBookingEvent(event);
  };

  // Selected Location (synced across Header, Movies, Theaters, and Events)
  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      return localStorage.getItem("cineverse_city") || "Mumbai";
    } catch {
      return "Mumbai";
    }
  });

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    try {
      localStorage.setItem("cineverse_city", city);
    } catch {
      // ignore
    }
  };

  const [myTickets, setMyTickets] = useState(() =>
    user ? loadUserTickets(user) : []
  );

  // Save tickets to localStorage whenever updated
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(
        getTicketsStorageKey(user.email),
        JSON.stringify(myTickets)
      );
    } catch {
      window.alert("Unable to save your tickets because browser storage is unavailable.");
    }
  }, [myTickets, user]);

  const handleSaveBooking = (newBooking) => {
    setMyTickets((prev) => [newBooking, ...prev]);
  };

  const handleDeleteTicket = (bookingId) => {
    const target = myTickets.find((t) => t.bookingId === bookingId);
    if (target && target.seats && target.seats.length > 0) {
      removeBookedSeatsForShowtime(
        target.movie?.id || target.movie?.title,
        target.theater?.id || target.theater?.name,
        target.date,
        target.time?.time,
        target.seats.map((s) => s.id)
      );
    }
    setMyTickets((prev) => prev.filter((t) => t.bookingId !== bookingId));
  };

  const handleOpenAuth = (message = "Sign in to your CINEVERSE account", callback = null) => {
    setAuthContextMessage(message);
    setAuthSuccessCallback(() => callback);
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    setAuthContextMessage("");
    setAuthSuccessCallback(null);
    setPendingBookingMovie(null);
    setPendingBookingTheater(null);
    setPendingBookingShowtime(null);
    setPendingBookingStep(null);
  };

  const handleAuthenticated = (authenticatedUser) => {
    localStorage.setItem("cineverse_session", JSON.stringify(authenticatedUser));
    setMyTickets(loadUserTickets(authenticatedUser));
    setUser(authenticatedUser);
    setIsAuthOpen(false);
    setAuthContextMessage("");

    if (typeof authSuccessCallback === "function") {
      const cb = authSuccessCallback;
      setAuthSuccessCallback(null);
      cb(authenticatedUser);
    }

    if (pendingBookingMovie) {
      const targetMovie = pendingBookingMovie;
      const targetTheater = pendingBookingTheater;
      const targetShowtime = pendingBookingShowtime;
      const targetStep = pendingBookingStep;
      setPendingBookingMovie(null);
      setPendingBookingTheater(null);
      setPendingBookingShowtime(null);
      setPendingBookingStep(null);
      setBookingTheater(targetTheater);
      setBookingShowtime(targetShowtime);
      setBookingStep(targetStep);
      setBookingMovie(targetMovie);
    }
  };

  const handleInitiateBooking = (movie, theater = null, showtime = null, step = null) => {
    setBookingTheater(theater);
    setBookingShowtime(showtime);
    setBookingStep(step);
    setBookingMovie(movie);
  };

  const handleOpenMyTickets = () => {
    if (!user) {
      setPendingBookingMovie(null);
      setAuthContextMessage("Sign in to access your booked tickets and passes.");
      setIsAuthOpen(true);
      return;
    }
    setIsMyTicketsOpen(true);
  };

  const handleUpdateProfile = (profileUpdates) => {
    const updatedUser = { ...user, ...profileUpdates };
    try {
      const users = JSON.parse(localStorage.getItem("cineverse_users") || "[]");
      const userIndex = users.findIndex(
        (account) => account.email?.toLowerCase() === user.email?.toLowerCase()
      );
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...profileUpdates };
        localStorage.setItem("cineverse_users", JSON.stringify(users));
      } else {
        users.push(updatedUser);
        localStorage.setItem("cineverse_users", JSON.stringify(users));
      }
    } catch {
      // ignore
    }
    localStorage.setItem("cineverse_session", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("cineverse_session");
      setMyTickets([]);
      setUser(null);
      setIsMyTicketsOpen(false);
    } catch {
      window.alert("Unable to sign out because browser storage is unavailable.");
    }
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter movies based on search, genre, and format
  const filteredMovies = useMemo(() => {
    return moviesData.filter((m) => {
      // Search matching
      const matchesSearch =
        !searchQuery ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.cast.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

      // Genre matching
      const matchesGenre =
        selectedGenre === "All Genres" || m.genres.includes(selectedGenre);

      // Format matching
      const matchesFormat =
        selectedFormat === "All Formats" ||
        m.formats.some((f) => f.toLowerCase().includes(selectedFormat.toLowerCase()));

      return matchesSearch && matchesGenre && matchesFormat;
    });
  }, [searchQuery, selectedGenre, selectedFormat]);

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-rose-500 selection:text-white transition-colors duration-700">
      
      {/* Dynamic Ambient Background Illumination */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${ambient.glow}, transparent 70%)`
        }}
      />
      
      {/* Background Star/Particle Grid Accent */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[32px_32px] opacity-30 pointer-events-none -z-10" />

      {/* Global Wishlist Notification Alert Toast */}
      <WishlistToast />

      {/* Global Glassmorphic Header */}
      <Navbar
        currentAmbient={ambient}
        setAmbient={setAmbient}
        isSoundEnabled={isSoundEnabled}
        setIsSoundEnabled={setIsSoundEnabled}
        myTicketsCount={myTickets.length}
        myTickets={myTickets}
        onOpenMyTickets={handleOpenMyTickets}
        onInspectRecentTicket={(ticket) => setInspectingTicket(ticket)}
        user={user}
        onOpenAuth={() => {
          handleOpenAuth("Sign in to your CINEVERSE account");
        }}
        onSignOut={handleSignOut}
        onUpdateProfile={handleUpdateProfile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onScrollToSection={handleScrollToSection}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
      />

      {/* Page Content: Home Page vs Dedicated Movies Page vs Dedicated Events Page */}
      {currentPage === "events" ? (
        <EventsPage
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          onNavigateHome={() => handleNavigatePage("home")}
          onBookEvent={handleInitiateEventBooking}
        />
      ) : currentPage === "movies" ? (
        <MoviesPage
          movies={filteredMovies}
          allMovies={moviesData}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          onInitiateBooking={handleInitiateBooking}
          onOpenDetails={(movie) => setDetailMovie(movie)}
          onWatchTrailer={(movie) => setDetailMovie(movie)}
          onNavigateHome={() => handleNavigatePage("home")}
        />
      ) : (
        <HomePage
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          onNavigatePage={handleNavigatePage}
          onSelectMovie={(movie) => handleInitiateBooking(movie)}
          onOpenMovieDetails={(movie) => setDetailMovie(movie)}
          onWatchTrailer={(movie) => setDetailMovie(movie)}
          onBookEvent={handleInitiateEventBooking}
        />
      )}

      {/* Footer */}
      <Footer onNavigatePage={handleNavigatePage} currentPage={currentPage} />

      {/* ================= MODALS & ACTIVE OVERLAYS ================= */}

      {/* Authentication Modal (Triggered at Concessions/Payment, Passes, or Profile Click) */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in overflow-y-auto">
          <div 
            className="fixed inset-0 -z-10" 
            onClick={handleCloseAuth} 
          />
          <div className="relative w-full max-w-5xl my-auto">
            <AuthPage
              onAuthenticated={handleAuthenticated}
              onClose={handleCloseAuth}
              contextMessage={authContextMessage}
            />
          </div>
        </div>
      )}

      {/* 3D Booking Flow (Seat Selection, Concessions, 3D Hologram Ticket) */}
      {bookingMovie && (
        <BookingFlowModal
          movie={bookingMovie}
          user={user}
          selectedDate={selectedDate}
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          initialTheater={bookingTheater}
          initialShowtime={bookingShowtime}
          initialStep={bookingStep}
          onClose={() => {
            setBookingMovie(null);
            setBookingTheater(null);
            setBookingShowtime(null);
            setBookingStep(null);
          }}
          onSaveBooking={handleSaveBooking}
          onOpenAuth={handleOpenAuth}
          onGoHome={() => {
            setBookingMovie(null);
            setBookingTheater(null);
            setBookingShowtime(null);
            setBookingStep(null);
            handleNavigatePage("home");
          }}
        />
      )}

      {/* Movie Details & 4K Trailer Modal */}
      {detailMovie && (
        <MovieDetailModal
          movie={detailMovie}
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          onClose={() => setDetailMovie(null)}
          onBookNow={(movie, theater = null) => {
            setDetailMovie(null);
            handleInitiateBooking(movie, theater);
          }}
        />
      )}

      {/* My Booked Passes / Tickets Drawer Modal */}
      {isMyTicketsOpen && (
        <MyTicketsModal
          tickets={myTickets}
          onClose={() => setIsMyTicketsOpen(false)}
          onInspectTicket={(ticket) => {
            setIsMyTicketsOpen(false);
            setInspectingTicket(ticket);
          }}
          onDeleteTicket={handleDeleteTicket}
          onBrowseMovies={() => {
            setIsMyTicketsOpen(false);
            handleScrollToSection("now-showing");
          }}
        />
      )}

      {/* Inspect Single Ticket Modal */}
      {inspectingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setInspectingTicket(null)} 
          />
          <div 
            className="relative w-full max-w-2xl bg-[#090d16] p-6 rounded-3xl border border-white/20 shadow-2xl"
            style={{
              WebkitFontSmoothing: "subpixel-antialiased",
              textRendering: "geometricPrecision"
            }}
          >
            <button
              onClick={() => setInspectingTicket(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer z-30"
            >
              <X className="w-5 h-5" />
            </button>
            <TicketReceipt3D
              booking={inspectingTicket}
              onGoHome={() => {
                setInspectingTicket(null);
                handleNavigatePage("home");
              }}
              onClose={() => setInspectingTicket(null)}
            />
          </div>
        </div>
      )}

      {/* Official Live Event Pass Booking Modal */}
      {passBookingEvent && (
        <EventPassModal
          event={passBookingEvent}
          user={user}
          onClose={() => setPassBookingEvent(null)}
          onSaveBooking={handleSaveBooking}
          onViewPass={(bookedPass) => {
            setPassBookingEvent(null);
            setInspectingTicket(bookedPass);
          }}
          onOpenAuth={() => {
            handleOpenAuth(
              `Sign in or create an account to complete your live event pass reservation for "${passBookingEvent.title}".`
            );
          }}
        />
      )}

    </div>
  );
}
