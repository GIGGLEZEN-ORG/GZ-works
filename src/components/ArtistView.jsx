import React, { useState } from 'react';
import { Play, Pause, Heart, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ALL_SONGS, ARTISTS_DATA } from '../data/musicData';
import SongOptionsMenu from './SongOptionsMenu';

export default function ArtistView() {
  const { 
    currentViewData, 
    getArtistById, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    isTrackLiked, 
    toggleLikeTrack,
    showToast 
  } = useMusic();

  const [isFollowing, setIsFollowing] = useState(false);

  const artist = getArtistById(currentViewData) || ARTISTS_DATA[0];
  if (!artist) return null;

  const artistSongs = ALL_SONGS.filter(s => s.artistId === artist.id || artist.popularSongIds?.includes(s.id));
  const isArtistPlaying = currentTrack && artistSongs.some(s => s.id === currentTrack.id) && isPlaying;

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    showToast(!isFollowing ? `Saved ${artist.name} to Your Library` : `Removed ${artist.name} from Your Library`);
  };

  const handlePlayArtist = () => {
    if (isArtistPlaying) {
      togglePlay();
    } else if (artistSongs.length > 0) {
      playTrack(artistSongs[0], artistSongs);
    }
  };

  return (
    <div className="relative min-h-full select-none pb-12">
      {/* Huge Artist Banner */}
      <div className="relative h-80 md:h-96 w-full overflow-hidden flex flex-col justify-end p-6 md:p-8">
        <img 
          src={artist.banner || artist.avatar} 
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />

        <div className="relative z-10 space-y-2">
          {artist.verified && (
            <div className="flex items-center gap-1.5 text-xs text-[#3d91f4] font-bold">
              <CheckCircle2 className="w-4 h-4 fill-[#3d91f4] text-black" />
              <span className="text-white">Verified Artist</span>
            </div>
          )}

          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-none">
            {artist.name}
          </h1>

          <p className="text-sm font-semibold text-white/90">
            {artist.monthlyListeners}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-6 px-6 md:px-8 py-5">
        <button
          onClick={handlePlayArtist}
          className="w-14 h-14 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-spotify-green transition-all"
        >
          {isArtistPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>

        <button
          onClick={handleToggleFollow}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
            isFollowing 
              ? 'border-[#1ed760] text-white bg-[#1ed760]/20' 
              : 'border-[#727272] hover:border-white text-white hover:scale-105'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button 
          onClick={() => showToast("Artist options")}
          className="text-[#a7a7a7] hover:text-white"
        >
          <MoreHorizontal className="w-7 h-7" />
        </button>
      </div>

      {/* Popular Songs Section */}
      <div className="px-6 md:px-8 mt-4">
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
          Popular
        </h2>

        <div className="space-y-1">
          {artistSongs.map((song, idx) => {
            const isCurrent = currentTrack?.id === song.id;
            const isSongPlaying = isCurrent && isPlaying;
            const isLiked = isTrackLiked(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playTrack(song, artistSongs)}
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
                        {idx + 1}
                      </span>
                      <Play className="w-4 h-4 text-white fill-white hidden group-hover:block translate-x-0.5" />
                    </>
                  )}
                </div>

                <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                  <img 
                    src={song.coverArt} 
                    alt={song.title} 
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                  <span className={`font-semibold truncate ${
                    isCurrent ? 'text-[#1ed760]' : 'text-white'
                  }`}>
                    {song.title}
                  </span>
                </div>

                <div className="hidden md:block col-span-3 text-xs text-[#a7a7a7]">
                  {song.streams || '148,290,192'}
                </div>

                <div className="col-span-5 md:col-span-3 flex items-center justify-end gap-2.5 pr-2">
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
          })}
        </div>
      </div>

      {/* About Artist Section */}
      <div className="px-6 md:px-8 mt-10">
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
          About
        </h2>
        <div className="relative rounded-xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-[#242424] to-[#181818] border border-white/5 max-w-3xl">
          <p className="text-sm text-[#b3b3b3] leading-relaxed mb-4">
            {artist.bio}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              {artist.monthlyListeners}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
