import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import Navbar from './components/Navbar';
import SearchHero from './components/SearchHero';
import PromoOffers from './components/PromoOffers';
import RtcSection from './components/RtcSection';
import FeaturesSection from './components/FeaturesSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import SearchResults from './components/BusList/SearchResults';
import CheckoutModal from './components/Booking/CheckoutModal';
import TicketConfirmationModal from './components/Booking/TicketConfirmationModal';
import MyBookingsModal from './components/Booking/MyBookingsModal';
import HelpModal from './components/Booking/HelpModal';
import BoardingPointsModal from './components/Booking/BoardingPointsModal';
import PassengerInfoModal from './components/Booking/PassengerInfoModal';
import CouponPromptModal from './components/Booking/CouponPromptModal';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import ProfileModal from './components/ProfileModal';

function MainContent() {
  const { currentView } = useBooking();

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f7]">
      <Navbar />

      <main className={`flex-1 ${currentView === 'home' ? 'pb-20 md:pb-0' : ''}`}>
        {currentView === 'home' ? (
          <>
            <SearchHero />
            <PromoOffers />
            <RtcSection />
            <FeaturesSection />
            <FaqSection />
          </>
        ) : (
          <SearchResults />
        )}
      </main>

      <Footer />

      {/* Global Modals */}
      <CheckoutModal />
      <TicketConfirmationModal />
      <MyBookingsModal />
      <HelpModal />
      <BoardingPointsModal />
      <PassengerInfoModal />
      <CouponPromptModal />
      <LoginModal />
      <SignupModal />
      <ProfileModal />
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <MainContent />
    </BookingProvider>
  );
}
