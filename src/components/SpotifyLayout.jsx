import React, { useRef, useEffect, useState } from 'react';
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
import { Home, Compass, Library, Heart, Radio, ChevronUp, Music2 } from 'lucide-react';

export default function SpotifyLayout() {
  const { currentView, currentTrack, navigate, t } = useMusic();
  const mainScrollRef = useRef(null);
  const [isPlayerHidden, setIsPlayerHidden] = useState(false);

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

  const ambientColor = currentTrack?.dominantColor || '#8b5cf6';

  return (
    <div className="playmusic-shell h-screen w-screen flex flex-col text-white overflow-hidden select-none font-sans relative">
      {/* Dynamic Ambient Glow Mesh */}
      <div
        aria-hidden="true"
        className="playmusic-ambient playmusic-ambient-a pointer-events-none fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-1000 ease-out"
        style={{ backgroundColor: ambientColor }}
      />
      <div
        aria-hidden="true"
        className="playmusic-ambient playmusic-ambient-b pointer-events-none fixed top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[160px] transition-all duration-1000 ease-out"
        style={{ backgroundColor: ambientColor }}
      />

      {/* Main Workspace Frame */}
      <div className="playmusic-workspace relative flex-1 flex min-h-0 overflow-hidden z-10">
        {/* Desktop Left Glass Sidebar */}
        <div className="playmusic-sidebar-wrap hidden md:flex h-full">
          <Sidebar />
        </div>

        {/* Center Main Stage */}
        <div className="playmusic-main-panel flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden relative shadow-2xl border border-white/[0.08]">
          <TopBar ambientColor={ambientColor} />
          
          <main 
            ref={mainScrollRef} 
            className="playmusic-content flex-1 overflow-y-auto overflow-x-hidden relative pb-28 md:pb-28"
          >
            {renderCurrentView()}
          </main>
        </div>

        {/* Right Queue Drawer */}
        <QueueDrawer />
      </div>

      {/* Floating Bottom Island Player Dock */}
      {isPlayerHidden ? (
        <button
          type="button"
          onClick={() => setIsPlayerHidden(false)}
          className="fixed bottom-20 right-4 sm:bottom-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-[#11131a]/95 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xl transition-colors hover:bg-[#20232c]"
          aria-label="Show player"
          title="Show player"
        >
          <Music2 className="h-4 w-4 text-[#1ed760]" />
          <span className="max-w-28 truncate">{currentTrack?.title || 'Show player'}</span>
          <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
        </button>
      ) : (
        <div className="playmusic-player-dock fixed z-50 pointer-events-auto">
          <PlayerBar onHide={() => setIsPlayerHidden(true)} />
        </div>
      )}

      {/* Mobile Bottom Bar for tiny screens */}
      <div className="playmusic-mobile-nav md:hidden flex items-center justify-around backdrop-blur-xl border-t py-2.5 px-4 z-40">
        <button
          onClick={() => navigate('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            currentView === 'home' ? 'text-[#1ed760]' : 'text-[#a7a7a7]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{t('Home')}</span>
        </button>

        <button
          onClick={() => navigate('search')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            currentView === 'search' ? 'text-[#1ed760]' : 'text-[#a7a7a7]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>{t('Search')}</span>
        </button>

        <button
          onClick={() => navigate('library')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            currentView === 'library' ? 'text-[#1ed760]' : 'text-[#a7a7a7]'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>{t('Your Library')}</span>
        </button>

        <button
          onClick={() => navigate('liked')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            currentView === 'liked' ? 'text-[#1ed760]' : 'text-[#a7a7a7]'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>{t('Liked')}</span>
        </button>
      </div>

      {/* Overlays, Lyrics & Modals */}
      <LyricsView />
      <DevicePickerModal />
      <CreatePlaylistModal />
      <NotificationToast />
      <LoginModal />
      <SignupModal />
      <ProfileModal />
    </div>
  );
}
