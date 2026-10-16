import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Bookmark, 
  ArrowRight, 
  FolderPlus,
  Compass,
  ListMusic,
  Check
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function Sidebar() {
  const { 
    currentView, 
    currentViewData,
    navigate, 
    playlists, 
    likedTrackIds, 
    setIsCreatePlaylistOpen,
    activePlaylistId,
    t
  } = useMusic();

  const [libraryFilter, setLibraryFilter] = useState('all'); // 'all' | 'playlists' | 'artists'
  const [librarySearch, setLibrarySearch] = useState('');

  const filteredPlaylists = playlists.filter(pl => 
    pl.title.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <aside className="w-72 lg:w-80 flex-shrink-0 flex flex-col gap-2 h-full select-none">
      {/* Top Nav Box */}
      <div className="bg-[#121212] rounded-lg p-5 flex flex-col gap-5">
        {/* playmusic Logo */}
        <div 
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-white font-bold text-xl cursor-pointer tracking-tight hover:opacity-90 transition-opacity"
        >
          <img
            src="/playmusic-logo.png"
            alt=""
            className="w-8 h-8 rounded-md object-cover"
          />
          <span className="text-xl font-bold tracking-tight">playmusic</span>
        </div>

        {/* Primary Links */}
        <nav className="flex flex-col gap-4 text-sm font-semibold">
          <button 
            onClick={() => navigate('home')}
            className={`music-control flex items-center gap-4 transition-colors duration-200 text-left ${
              currentView === 'home' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Home className={`w-6 h-6 ${currentView === 'home' ? 'text-white' : ''}`} />
            <span>{t('Home')}</span>
          </button>

          <button 
            onClick={() => navigate('search')}
            className={`music-control flex items-center gap-4 transition-colors duration-200 text-left ${
              currentView === 'search' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Search className={`w-6 h-6 ${currentView === 'search' ? 'text-white' : ''}`} />
            <span>{t('Search')}</span>
          </button>
        </nav>
      </div>

      {/* Library Box */}
      <div className="bg-[#121212] rounded-lg p-3 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Library Header */}
        <div className="flex items-center justify-between px-3 py-2 text-[#b3b3b3]">
          <button 
            onClick={() => navigate('library')}
            className={`flex items-center gap-3 transition-colors hover:text-white font-semibold text-sm ${
              currentView === 'library' ? 'text-white' : ''
            }`}
          >
            <Library className="w-6 h-6" />
            <span>{t('Your Library')}</span>
          </button>

          <button 
            onClick={() => setIsCreatePlaylistOpen(true)}
            title="Create playlist or folder"
            className="music-control p-1.5 hover:bg-[#282828] hover:text-white rounded-full transition-all text-[#b3b3b3]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-3 py-2">
          <button 
            onClick={() => setLibraryFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              libraryFilter === 'all' 
                ? 'bg-white text-black' 
                : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            {t('Playlists')}
          </button>
          <button 
            onClick={() => navigate('search')}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#232323] text-white hover:bg-[#2a2a2a] transition-all"
          >
            {t('Artists')}
          </button>
        </div>

        {/* Library Search input */}
        <div className="px-3 py-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#a7a7a7] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              placeholder={t('Search in Your Library')}
              className="w-full bg-[#242424] text-xs text-white pl-8 pr-3 py-1.5 rounded-full placeholder-[#727272] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>
        </div>

        {/* Playlists & Liked Songs Scroll List */}
        <div className="flex-1 overflow-y-auto px-1 mt-1 space-y-0.5">
          {/* Liked Songs Special Item */}
          <div 
            onClick={() => navigate('liked')}
            className={`music-card flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors group ${
              currentView === 'liked' ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'
            }`}
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-700 via-purple-700 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-md">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-sm font-semibold truncate ${
                currentView === 'liked' ? 'text-[#1ed760]' : 'text-white'
              }`}>
                {t('Liked Songs')}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#a7a7a7]">
                <span className="text-[#1ed760]">📌</span>
                <span>Playlist • {likedTrackIds.length} {t('songs')}</span>
              </div>
            </div>
          </div>

          {/* User & Default Playlists */}
          {filteredPlaylists.map((pl) => {
            const isSelected = currentView === 'playlist' && currentViewData === pl.id;

            return (
              <div 
                key={pl.id}
                onClick={() => navigate('playlist', pl.id)}
                className={`music-card flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors group ${
                  isSelected ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                <img 
                  src={pl.coverArt} 
                  alt={pl.title}
                  className="w-12 h-12 rounded object-cover flex-shrink-0 shadow-sm"
                />
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm font-semibold truncate ${
                    isSelected ? 'text-[#1ed760]' : 'text-white group-hover:text-white'
                  }`}>
                    {pl.title}
                  </span>
                  <span className="text-xs text-[#a7a7a7] truncate">
                    Playlist • {pl.owner || 'playmusic'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA for Quick Playlist Create */}
        <div className="p-3 bg-[#1e1e1e]/60 rounded-lg mt-2 text-xs flex flex-col gap-2">
          <p className="font-semibold text-white">{t('Create your first playlist')}</p>
          <p className="text-[#a7a7a7]">{t("It's easy, we'll help you")}</p>
          <button 
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="w-fit bg-white text-black font-bold px-4 py-1.5 rounded-full hover:scale-105 transition-transform text-xs"
          >
            {t('Create playlist')}
          </button>
        </div>
      </div>
    </aside>
  );
}
