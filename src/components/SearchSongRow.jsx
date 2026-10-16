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
      className={`group flex items-center justify-between p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors ${
        isCurrent ? 'bg-[#282828]/60' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-10 h-10 flex-shrink-0">
          <img
            src={song.coverArt}
            alt={song.title}
            className="w-full h-full rounded object-cover"
          />
          <button className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isCurrent && isPlaying ? (
              <Pause className="w-4 h-4 fill-white text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
            )}
          </button>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className={`text-sm font-semibold truncate ${
              isCurrent ? 'text-[#1ed760]' : 'text-white'
            }`}>
              {song.title}
            </span>
            {song.language && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 font-medium">
                {song.language}
              </span>
            )}
          </div>
          <span
            onClick={(event) => {
              event.stopPropagation();
              onArtistClick();
            }}
            className="text-xs text-[#a7a7a7] hover:underline hover:text-white truncate"
          >
            {song.artist}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SongOptionsMenu song={song} />
        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggleLike();
          }}
          className="text-[#a7a7a7] hover:text-white p-1"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1ed760] text-[#1ed760]' : 'opacity-0 group-hover:opacity-100'}`} />
        </button>
        <span className="text-xs text-[#a7a7a7] min-w-[32px] text-right">
          {song.durationFormatted}
        </span>
      </div>
    </div>
  );
}
