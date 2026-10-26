import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBusesForRoute } from '../data/routeData';
import { hashPassword, getPasswordValidationMessage, isValidGmailAddress } from '../utils/auth';
import { clampTravelDate, getTravelDateBounds } from '../utils/dateUtils';

const AccountContext = createContext();

const LOCAL_STORAGE_KEY = 'mybusbooking_confirmed_tickets';
const PROFILE_STORAGE_KEY = 'mybusbooking_profile';
const AUTH_STORAGE_KEY = 'mybusbooking_logged_in';
const ACCOUNTS_STORAGE_KEY = 'mybusbooking_accounts';

const defaultProfile = {
  fullName: 'Krish',
  email: 'krish@example.com',
  phone: '+91 98765 43210',
  city: 'Bengaluru'
};

export const AccountProvider = ({ children }) => {
  const { tomorrow: defaultDateStr } = getTravelDateBounds();

  const [searchParams, setSearchParams] = useState({
    fromCity: 'Bengaluru',
    toCity: 'Hyderabad',
    date: defaultDateStr
  });

  const [currentView, setCurrentView] = useState('home'); // 'home' | 'results'
  const [buses, setBuses] = useState(() => getBusesForRoute('Bengaluru', 'Hyderabad', defaultDateStr));
  
  // Seat selection & booking state
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDropping, setSelectedDropping] = useState(null);

  // Modals
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [activeBookingData, setActiveBookingData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [myBookingsModalOpen, setMyBookingsModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [boardingPointsModalOpen, setBoardingPointsModalOpen] = useState(false);
  const [passengerInfoModalOpen, setPassengerInfoModalOpen] = useState(false);
  const [bookingLoginPending, setBookingLoginPending] = useState(false);
  const [pendingCouponCode, setPendingCouponCode] = useState(null);
  const [couponPromptModalOpen, setCouponPromptModalOpen] = useState(false);
  const [promptCouponCode, setPromptCouponCode] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const promptLoginForCoupon = (code = '') => {
    setPromptCouponCode(code);
    setCouponPromptModalOpen(true);
  };

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Saved bookings in LocalStorage
  const [myBookings, setMyBookings] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myBookings));
    } catch (e) {
      console.error('Failed to save bookings in localStorage', e);
    }
  }, [myBookings]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to save profile in localStorage', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isLoggedIn));
    } catch (e) {
      console.error('Failed to save auth state in localStorage', e);
    }
  }, [isLoggedIn]);

  const isAnyModalOpen = Boolean(
    confirmationModalOpen ||
    checkoutModalOpen ||
    myBookingsModalOpen ||
    helpModalOpen ||
    boardingPointsModalOpen ||
    passengerInfoModalOpen ||
    couponPromptModalOpen ||
    loginModalOpen ||
    signupModalOpen ||
    profileModalOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isAnyModalOpen]);

  const login = async ({ email, password }) => {
    const safeEmail = (email || '').trim().toLowerCase();
    if (!isValidGmailAddress(safeEmail)) {
      return { success: false, message: 'Enter a valid Gmail address.' };
    }
    const passwordError = getPasswordValidationMessage(password || '');
    if (passwordError) {
      return { success: false, message: passwordError };
    }

    try {
      const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '{}');
      const account = accounts[safeEmail];
      if (!account) {
        return { success: false, message: 'No account found for this Gmail address. Please sign up first.' };
      }

      const passwordHash = await hashPassword(password, account.salt);
      if (passwordHash.hash !== account.passwordHash) {
        return { success: false, message: 'Incorrect email or password.' };
      }

      setUserProfile(prev => ({
        ...prev,
        fullName: account.fullName,
        email: safeEmail
      }));
      setIsLoggedIn(true);
      setLoginModalOpen(false);
      setCouponPromptModalOpen(false);
      if (bookingLoginPending) {
        setBookingLoginPending(false);
        setPassengerInfoModalOpen(false);
        setCheckoutModalOpen(true);
      }
      return { success: true, message: 'Logged in successfully.' };
    } catch (error) {
      console.error('Failed to authenticate account', error);
      return { success: false, message: 'Unable to log in. Please try again.' };
    }
  };

  const signup = async ({ fullName, email, password }) => {
    const safeName = (fullName || '').trim();
    const safeEmail = (email || '').trim().toLowerCase();

    if (!safeName) {
      return { success: false, message: 'Full name is required for signup.' };
    }

    if (safeName.length < 2) {
      return { success: false, message: 'Full name must be at least 2 characters long.' };
    }

    if (!safeEmail) {
      return { success: false, message: 'Email is required for signup.' };
    }

    if (!isValidGmailAddress(safeEmail)) {
      return { success: false, message: 'Enter a valid Gmail address.' };
    }

    const passwordError = getPasswordValidationMessage(password || '');
    if (passwordError) {
      return { success: false, message: passwordError };
    }

    try {
      const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '{}');
      if (accounts[safeEmail]) {
        return { success: false, message: 'An account already exists for this Gmail address. Please log in.' };
      }

      const { salt, hash } = await hashPassword(password);
      accounts[safeEmail] = { fullName: safeName, salt, passwordHash: hash };
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));

      return { success: true, message: 'Account created successfully.' };
    } catch (error) {
      console.error('Failed to create account', error);
      return { success: false, message: 'Unable to create account. Please try again.' };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setPendingCouponCode(null);
  };

  // Execute Search
  const handleSearch = (from, to, date) => {
    const newDate = clampTravelDate(date, defaultDateStr);
    setSearchParams({ fromCity: from, toCity: to, date: newDate });
    const results = getBusesForRoute(from, to, newDate);
    setBuses(results);
    setSelectedBusId(null);
    setSelectedSeats([]);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch back to Home
  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedBusId(null);
    setSelectedSeats([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle seat selection
  const toggleSeat = (bus, seat) => {
    if (selectedBusId !== bus.id) {
      // Switching bus selection resets seats
      setSelectedBusId(bus.id);
      setSelectedSeats([seat]);
      setSelectedBoarding(bus.boardingPoints[0]);
      setSelectedDropping(bus.droppingPoints[1] || bus.droppingPoints[0]);
      return;
    }

    const alreadySelected = selectedSeats.some(s => s.id === seat.id);
    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats at once.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Proceed to Checkout
  const proceedToCheckout = (bus) => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }
    const bookingPayload = {
      bus,
      seats: selectedSeats,
      boardingPoint: selectedBoarding || bus.boardingPoints[0],
      droppingPoint: selectedDropping || bus.droppingPoints[0],
      date: searchParams.date,
      fromCity: searchParams.fromCity,
      toCity: searchParams.toCity,
      totalFare: selectedSeats.reduce((sum, s) => sum + s.price, 0)
    };
    setActiveBookingData(bookingPayload);
    setBoardingPointsModalOpen(true);
  };

  const continueToPassengerInfo = () => {
    if (!activeBookingData) {
      return;
    }
    setBoardingPointsModalOpen(false);
    setPassengerInfoModalOpen(true);
  };

  const continueToBookingLogin = (passengerInfo) => {
    if (!activeBookingData) {
      return;
    }
    setActiveBookingData(prev => ({ ...prev, ...passengerInfo }));
    setPassengerInfoModalOpen(false);
    setCheckoutModalOpen(true);
  };

  // Finalize booking
  const completeBooking = (bookingDetails) => {
    const pnr = 'RB' + Math.floor(100000000 + Math.random() * 900000000);
    const ticketId = 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const finalTicket = {
      ...bookingDetails,
      pnr,
      ticketId,
      bookingTime: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      status: 'CONFIRMED'
    };

    setMyBookings(prev => [finalTicket, ...prev]);
    setConfirmedBooking(finalTicket);
    setCheckoutModalOpen(false);
    setSelectedSeats([]);
    setConfirmationModalOpen(true);
  };

  // Cancel booking
  const cancelBooking = (ticketId) => {
    setMyBookings(prev => prev.map(t => {
      if (t.ticketId === ticketId) {
        return { ...t, status: 'CANCELLED', refundStatus: 'Refund initiated (₹' + Math.round(t.finalAmount * 0.9) + ')' };
      }
      return t;
    }));
  };

  return (
    <AccountContext.Provider
      value={{
        searchParams,
        setSearchParams,
        currentView,
        setCurrentView,
        navigateToHome,
        buses,
        handleSearch,
        selectedBusId,
        setSelectedBusId,
        selectedSeats,
        setSelectedSeats,
        selectedBoarding,
        setSelectedBoarding,
        selectedDropping,
        setSelectedDropping,
        toggleSeat,
        proceedToCheckout,
        checkoutModalOpen,
        setCheckoutModalOpen,
        activeBookingData,
        completeBooking,
        confirmedBooking,
        confirmationModalOpen,
        setConfirmationModalOpen,
        myBookingsModalOpen,
        setMyBookingsModalOpen,
        myBookings,
        cancelBooking,
        helpModalOpen,
        setHelpModalOpen,
        boardingPointsModalOpen,
        setBoardingPointsModalOpen,
        continueToPassengerInfo,
        passengerInfoModalOpen,
        setPassengerInfoModalOpen,
        bookingLoginPending,
        setBookingLoginPending,
        pendingCouponCode,
        setPendingCouponCode,
        couponPromptModalOpen,
        setCouponPromptModalOpen,
        promptCouponCode,
        setPromptCouponCode,
        promptLoginForCoupon,
        continueToBookingLogin,
        loginModalOpen,
        setLoginModalOpen,
        signupModalOpen,
        setSignupModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        userProfile,
        setUserProfile,
        isLoggedIn,
        setIsLoggedIn,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
