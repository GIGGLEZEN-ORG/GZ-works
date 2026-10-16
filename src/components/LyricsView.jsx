import React, { useEffect, useRef } from 'react';
import { X, Mic2, Disc3 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function LyricsView() {
  const { 
    currentTrack, 
    playbackProgress, 
    seekTo, 
    isLyricsOpen, 
    setIsLyricsOpen 
  } = useMusic();

  const activeLineRef = useRef(null);
  const containerRef = useRef(null);

  const lyrics = currentTrack?.lyrics || [];

  // Determine current active lyric index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (playbackProgress >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto-scroll to active lyric
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  if (!isLyricsOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#121212] overflow-hidden flex flex-col select-none"
      style={{
        background: `radial-gradient(circle at 50% 20%, ${currentTrack?.dominantColor || '#333333'}cc 0%, #121212 90%)`
      }}
    >
      {/* Top Bar with Track Info & Close */}
      <div className="flex items-center justify-between p-6 md:p-8 z-10">
        <div className="flex items-center gap-4">
          <img 
            src={currentTrack?.coverArt} 
            alt={currentTrack?.title}
            className="w-14 h-14 rounded-md shadow-2xl object-cover animate-spin-slow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {currentTrack?.title}
              </h2>
              {currentTrack?.language && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                  {currentTrack?.language}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white/80">
              {currentTrack?.artist}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsLyricsOpen(false)}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Synchronized Lyrics Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-8 md:px-24 py-16 space-y-8 scroll-smooth"
      >
        {lyrics.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Mic2 className="w-16 h-16 text-white/40 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Looks like we don't have the lyrics for this song yet.
            </h3>
            <p className="text-sm text-white/60">
              Check back soon or enjoy the beat!
            </p>
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <p
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seekTo(line.time)}
                className={`cursor-pointer transition-all duration-300 font-black tracking-tight leading-snug ${
                  isActive
                    ? 'text-white text-3xl md:text-5xl scale-105 origin-left drop-shadow-md'
                    : isPast
                    ? 'text-white/40 text-2xl md:text-4xl hover:text-white/70'
                    : 'text-white/30 text-2xl md:text-4xl hover:text-white/60'
                }`}
              >
                {line.text}
              </p>
            );
          })
        )}
      </div>

      {/* Footer hint */}
      <div className="p-4 text-center text-xs text-white/40 font-medium">
        Click any line to jump to that part of the song
      </div>
    </div>
  );
}
