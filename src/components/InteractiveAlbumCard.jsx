import React from 'react';
import { Play, Pause, Disc, Sparkles } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ALL_SONGS } from '../data/musicData';

export default function InteractiveAlbumCard({ album }) {
  const { playTrack, currentTrack, isPlaying, togglePlay, navigate } = useMusic();

  const albumSongs = ALL_SONGS.filter(s => s.albumId === album.id || s.album === album.title);
  const isThisAlbumPlaying = currentTrack && (currentTrack.albumId === album.id || currentTrack.album === album.title) && isPlaying;

  const handlePlayAlbum = (e) => {
    e.stopPropagation();
    if (isThisAlbumPlaying) {
      togglePlay();
    } else if (albumSongs.length > 0) {
      playTrack(albumSongs[0], albumSongs);
    } else {
      navigate('playlist', album.id);
    }
  };

  const dominantGlow = album.dominantColor || '#00f0ff';

  return (
    <div
      onClick={() => navigate('playlist', album.id)}
      className="group relative flex flex-col p-3.5 rounded-2xl cursor-pointer transition-all duration-500 bg-[#0b0f1d]/70 hover:bg-[#12182c]/90 border border-white/[0.08] hover:border-cyan-400/40 shadow-xl hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.8)]"
      style={{
        '--album-glow': dominantGlow,
      }}
    >
      {/* 3D Vinyl Sleeve Container */}
      <div className="relative mb-3.5 aspect-square w-full rounded-xl overflow-hidden vinyl-sleeve-perspective">
        {/* Holographic Vinyl Record (Slides out smoothly on hover) */}
        <div 
          className="vinyl-disc-slide absolute top-[4%] right-[2%] w-[92%] h-[92%] rounded-full vinyl-disc-grooves flex items-center justify-center transition-all duration-500 ease-out z-0 pointer-events-none opacity-90 group-hover:opacity-100"
          style={{
            transform: 'translateX(0%) rotate(0deg)',
          }}
        >
          {/* Vinyl center album label */}
          <div className="w-[36%] h-[36%] rounded-full overflow-hidden border-2 border-white/20 shadow-md relative flex items-center justify-center">
            <img 
              src={album.coverArt} 
              alt="" 
              className={`w-full h-full object-cover ${isThisAlbumPlaying ? 'animate-spin-vinyl' : ''}`}
            />
            {/* Center Spindle Hole */}
            <div className="absolute w-3 h-3 rounded-full bg-[#0a0a0a] border border-white/40" />
          </div>
        </div>

        {/* Front Sleeve Jacket */}
        <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[0.96] group-hover:-translate-x-3 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)] border border-white/10">
          <img 
            src={album.coverArt} 
            alt={album.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Specular Light Sweep overlay */}
          <div className="specular-shine pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 opacity-0" />

          {/* Equalizer Indicator when currently playing */}
          {isThisAlbumPlaying && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex items-end gap-1 h-7">
                <span className="w-1.5 bg-cyan-400 rounded-full eq-bar-1 shadow-[0_0_10px_#00f0ff]" />
                <span className="w-1.5 bg-fuchsia-400 rounded-full eq-bar-2 shadow-[0_0_10px_#f04de4]" />
                <span className="w-1.5 bg-emerald-400 rounded-full eq-bar-3 shadow-[0_0_10px_#00ff9d]" />
                <span className="w-1.5 bg-cyan-400 rounded-full eq-bar-4 shadow-[0_0_10px_#00f0ff]" />
              </div>
            </div>
          )}

          {/* Floating Neon Play Button */}
          <button
            onClick={handlePlayAlbum}
            className={`absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all duration-300 z-20 ${
              isThisAlbumPlaying
                ? 'opacity-100 scale-100'
                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 active:scale-95'
            }`}
            title={isThisAlbumPlaying ? 'Pause Album' : 'Play Album'}
          >
            {isThisAlbumPlaying ? (
              <Pause className="w-5 h-5 fill-black text-black" />
            ) : (
              <Play className="w-5 h-5 fill-black text-black translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Album Info */}
      <div className="flex items-start justify-between gap-1.5 mb-1 z-10">
        <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors truncate">
          {album.title}
        </h4>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono flex-shrink-0 font-medium">
          {album.year}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[#94a3b8] mt-0.5 z-10">
        <p className="truncate max-w-[70%] group-hover:text-white/80 transition-colors">
          {album.artist}
        </p>
        <span className="text-[10px] text-cyan-400/90 font-medium tracking-wide flex items-center gap-1">
          <Disc className="w-3 h-3 text-cyan-400" />
          {album.songsCount || albumSongs.length || 8} tracks
        </span>
      </div>

      {/* Badge Pill */}
      {album.badge && (
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#94a3b8]">
          <span className="text-white/60 truncate">{album.genre}</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 font-semibold border border-cyan-400/20 text-[9px] uppercase tracking-wider flex-shrink-0">
            {album.badge}
          </span>
        </div>
      )}
    </div>
  );
}
