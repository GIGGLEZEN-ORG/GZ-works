import React from 'react';
import { MusicProvider } from './context/MusicContext';
import { AccountProvider } from './context/AccountContext';
import SpotifyLayout from './components/SpotifyLayout';

export default function App() {
  return (
    <AccountProvider>
      <MusicProvider>
        <SpotifyLayout />
      </MusicProvider>
    </AccountProvider>
  );
}
