import React, { useState } from 'react';
import { Play, Pause, Heart, Clock, Search } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ALL_SONGS } from '../data/musicData';
import SongOptionsMenu from './SongOptionsMenu';

export default function LikedSongsView() {
  const { 
    likedTrackIds, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    toggleLikeTrack,
    navigate 
  } = useMusic();

  const [filterQuery, setFilterQuery] = useState('');

  const likedSongs = ALL_SONGS.filter(s => likedTrackIds.includes(s.id));
  const filteredSongs = likedSongs.filter(s => 
    s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const isLikedPlaying = currentTrack && likedTrackIds.includes(currentTrack.id) && isPlaying;

  const totalDurationSecs = likedSongs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalMins = Math.floor(totalDurationSecs / 60);

  const handlePlayAll = () => {
    if (isLikedPlaying) {
      togglePlay();
    } else if (likedSongs.length > 0) {
      playTrack(likedSongs[0], likedSongs);
    }
  };

  return (
    <div className="relative min-h-full select-none pb-12">
      {/* Ambient Gradient Header */}
      <div className="absolute top-0 left-0 right-0 h-96 opacity-40 blur-3xl -z-10 bg-gradient-to-b from-indigo-800 to-emerald-900" />

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 pt-8">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-md bg-gradient-to-br from-indigo-700 via-purple-700 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-spotify-elevated">
          <Heart className="w-20 h-20 fill-white text-white drop-shadow-lg" />
        </div>

        <div className="flex flex-col gap-2 text-center md:text-left min-w-0">
          <span className="text-xs uppercase font-extrabold tracking-wider text-white">
            Playlist
          </span>
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-none">
            Liked Songs
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-1 text-xs text-white font-semibold mt-3">
            <span className="font-bold">You</span>
            <span className="text-[#a7a7a7]">•</span>
            <span>{likedSongs.length} songs,</span>
            <span className="text-[#a7a7a7]">{totalMins} min</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-[#121212]/40 backdrop-blur-sm sticky top-[64px] z-20">
        <div className="flex items-center gap-6">
          <button
            onClick={handlePlayAll}
            disabled={likedSongs.length === 0}
            className="w-14 h-14 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-spotify-green transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isLikedPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black translate-x-0.5" />
            )}
          </button>
        </div>

        {likedSongs.length > 0 && (
          <div className="relative hidden sm:block w-48 lg:w-60">
            <Search className="w-3.5 h-3.5 text-[#a7a7a7] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Find in Liked Songs"
              className="w-full bg-[#242424]/80 text-xs text-white pl-8 pr-3 py-1.5 rounded-full placeholder-[#727272] focus:outline-none focus:ring-1 focus:ring-white transition-all"
            />
          </div>
        )}
      </div>

      {/* Songs Table */}
      <div className="px-6 md:px-8 mt-2">
        {likedSongs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#282828] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#727272]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Songs you like will appear here
            </h3>
            <p className="text-sm text-[#a7a7a7] mb-6">
              Save songs by tapping the heart icon as you listen.
            </p>
            <button
              onClick={() => navigate('search')}
              className="bg-white text-black font-bold text-xs px-6 py-2.5 rounded-full hover:scale-105 transition-transform"
            >
              Find songs
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-[#a7a7a7] uppercase tracking-wider">
              <div className="col-span-1 flex items-center justify-center">#</div>
              <div className="col-span-6 md:col-span-5">Title</div>
              <div className="hidden md:block col-span-3">Album</div>
              <div className="hidden lg:block col-span-2">Date added</div>
              <div className="col-span-5 md:col-span-3 lg:col-span-1 flex items-center justify-end pr-4">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2 space-y-1">
              {filteredSongs.map((song, index) => {
                const isCurrent = currentTrack?.id === song.id;
                const isSongPlaying = isCurrent && isPlaying;

                return (
                  <div
                    key={song.id}
                    onClick={() => playTrack(song, likedSongs)}
                    className={`group grid grid-cols-12 gap-4 px-4 py-2.5 rounded-md hover:bg-[#282828] cursor-pointer items-center transition-colors text-sm ${
                      isCurrent ? 'bg-[#282828]/60' : ''
                    }`}
                  >
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

                    <div className="hidden md:block col-span-3 text-xs text-[#a7a7a7] hover:text-white hover:underline truncate">
                      {song.album}
                    </div>

                    <div className="hidden lg:block col-span-2 text-xs text-[#a7a7a7]">
                      {song.releaseDate ? `${song.releaseDate} release` : '3 days ago'}
                    </div>

                    <div className="col-span-5 md:col-span-3 lg:col-span-1 flex items-center justify-end gap-2.5 pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeTrack(song.id);
                        }}
                        className="p-1"
                        title="Remove from Liked Songs"
                      >
                        <Heart className="w-4 h-4 fill-[#1ed760] text-[#1ed760]" />
                      </button>
                      <span className="text-xs text-[#a7a7a7]">
                        {song.durationFormatted}
                      </span>
                      <SongOptionsMenu song={song} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
