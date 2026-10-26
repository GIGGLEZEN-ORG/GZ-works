import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  Bell, 
  UserRound,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useAccount } from '../context/AccountContext';

export default function TopBar({ ambientColor }) {
  const { 
    canGoBack, 
    canGoForward, 
    goBack, 
    goForward, 
    currentView, 
    searchQuery, 
    setSearchQuery,
    navigate,
    t
  } = useMusic();

  const {
    isLoggedIn,
    userProfile,
    setLoginModalOpen,
    setSignupModalOpen,
    setProfileModalOpen,
    logout
  } = useAccount();

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
    <header className="playmusic-topbar sticky top-0 z-30 flex items-center justify-between gap-3 px-4 backdrop-blur-xl border-b">
      {/* Left: Navigation Controls & Universal Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xl">
        {/* History Arrows */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canGoBack 
                ? 'bg-white/10 text-white hover:bg-white/20 cursor-pointer' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
            title="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canGoForward 
                ? 'bg-white/10 text-white hover:bg-white/20 cursor-pointer' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
            title="Go forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Universal Search Bar */}
        <div 
          onClick={() => {
            if (currentView !== 'search') navigate('search');
          }}
          className="relative flex-1 min-w-0 max-w-md group cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-white transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'search') navigate('search');
            }}
            placeholder={t('Search original songs, artists, albums...')}
            className="playmusic-search-input w-full pl-10 pr-9 py-2 rounded-full text-white placeholder-[#9ca3af] text-xs sm:text-sm font-medium outline-none transition-all duration-200"
          />
          {searchQuery && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: User Profile / Auth */}
      <div className="flex items-center gap-2 flex-shrink-0" ref={menuRef}>
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1ed760] to-[#2cd86b] text-black font-bold text-xs flex items-center justify-center">
                {userProfile?.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-semibold text-white max-w-[100px] truncate hidden sm:block">
                {userProfile?.fullName || 'User'}
              </span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl glass-dock py-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                >
                  <UserRound className="w-4 h-4 text-[#9ca3af]" />
                  <span>Profile</span>
                </button>
                <div className="my-1 border-t border-white/10" />
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white hover:text-[#1ed760] transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => setSignupModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-bold transition-all transform hover:scale-105 shadow-sm"
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
