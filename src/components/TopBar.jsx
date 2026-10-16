import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  Bell, 
  ArrowDownCircle, 
  UserRound,
  UserPlus,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useBooking } from '../context/BookingContext';

export default function TopBar() {
  const { 
    canGoBack, 
    canGoForward, 
    goBack, 
    goForward, 
    currentView, 
    searchQuery, 
    setSearchQuery,
    navigate,
    showToast,
    selectedMusicLanguage,
    setSelectedMusicLanguage,
    t
  } = useMusic();
  const {
    isLoggedIn,
    userProfile,
    setLoginModalOpen,
    setSignupModalOpen,
    setProfileModalOpen,
    logout
  } = useBooking();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 bg-[#101010] px-3 py-3 sm:gap-3 sm:px-4 lg:px-6 lg:py-4">
      {/* Left: History Nav & Search input */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <img
          src="/playmusic-logo.png"
          alt="playmusic"
          className="h-8 w-8 shrink-0 rounded-md object-cover md:hidden"
        />
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={`music-control flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              canGoBack 
                ? 'bg-black/70 text-white hover:bg-black cursor-pointer' 
                : 'bg-black/40 text-[#6a6a6a] cursor-not-allowed'
            }`}
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className={`music-control flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              canGoForward 
                ? 'bg-black/70 text-white hover:bg-black cursor-pointer' 
                : 'bg-black/40 text-[#6a6a6a] cursor-not-allowed'
            }`}
            title="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Search Bar (Shown in Search view or as quick search) */}
        {currentView === 'search' && (
          <div className="relative ml-1 min-w-0 w-40 sm:w-56 lg:w-72 xl:w-96">
            <Search className="w-4 h-4 text-[#a7a7a7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('What do you want to play?')}
              autoFocus
              className="w-full bg-[#242424] text-sm text-white pl-10 pr-9 py-2.5 rounded-full placeholder-[#7a7a7a] focus:outline-none focus:ring-2 focus:ring-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a7a7a7] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Center Filter Chips (Music Language Selector) */}
      <div
        role="group"
        aria-label="Filter music by language"
        className={`hidden items-center gap-1 rounded-full border border-white/5 bg-[#181818] p-1 lg:flex ${
          currentView === 'search' ? '!hidden' : ''
        }`}
      >
        {['All', 'Telugu', 'Hindi', 'English', 'Kannada'].map((lang) => {
          const isSelected = selectedMusicLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => setSelectedMusicLanguage(lang)}
              aria-pressed={isSelected}
              className={`music-control whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black'
                  : 'text-[#b3b3b3] hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              {t(lang)}
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex min-w-0 items-center justify-self-end gap-1.5 sm:gap-2 lg:gap-3">
        {/* Premium Upgrade Button */}
        <button 
          onClick={() => showToast("playmusic Premium: 3 months free trial active!")}
          className="music-control hidden whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-105 active:scale-95 lg:inline-flex"
        >
          Explore Premium
        </button>

        {/* Install App Button */}
        <button 
          onClick={() => showToast("Web player is currently running in desktop mode")}
          className="music-control hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs font-bold text-white transition-all hover:scale-105 hover:bg-black xl:flex"
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Install App</span>
        </button>

        {/* Bell Notification */}
        <button 
          onClick={() => showToast("No new notifications")}
          className="music-control flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/60 text-[#a7a7a7] transition-colors hover:bg-[#282828] hover:text-white"
          title="What's New"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            aria-label={isLoggedIn ? `Open profile menu for ${userProfile.fullName}` : 'Open account menu'}
            aria-expanded={isProfileMenuOpen}
            className="music-control flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-[#242424] p-1 transition-transform hover:scale-105"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-black">
              {isLoggedIn ? (userProfile.fullName || 'U').charAt(0).toUpperCase() : <UserRound className="w-4 h-4" />}
            </div>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#282828] rounded-md shadow-2xl p-1 z-50 text-xs border border-white/5 animate-in fade-in zoom-in-95">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <p className="font-semibold text-white truncate">{userProfile.fullName}</p>
                    <p className="mt-1 text-[#a7a7a7] truncate">{userProfile.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
                  >
                    <UserRound className="w-4 h-4 text-[#a7a7a7]" />
                    {t('Profile')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('library');
                    }}
                    className="w-full px-3 py-2.5 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
                  >
                    {t('Your Library')}
                  </button>
                  <div className="h-px bg-white/10 my-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                      showToast('Logged out');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-[#a7a7a7]" />
                    {t('Log out')}
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <p className="font-semibold text-white">{t('Your playmusic account')}</p>
                    <p className="mt-1 text-[#a7a7a7]">{t('Log in or sign up to get started.')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-[#a7a7a7]" />
                    {t('Log in')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setSignupModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-[#a7a7a7]" />
                    {t('Sign up')}
                  </button>
                </>
              )}
              <div className="h-px bg-white/10 my-1"></div>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  showToast('Premium Active');
                }}
                className="w-full px-3 py-2.5 text-white hover:bg-[#3e3e3e] rounded text-left transition-colors"
              >
                {t('Upgrade to Premium')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
