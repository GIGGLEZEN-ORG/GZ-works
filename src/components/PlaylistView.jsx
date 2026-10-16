import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Clock, 
  MoreHorizontal, 
  ArrowDownCircle, 
  Search, 
  ListFilter,
  Check,
  Plus,
  Trash2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ALL_SONGS } from '../data/musicData';
import SongOptionsMenu from './SongOptionsMenu';

export default function PlaylistView() {
  const { 
    currentViewData, 
    getPlaylistById, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    isTrackLiked, 
    toggleLikeTrack,
    navigate,
    showToast,
    playlists,
    deletePlaylist
  } = useMusic();

  const [filterQuery, setFilterQuery] = useState('');
  const [activeMenuSongId, setActiveMenuSongId] = useState(null);
  const [isPlaylistMenuOpen, setIsPlaylistMenuOpen] = useState(false);

  const playlist = getPlaylistById(currentViewData) || playlists[0];
  if (!playlist) return null;

  const playlistSongs = ALL_SONGS.filter(s => playlist.songIds.includes(s.id));
  const filteredSongs = playlistSongs.filter(s => 
    s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const isPlaylistPlaying = currentTrack && playlist.songIds.includes(currentTrack.id) && isPlaying;

  const totalDurationSecs = playlistSongs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalMins = Math.floor(totalDurationSecs / 60);

  const handlePlayAll = () => {
    if (isPlaylistPlaying) {
      togglePlay();
    } else if (playlistSongs.length > 0) {
      playTrack(playlistSongs[0], playlistSongs);
    }
  };

  return (
    <div className="relative min-h-full select-none pb-12">
      {/* Dynamic Ambient Background Gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-96 opacity-40 blur-3xl -z-10 transition-colors duration-700"
        style={{ backgroundColor: playlist.gradientColor || '#284b63' }}
      />

      {/* Playlist Hero Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 pt-8">
        <img 
          src={playlist.coverArt} 
          alt={playlist.title} 
          className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-md shadow-spotify-elevated flex-shrink-0"
        />

        <div className="flex flex-col gap-2 text-center md:text-left min-w-0">
          <span className="text-xs uppercase font-extrabold tracking-wider text-white">
            Playlist
          </span>
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-none break-words">
            {playlist.title}
          </h1>
          <p className="text-sm text-[#b3b3b3] mt-2 line-clamp-2">
            {playlist.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-1 text-xs text-white font-semibold mt-2 flex-wrap">
            <span className="font-bold text-white hover:underline cursor-pointer">{playlist.owner}</span>
            <span className="text-[#a7a7a7]">•</span>
            <span className="text-[#b3b3b3]">{playlist.likesCount}</span>
            <span className="text-[#a7a7a7]">•</span>
            <span className="text-[#b3b3b3]">{playlistSongs.length} songs,</span>
            <span className="text-[#a7a7a7]">{totalMins} min</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="sticky top-0 z-20 flex flex-col items-stretch gap-3 border-b border-white/5 bg-[#121212] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 md:px-8">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Big Green Play Button */}
          <button
            onClick={handlePlayAll}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-spotify-green transition-all hover:scale-105 hover:bg-[#1fdf64] active:scale-95 sm:h-14 sm:w-14"
            title="Play"
          >
            {isPlaylistPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black translate-x-0.5" />
            )}
          </button>

          {/* Heart button */}
          <button 
            onClick={() => showToast("Saved to your Library")}
            className="flex h-10 w-10 items-center justify-center text-[#a7a7a7] transition-all hover:scale-105 hover:text-white"
            title="Save to Your Library"
          >
            <Heart className="h-6 w-6 hover:text-white sm:h-8 sm:w-8" />
          </button>

          {/* Download button */}
          <button 
            onClick={() => showToast("Downloaded for offline playback")}
            className="flex h-10 w-10 items-center justify-center text-[#a7a7a7] transition-all hover:scale-105 hover:text-white"
            title="Download"
          >
            <ArrowDownCircle className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {playlist.owner === 'You' && (
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsPlaylistMenuOpen(open => !open)}
                className="flex h-10 w-10 items-center justify-center text-[#a7a7a7] transition-all hover:scale-105 hover:text-white"
                title="Playlist options"
                aria-label="Playlist options"
                aria-expanded={isPlaylistMenuOpen}
              >
                <MoreHorizontal className="h-7 w-7 sm:h-8 sm:w-8" />
              </button>
              {isPlaylistMenuOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-md border border-white/10 bg-[#282828] p-1 shadow-2xl z-30">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${playlist.title}"? This cannot be undone.`)) {
                        deletePlaylist(playlist.id);
                      }
                      setIsPlaylistMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded px-3 py-2.5 text-left text-xs text-white transition-colors hover:bg-[#3e3e3e]"
                  >
                    <Trash2 className="h-4 w-4 text-[#f87171]" />
                    Delete playlist
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search within playlist */}
        <div className="relative w-full sm:w-48 lg:w-60">
          <Search className="w-3.5 h-3.5 text-[#a7a7a7] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Find in playlist"
            className="w-full rounded-full bg-[#242424] py-2 pl-8 pr-3 text-sm text-white placeholder-[#727272] transition-all focus:outline-none focus:ring-1 focus:ring-white sm:py-1.5 sm:text-xs"
          />
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="px-6 md:px-8 mt-2">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-[#a7a7a7] uppercase tracking-wider">
          <div className="col-span-1 flex items-center justify-center">#</div>
          <div className="col-span-6 md:col-span-5">Title</div>
          <div className="hidden md:block col-span-3">Album</div>
          <div className="hidden lg:block col-span-2">Date added</div>
          <div className="col-span-5 md:col-span-3 lg:col-span-1 flex items-center justify-end pr-4">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Songs Rows */}
        <div className="mt-2 space-y-1">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-12 text-[#a7a7a7] text-sm">
              No songs found matching "{filterQuery}"
            </div>
          ) : (
            filteredSongs.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              const isSongPlaying = isCurrent && isPlaying;
              const isLiked = isTrackLiked(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, playlistSongs)}
                  className={`group grid grid-cols-12 gap-4 px-4 py-2.5 rounded-md hover:bg-[#282828] cursor-pointer items-center transition-colors text-sm ${
                    isCurrent ? 'bg-[#282828]/60' : ''
                  }`}
                >
                  {/* # or Play button or Equalizer animation */}
                  <div className="col-span-1 flex items-center justify-center">
                    {isSongPlaying ? (
                      <div className="flex items-end gap-0.5 h-4 w-4 justify-center">
                        <span className="w-1 bg-[#1ed760] rounded-sm animate-equalizer-1"></span>
                        <span className="w-1 bg-[#1ed760] rounded-sm animate-equalizer-2"></span>
                        <span className="w-1 bg-[#1ed760] rounded-sm animate-equalizer-3"></span>
                      </div>
                    ) : (
                      <>
                        <span className={`text-xs group-hover:hidden ${
                          isCurrent ? 'text-[#1ed760] font-bold' : 'text-[#a7a7a7]'
                        }`}>
                          {index + 1}
                        </span>
                        <Play className="w-4 h-4 text-white fill-white hidden group-hover:block translate-x-0.5" />
                      </>
                    )}
                  </div>

                  {/* Title & Artist & Thumbnail */}
                  <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                    <img 
                      src={song.coverArt} 
                      alt={song.title} 
                      className="w-10 h-10 rounded object-cover flex-shrink-0 shadow-sm"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className={`font-semibold truncate ${
                        isCurrent ? 'text-[#1ed760]' : 'text-white'
                      }`}>
                        {song.title}
                      </span>
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('artist', song.artistId);
                        }}
                        className="text-xs text-[#a7a7a7] hover:underline hover:text-white truncate"
                      >
                        {song.artist}
                      </span>
                    </div>
                  </div>

                  {/* Album */}
                  <div className="hidden md:block col-span-3 text-xs text-[#a7a7a7] hover:text-white hover:underline truncate">
                    {song.album}
                  </div>

                  {/* Date Added */}
                  <div className="hidden lg:block col-span-2 text-xs text-[#a7a7a7]">
                    {song.releaseDate ? `${song.releaseDate} release` : '3 days ago'}
                  </div>

                  {/* Like Button & Duration & Menu */}
                  <div className="col-span-5 md:col-span-3 lg:col-span-1 flex items-center justify-end gap-2.5 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeTrack(song.id);
                      }}
                      className="text-[#a7a7a7] hover:text-white p-1"
                    >
                      <Heart className={`w-4 h-4 ${
                        isLiked ? 'fill-[#1ed760] text-[#1ed760]' : 'opacity-0 group-hover:opacity-100'
                      }`} />
                    </button>
                    <span className="text-xs text-[#a7a7a7]">
                      {song.durationFormatted}
                    </span>
                    <SongOptionsMenu song={song} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
