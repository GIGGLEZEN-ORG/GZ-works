import React from 'react';
import { MusicProvider } from './context/MusicContext';
import { BookingProvider } from './context/BookingContext';
import SpotifyLayout from './components/SpotifyLayout';

export default function App() {
  return (
    <BookingProvider>
      <MusicProvider>
        <SpotifyLayout />
      </MusicProvider>
    </BookingProvider>
  );
}
