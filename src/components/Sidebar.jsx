import React from 'react';
import { 
  Home, 
  Library, 
  Plus, 
  Heart, 
  Compass,
  Music2,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function Sidebar() {
  const { 
    currentView, 
    navigate, 
    playlists, 
    setIsCreatePlaylistOpen,
    setSelectedMusicLanguage,
    t
  } = useMusic();

  return (
    <aside className="playmusic-sidebar flex-shrink-0 flex flex-col gap-3 h-full select-none">
      {/* Brand & Main Nav */}
      <div className="playmusic-sidebar-card glass-panel rounded-2xl p-4 flex flex-col gap-4 border border-white/[0.08] shadow-xl">
        {/* App Logo */}
        <button
          type="button"
          onClick={() => {
            setSelectedMusicLanguage('All');
            navigate('home');
          }}
          className="playmusic-brand flex items-center gap-3 cursor-pointer group px-2 py-1 text-left"
          aria-label="PlayMusic home, show all languages"
          title="Go to Home and show all languages"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1ed760] via-[#2cd86b] to-[#38ef7d] flex items-center justify-center shadow-[0_0_15px_rgba(30,215,96,0.35)] group-hover:scale-105 transition-transform duration-300">
            <Music2 className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              PlayMusic
            </span>
            <span className="text-[10px] font-medium text-[#9ca3af] -mt-1 tracking-wider uppercase">
              Music for Everyone
            </span>
          </div>
        </button>

        {/* Primary Links */}
        <nav className="flex flex-col gap-1 text-sm font-semibold">
          <button 
            onClick={() => navigate('home')}
            className={`playmusic-nav-link flex items-center gap-3.5 px-3 py-1 rounded-xl transition-all duration-200 text-left ${
              currentView === 'home' 
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/15' 
                : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-[#1ed760]' : ''}`} />
            <span>{t('Home')}</span>
          </button>

          <button 
            onClick={() => navigate('search')}
            className={`playmusic-nav-link flex items-center gap-3.5 px-3 py-1 rounded-xl transition-all duration-200 text-left ${
              currentView === 'search' 
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/15' 
                : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className={`w-5 h-5 ${currentView === 'search' ? 'text-[#1ed760]' : ''}`} />
            <span>{t('Discover')}</span>
          </button>

          <button 
            onClick={() => navigate('library')}
            className={`playmusic-nav-link flex items-center gap-3.5 px-3 py-1 rounded-xl transition-all duration-200 text-left ${
              currentView === 'library' 
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/15' 
                : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            <Library className={`w-5 h-5 ${currentView === 'library' ? 'text-[#1ed760]' : ''}`} />
            <span>{t('Your Library')}</span>
          </button>

          <button 
            onClick={() => navigate('liked')}
            className={`playmusic-nav-link flex items-center gap-3.5 px-3 py-1 rounded-xl transition-all duration-200 text-left ${
              currentView === 'liked' 
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/15' 
                : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Heart className="w-3 h-3 text-white fill-current" />
            </div>
            <span>{t('Liked Songs')}</span>
          </button>
        </nav>

      </div>

      {/* Playlists Box */}
      <div className="playmusic-playlist-panel glass-panel rounded-2xl p-3.5 flex-1 flex flex-col min-h-0 overflow-hidden border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">
            Playlists
          </span>
          <button 
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="p-1 rounded-lg hover:bg-white/10 text-[#9ca3af] hover:text-white transition-colors"
            title="Create playlist"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Playlist Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {playlists.map(pl => (
            <div
              key={pl.id}
              onClick={() => navigate('playlist', pl.id)}
              className="playmusic-playlist-link group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all hover:bg-white/10"
            >
              <img 
                src={pl.coverArt} 
                alt={pl.title}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-sm border border-white/5 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white group-hover:text-[#1ed760] transition-colors truncate">
                  {pl.title}
                </span>
                <span className="text-[11px] text-[#9ca3af] truncate">
                  Playlist • {pl.songIds?.length || 0} songs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
