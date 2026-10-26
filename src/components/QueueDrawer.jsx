import React from 'react';
import { X, Play, Pause, Trash2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function QueueDrawer() {
  const { 
    isQueueOpen, 
    setIsQueueOpen, 
    currentTrack, 
    currentQueue, 
    queueIndex, 
    playTrack, 
    isPlaying 
  } = useMusic();

  if (!isQueueOpen) return null;

  const upNextTracks = currentQueue.slice(queueIndex + 1);

  return (
    <div className="playmusic-queue absolute right-2 top-2 bottom-2 z-30 flex w-80 max-w-[calc(100%-1rem)] flex-col select-none animate-in slide-in-from-right duration-200 lg:relative lg:inset-auto lg:h-full lg:w-96 lg:max-w-none lg:flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="text-base font-bold text-white tracking-tight">
          Queue
        </h2>
        <button
          onClick={() => setIsQueueOpen(false)}
          className="text-[#a7a7a7] hover:text-white p-1 rounded-full hover:bg-[#282828] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Now Playing Section */}
        {currentTrack && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a7a7a7] mb-3">
              Now playing
            </h3>
            <div className="flex items-center gap-3 p-2 bg-[#282828] rounded-md">
              <img 
                src={currentTrack.coverArt} 
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-[#1ed760] truncate">
                  {currentTrack.title}
                </span>
                <span className="text-xs text-[#a7a7a7] truncate">
                  {currentTrack.artist}
                </span>
              </div>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-4 w-4 justify-center mr-2">
                  <span className="w-1 bg-[#1ed760] rounded-sm animate-equalizer-1"></span>
                  <span className="w-1 bg-[#1ed760] rounded-sm animate-equalizer-2"></span>
                  <span className="w-1 bg-[#1ed760] rounded-sm animate-equalizer-3"></span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next From Queue */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#a7a7a7] mb-3">
            Next from queue ({upNextTracks.length})
          </h3>

          {upNextTracks.length === 0 ? (
            <p className="text-xs text-[#727272] py-4 text-center">
              No more tracks in queue
            </p>
          ) : (
            <div className="space-y-1">
              {upNextTracks.map((song, i) => (
                <div
                  key={song.id + '-' + i}
                  onClick={() => playTrack(song, currentQueue)}
                  className="group flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors"
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img 
                      src={song.coverArt} 
                      alt={song.title}
                      className="w-full h-full rounded object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-white truncate group-hover:text-white">
                      {song.title}
                    </span>
                    <span className="text-xs text-[#a7a7a7] truncate">
                      {song.artist}
                    </span>
                  </div>

                  <span className="text-xs text-[#727272] pr-1">
                    {song.durationFormatted}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
