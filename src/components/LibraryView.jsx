import React, { useState } from 'react';
import { LayoutGrid, List, Search, Heart, Plus, Play, Pause } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ALL_SONGS } from '../data/musicData';

export default function LibraryView() {
  const { 
    playlists, 
    likedTrackIds, 
    navigate, 
    setIsCreatePlaylistOpen, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay 
  } = useMusic();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'playlists' | 'artists'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');

  const filteredPlaylists = playlists.filter(pl => 
    pl.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 select-none pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Your Library
        </h1>

        <button
          onClick={() => setIsCreatePlaylistOpen(true)}
          className="flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Create playlist</span>
        </button>
      </div>

      {/* Filter and View Mode Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'all' ? 'bg-white text-black' : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('playlists')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'playlists' ? 'bg-white text-black' : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            Playlists
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#a7a7a7] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in Library"
              className="w-full bg-[#242424] text-xs text-white pl-8 pr-3 py-1.5 rounded-full placeholder-[#727272] focus:outline-none focus:ring-1 focus:ring-white transition-all"
            />
          </div>

          {/* Grid / List toggle */}
          <div className="flex items-center bg-[#232323] rounded-full p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'grid' ? 'bg-[#333333] text-white' : 'text-[#a7a7a7] hover:text-white'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'list' ? 'bg-[#333333] text-white' : 'text-[#a7a7a7] hover:text-white'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* Liked Songs Special Card */}
          <div
            onClick={() => navigate('liked')}
            className="music-card group relative p-4 bg-gradient-to-br from-indigo-800 via-purple-800 to-emerald-700 hover:brightness-110 rounded-lg cursor-pointer transition-all duration-300 flex flex-col justify-end min-h-[220px] shadow-lg col-span-2"
          >
            <div className="space-y-1 z-10">
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                Pinned Playlist
              </span>
              <h3 className="text-2xl font-black text-white">
                Liked Songs
              </h3>
              <p className="text-xs text-white/80 font-medium">
                {likedTrackIds.length} liked songs
              </p>
            </div>
          </div>

          {/* Playlists */}
          {filteredPlaylists.map((pl) => {
            const isPlayingThis = currentTrack && pl.songIds.includes(currentTrack.id) && isPlaying;
            const plSongs = ALL_SONGS.filter(s => pl.songIds.includes(s.id));

            return (
              <div
                key={pl.id}
                onClick={() => navigate('playlist', pl.id)}
                className="music-card group p-4 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-all duration-300 flex flex-col relative"
              >
                <div className="relative mb-4 aspect-square w-full rounded-md overflow-hidden shadow-lg">
                  <img 
                    src={pl.coverArt} 
                    alt={pl.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPlayingThis) {
                        togglePlay();
                      } else if (plSongs.length > 0) {
                        playTrack(plSongs[0], plSongs);
                      }
                    }}
                    className={`absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-spotify-green transition-all duration-200 ${
                      isPlayingThis 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105'
                    }`}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-5 h-5 fill-black" />
                    ) : (
                      <Play className="w-5 h-5 fill-black translate-x-0.5" />
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-sm text-white truncate mb-1">
                  {pl.title}
                </h3>
                <p className="text-xs text-[#a7a7a7] truncate">
                  Playlist • {pl.owner || 'You'}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-1">
          {/* Liked songs list item */}
          <div
            onClick={() => navigate('liked')}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-700 via-purple-700 to-emerald-400 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 fill-white text-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-white">Liked Songs</span>
              <span className="text-xs text-[#a7a7a7]">Playlist • {likedTrackIds.length} songs</span>
            </div>
          </div>

          {filteredPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigate('playlist', pl.id)}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors"
            >
              <img 
                src={pl.coverArt} 
                alt={pl.title} 
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-white truncate">{pl.title}</span>
                <span className="text-xs text-[#a7a7a7]">Playlist • {pl.owner || 'You'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
