import { Pause, Play } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import SearchSongRow from './SearchSongRow';

export default function SearchSongList({ songs }) {
  const {
    playTrack,
    currentTrack,
    isPlaying,
    togglePlay,
    isTrackLiked,
    toggleLikeTrack,
    navigate,
    t,
  } = useMusic();

  const topSong = songs[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {topSong && (
        <div className="lg:col-span-5 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
            {t('Top result')}
          </h2>
          <div
            onClick={() => playTrack(topSong, songs)}
            className="group relative flex-1 p-5 bg-[#181818] hover:bg-[#282828] rounded-lg cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <img
                src={topSong.coverArt}
                alt={topSong.title}
                className="w-24 h-24 rounded shadow-lg object-cover mb-4"
              />
              <h3 className="text-2xl font-bold text-white tracking-tight line-clamp-1 mb-1">
                {topSong.title}
              </h3>
              <p className="text-sm text-[#a7a7a7]">
                Song • <span
                  className="text-white hover:underline cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate('artist', topSong.artistId);
                  }}
                >
                  {topSong.artist}
                </span>
              </p>
            </div>

            <button
              onClick={(event) => {
                event.stopPropagation();
                if (currentTrack?.id === topSong.id && isPlaying) {
                  togglePlay();
                } else {
                  playTrack(topSong, songs);
                }
              }}
              className="self-end w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-spotify-green hover:scale-105 active:scale-95 transition-all"
            >
              {currentTrack?.id === topSong.id && isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black translate-x-0.5" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className={`${topSong ? 'lg:col-span-7' : 'col-span-12'} flex flex-col`}>
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
          Songs
        </h2>
        <div className="space-y-1">
          {songs.slice(0, 4).map(song => (
            <SearchSongRow
              key={song.id}
              song={song}
              isCurrent={currentTrack?.id === song.id}
              isPlaying={isPlaying}
              isLiked={isTrackLiked(song.id)}
              onPlay={() => playTrack(song, songs)}
              onToggleLike={() => toggleLikeTrack(song.id)}
              onArtistClick={() => navigate('artist', song.artistId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
