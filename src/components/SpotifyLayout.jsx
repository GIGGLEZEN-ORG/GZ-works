import React, { useRef, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PlayerBar from './PlayerBar';
import HomeView from './HomeView';
import SearchView from './SearchView';
import PlaylistView from './PlaylistView';
import ArtistView from './ArtistView';
import LikedSongsView from './LikedSongsView';
import LibraryView from './LibraryView';
import LyricsView from './LyricsView';
import QueueDrawer from './QueueDrawer';
import DevicePickerModal from './DevicePickerModal';
import CreatePlaylistModal from './CreatePlaylistModal';
import NotificationToast from './NotificationToast';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import ProfileModal from './ProfileModal';
import { Home, Search, Library, Heart } from 'lucide-react';

export default function SpotifyLayout() {
  const { currentView, currentTrack, navigate, t } = useMusic();
  const mainScrollRef = useRef(null);

  // Scroll to top on view change
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'playlist':
        return <PlaylistView />;
      case 'artist':
        return <ArtistView />;
      case 'liked':
        return <LikedSongsView />;
      case 'library':
        return <LibraryView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden select-none font-sans">
      {/* Top Workspace Area */}
      <div className="flex-1 flex gap-2 p-2 min-h-0 overflow-hidden">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:flex h-full">
          <Sidebar />
        </div>

        {/* Main Center Stage */}
        <div className="flex-1 flex flex-col bg-[#121212] rounded-lg overflow-hidden relative">
          <TopBar ambientColor={currentTrack?.dominantColor} />
          
          <main 
            ref={mainScrollRef} 
            className="flex-1 overflow-y-auto overflow-x-hidden relative"
          >
            {renderCurrentView()}
          </main>
        </div>

        {/* Optional Right Queue Drawer */}
        <QueueDrawer />
      </div>

      {/* Mobile Bottom Navigation Bar (Shown on screens < md) */}
      <div className="md:hidden flex items-center justify-around bg-[#121212]/95 border-t border-white/10 py-2.5 px-4 z-40">
        <button
          onClick={() => navigate('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentView === 'home' ? 'text-white' : 'text-[#a7a7a7]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{t('Home')}</span>
        </button>

        <button
          onClick={() => navigate('search')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentView === 'search' ? 'text-white' : 'text-[#a7a7a7]'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>{t('Search')}</span>
        </button>

        <button
          onClick={() => navigate('library')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentView === 'library' ? 'text-white' : 'text-[#a7a7a7]'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>{t('Your Library')}</span>
        </button>

        <button
          onClick={() => navigate('liked')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentView === 'liked' ? 'text-[#1ed760]' : 'text-[#a7a7a7]'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>{t('Liked Songs')}</span>
        </button>
      </div>

      {/* Bottom Persistent Player */}
      <PlayerBar />

      {/* Fullscreen Lyrics Overlay */}
      <LyricsView />

      {/* Global Modals & Notifications */}
      <DevicePickerModal />
      <CreatePlaylistModal />
      <LoginModal />
      <SignupModal />
      <ProfileModal />
      <NotificationToast />
    </div>
  );
}
