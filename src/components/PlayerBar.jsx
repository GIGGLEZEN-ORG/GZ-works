import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1,
  Heart, 
  Volume2, 
  Volume1, 
  VolumeX, 
  Mic2, 
  ListMusic, 
  MonitorSpeaker, 
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const formatTime = (secs) => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    playbackProgress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    playNextTrack,
    playPreviousTrack,
    seekTo,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    isTrackLiked,
    toggleLikeTrack,
    navigate,
    isLyricsOpen,
    setIsLyricsOpen,
    isQueueOpen,
    setIsQueueOpen,
    setIsDeviceModalOpen,
    showToast,
    t
  } = useMusic();

  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!currentTrack) return null;

  const isLiked = isTrackLiked(currentTrack.id);
  const progressPercent = duration > 0 ? (playbackProgress / duration) * 100 : 0;
  const volumePercent = (volume || 0) * 100;

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <footer className="h-24 bg-[#000000] border-t border-[#282828] px-4 flex items-center justify-between select-none z-40">
      {/* LEFT: Current Track Info */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[180px]">
        <div className="relative group cursor-pointer flex-shrink-0" onClick={() => setIsLyricsOpen(!isLyricsOpen)}>
          <img 
            src={currentTrack.coverArt} 
            alt={currentTrack.title}
            className="w-14 h-14 rounded object-cover shadow-md transition-transform group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span 
              onClick={() => navigate('playlist', currentTrack.albumId)}
              className="text-sm font-medium text-white hover:underline truncate cursor-pointer"
            >
              {currentTrack.title}
            </span>
            {currentTrack.language && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-white/70 font-semibold flex-shrink-0">
                {currentTrack.language}
              </span>
            )}
          </div>
          <span 
            onClick={() => navigate('artist', currentTrack.artistId)}
            className="text-xs text-[#a7a7a7] hover:underline hover:text-white truncate cursor-pointer"
          >
            {currentTrack.artist}
          </span>
        </div>

        <button 
          onClick={() => toggleLikeTrack(currentTrack.id)}
          className="ml-1 p-1 text-[#a7a7a7] hover:text-white transition-colors"
          title={t(isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs')}
        >
          <Heart className={`w-5 h-5 transition-transform active:scale-125 ${
            isLiked ? 'fill-[#1ed760] text-[#1ed760]' : 'hover:text-white'
          }`} />
        </button>
      </div>

      {/* CENTER: Playback Controls & Timeline */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-2xl">
        {/* Buttons row */}
        <div className="flex items-center gap-5">
          {/* Shuffle button */}
          <button 
            onClick={toggleShuffle}
            className={`relative p-1.5 transition-colors ${
              isShuffle ? 'text-[#1ed760]' : 'text-[#a7a7a7] hover:text-white'
            }`}
            title={t('Enable shuffle')}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full"></span>}
          </button>

          {/* Previous Track */}
          <button 
            onClick={playPreviousTrack}
            className="text-[#a7a7a7] hover:text-white transition-colors p-1"
            title={t('Previous')}
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Big Play / Pause Button */}
          <button 
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-md"
            title={t(isPlaying ? 'Pause' : 'Play')}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button 
            onClick={playNextTrack}
            className="text-[#a7a7a7] hover:text-white transition-colors p-1"
            title={t('Next')}
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat button */}
          <button 
            onClick={toggleRepeat}
            className={`relative p-1.5 transition-colors ${
              repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-[#a7a7a7] hover:text-white'
            }`}
            title={t('Enable repeat')}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full"></span>}
          </button>
        </div>

        {/* Timeline Slider row */}
        <div 
          className="flex items-center gap-2.5 w-full group"
          onMouseEnter={() => setIsHoveringSeek(true)}
          onMouseLeave={() => setIsHoveringSeek(false)}
        >
          <span className="text-[11px] text-[#a7a7a7] min-w-[35px] text-right">
            {formatTime(playbackProgress)}
          </span>

          <div className="relative w-full flex items-center">
            {/* Background track */}
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-colors ${
                  isHoveringSeek ? 'bg-[#1ed760]' : 'bg-white'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <input 
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={playbackProgress}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
            />
          </div>

          <span className="text-[11px] text-[#a7a7a7] min-w-[35px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Extra controls & Volume */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
        {/* Lyrics Button */}
        <button 
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-1.5 transition-colors ${
            isLyricsOpen ? 'text-[#1ed760]' : 'text-[#a7a7a7] hover:text-white'
          }`}
          title={t('Lyrics')}
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Button */}
        <button 
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-1.5 transition-colors ${
            isQueueOpen ? 'text-[#1ed760]' : 'text-[#a7a7a7] hover:text-white'
          }`}
          title={t('Queue')}
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Device Connect */}
        <button 
          onClick={() => setIsDeviceModalOpen(true)}
          className="p-1.5 text-[#a7a7a7] hover:text-white transition-colors"
          title={t('Connect to a device')}
        >
          <MonitorSpeaker className="w-4 h-4" />
        </button>

        {/* Volume Controls */}
        <div 
          className="flex items-center gap-2 group w-28"
          onMouseEnter={() => setIsHoveringVolume(true)}
          onMouseLeave={() => setIsHoveringVolume(false)}
        >
          <button 
            onClick={toggleMute}
            className="text-[#a7a7a7] hover:text-white transition-colors p-1"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#e24e4e]" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="relative w-full flex items-center">
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-colors ${
                  isHoveringVolume ? 'bg-[#1ed760]' : 'bg-white'
                }`}
                style={{ width: `${volumePercent}%` }}
              />
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Fullscreen toggle */}
        <button 
          onClick={handleFullscreenToggle}
          className="p-1.5 text-[#a7a7a7] hover:text-white transition-colors hidden sm:inline-block"
          title={t('Full screen')}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </footer>
  );
}
