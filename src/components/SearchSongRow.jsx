import { Heart, Pause, Play } from 'lucide-react';
import SongOptionsMenu from './SongOptionsMenu';

export default function SearchSongRow({
  song,
  isCurrent,
  isPlaying,
  isLiked,
  onPlay,
  onToggleLike,
  onArtistClick,
}) {
  return (
    <div
      onClick={onPlay}
      className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
        isCurrent 
          ? 'bg-white/10 border border-[#1ed760]/30 shadow-md' 
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-white/5">
          <img
            src={song.coverArt}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <button className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isCurrent && isPlaying ? (
              <Pause className="w-4 h-4 fill-white text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
            )}
          </button>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 truncate">
            <span className={`text-sm font-semibold truncate ${
              isCurrent ? 'text-[#1ed760]' : 'text-white'
            }`}>
              {song.title}
            </span>
            {song.language && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 font-medium">
                {song.language}
              </span>
            )}
            {isCurrent && isPlaying && (
              <div className="flex items-end gap-0.5 h-3 ml-1 flex-shrink-0">
                <span className="w-0.5 bg-[#1ed760] rounded-full eq-bar-1"></span>
                <span className="w-0.5 bg-[#1ed760] rounded-full eq-bar-2"></span>
                <span className="w-0.5 bg-[#1ed760] rounded-full eq-bar-3"></span>
              </div>
            )}
          </div>
          <span
            onClick={(event) => {
              event.stopPropagation();
              onArtistClick();
            }}
            className="text-xs text-[#9ca3af] hover:underline hover:text-white truncate"
          >
            {song.artist}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SongOptionsMenu song={song} />
        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggleLike();
          }}
          className="text-[#9ca3af] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1ed760] text-[#1ed760]' : 'opacity-0 group-hover:opacity-100'}`} />
        </button>
        <span className="text-xs text-[#9ca3af] font-mono min-w-[36px] text-right">
          {song.durationFormatted}
        </span>
      </div>
    </div>
  );
}
