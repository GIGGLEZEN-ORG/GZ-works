import React, { useEffect, useRef, useState } from 'react';
import { Bus, HelpCircle, User, UserPlus, Ticket, X, ChevronDown } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Navbar() {
  const {
    navigateToHome,
    myBookings,
    setMyBookingsModalOpen,
    setHelpModalOpen,
    setLoginModalOpen,
    setSignupModalOpen,
    setProfileModalOpen,
    userProfile,
    isLoggedIn,
    logout
  } = useBooking();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const displayName = isLoggedIn ? (userProfile.fullName || 'User').split(' ')[0] : 'Account';
  const confirmedCount = myBookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100 bg-gradient-to-r from-white via-white to-sky-50/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={navigateToHome}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <img
                src="/brand-logo.png"
                alt="My Bus Booking"
                className="h-11 w-11 rounded-2xl border-2 border-amber-400 bg-white object-contain p-0.5 shadow-lg shadow-cyan-500/25 ring-2 ring-[#087e8b]/25 transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
              />
              <div className="flex min-w-0 flex-col">
                <span className="whitespace-nowrap text-sm sm:text-xl font-black tracking-tight text-[#087e8b] font-['Montserrat'] leading-none">
                  My Bus <span className="text-gray-900">Booking</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-500 mt-0.5">
                  Safe & Verified
                </span>
              </div>
            </button>
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            
            {/* Help Button */}
            <button
              onClick={() => setHelpModalOpen(true)}
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-[#087e8b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span>Help</span>
            </button>

            {/* My Bookings Button */}
            <button
              onClick={() => setMyBookingsModalOpen(true)}
              className="relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-[#087e8b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-gray-500" />
              <span>My Bookings</span>
              {confirmedCount > 0 && (
                <span className="w-5 h-5 bg-[#087e8b] text-white text-xs font-bold rounded-full flex items-center justify-center animate-soft-pulse">
                  {confirmedCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                aria-expanded={userDropdownOpen}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-[#087e8b] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-[#087e8b]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>{displayName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">{isLoggedIn ? 'Welcome back' : 'Welcome to My Bus Booking'}</p>
                    <p className="text-sm font-bold text-gray-800">
                      {isLoggedIn ? `${userProfile.fullName} (Signed in)` : 'Login to continue'}
                    </p>
                  </div>

                  {isLoggedIn ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-[#087e8b] flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setMyBookingsModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-[#087e8b] flex items-center gap-2"
                      >
                        <Ticket className="w-4 h-4 text-gray-400" />
                        <span>My Bookings ({myBookings.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setHelpModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-[#087e8b] flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                        <span>24/7 Customer Support</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-sky-50 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setSignupModalOpen(false);
                          setLoginModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-[#087e8b] flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Login</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setLoginModalOpen(false);
                          setSignupModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-[#087e8b] flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4 text-gray-400" />
                        <span>Create account</span>
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-4 py-2 text-[11px] text-gray-400">
                    My Bus Booking v3.4 • Safe & Verified
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Utilities */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMyBookingsModalOpen(true)}
              className="p-2 text-gray-700 relative"
            >
              <Ticket className="w-6 h-6 text-[#087e8b]" />
              {confirmedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#087e8b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {confirmedCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="w-full bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
          <div className="grid w-full grid-cols-4 gap-1 border-t border-sky-100 bg-gradient-to-r from-white via-sky-50/95 to-cyan-50/90 p-1.5 shadow-[0_-8px_24px_rgba(8,126,139,0.16)]">
            <button
              onClick={navigateToHome}
              className="flex flex-col items-center justify-center gap-0.5 rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 px-2 py-1.5 text-[10px] font-semibold text-[#087e8b] transition-all duration-200 hover:shadow-sm"
            >
              <Bus className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setMyBookingsModalOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-[10px] font-semibold text-gray-600 transition-all duration-200 hover:bg-white hover:text-[#087e8b] hover:shadow-sm"
            >
              <Ticket className="w-4 h-4" />
              <span>Trips</span>
            </button>
            <button
              onClick={() => setHelpModalOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-[10px] font-semibold text-gray-600 transition-all duration-200 hover:bg-white hover:text-[#087e8b] hover:shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
            <button
              onClick={() => (isLoggedIn ? setProfileModalOpen(true) : setLoginModalOpen(true))}
              className="flex flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-[10px] font-semibold text-gray-600 transition-all duration-200 hover:bg-white hover:text-[#087e8b] hover:shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>{isLoggedIn ? 'Profile' : 'Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
