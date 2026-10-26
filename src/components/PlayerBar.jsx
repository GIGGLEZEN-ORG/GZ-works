import React, { useRef, useState, useEffect } from 'react';
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
  Maximize2,
  Minimize2,
  Loader2,
  Upload,
  ChevronDown,
  Activity,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const formatTime = (secs) => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function PlayerBar({ onHide }) {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    hasFullTrackAudio,
    saveFullTrackAudio,
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
    isVisualizerOpen,
    setIsVisualizerOpen,
    t
  } = useMusic();

  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [seekHoverTime, setSeekHoverTime] = useState(0);
  const [seekHoverPos, setSeekHoverPos] = useState(0);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullTrackFileInputRef = useRef(null);
  const miniCanvasRef = useRef(null);
  const miniAnimRef = useRef(null);

  // Mini Visualizer Canvas Loop
  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const barCount = 14;

    const drawMini = () => {
      frame += 0.08;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const barW = (w / barCount) * 0.65;
      const gap = (w / barCount) * 0.35;

      for (let i = 0; i < barCount; i++) {
        let barH;
        if (isPlaying) {
          const osc1 = Math.sin(frame * 2.5 + i * 0.6);
          const osc2 = Math.cos(frame * 1.8 + i * 0.4);
          barH = Math.max(2, Math.abs(osc1 * 0.6 + osc2 * 0.4) * (h - 2));
        } else {
          barH = 2;
        }

        const x = i * (barW + gap);
        const y = h - barH;

        // Gradient Cyan to Fuchsia
        const grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(1, '#f04de4');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW, barH);
      }

      miniAnimRef.current = requestAnimationFrame(drawMini);
    };

    miniAnimRef.current = requestAnimationFrame(drawMini);

    return () => {
      if (miniAnimRef.current) cancelAnimationFrame(miniAnimRef.current);
    };
  }, [isPlaying]);

  if (!currentTrack) return null;

  const isLiked = isTrackLiked(currentTrack.id);
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (playbackProgress / duration) * 100)) : 0;
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

  const handleFullTrackFileChange = async (event) => {
    const [file] = event.target.files || [];
    event.target.value = '';
    if (file) {
      await saveFullTrackAudio(currentTrack.id, file);
    }
  };

  const handleSeekMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, pos));
    setSeekHoverPos(clampedPos * 100);
    setSeekHoverTime(clampedPos * (duration || 0));
  };

  return (
    <div className="playmusic-player relative max-w-6xl mx-auto rounded-2xl px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 backdrop-blur-2xl border transition-all duration-300">
      {/* Dynamic Ambient Underglow */}
      <div 
        className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-20 blur-xl transition-all duration-700 -z-10"
        style={{
          background: `linear-gradient(90deg, ${currentTrack.dominantColor || '#00f0ff'}, #f04de4)`,
        }}
      />

      {/* LEFT: Current Track Info with Spinning Vinyl Art */}
      <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none sm:w-1/4 sm:min-w-[210px]">
        {/* Holographic Spinning Vinyl Cover Art */}
        <div 
          className="relative group cursor-pointer flex-shrink-0"
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          title={t('Toggle Lyrics')}
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-lg border border-white/15">
            <img 
              src={currentTrack.coverArt} 
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isPlaying ? 'animate-spin-vinyl' : ''
              }`}
            />
            {/* Spindle hole indicator */}
            <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-black/80 border border-white/40 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              fullTrackFileInputRef.current?.click();
            }}
            aria-label={`Load a full-length audio file for ${currentTrack.title}`}
            title={hasFullTrackAudio ? 'Replace local full-length audio' : 'Add a full-length audio file for this song'}
            className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#0a0c12] shadow-md ${
              hasFullTrackAudio
                ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black'
                : 'bg-[#1e2538] text-white hover:bg-[#2d3752]'
            }`}
          >
            <Upload className="h-3 w-3" />
          </button>

          <input
            ref={fullTrackFileInputRef}
            type="file"
            accept="audio/*,.aac,.flac,.m4a,.mp3,.ogg,.opus,.wav,.webm"
            className="hidden"
            onChange={handleFullTrackFileChange}
            aria-label={`Choose full-length audio for ${currentTrack.title}`}
          />

          {isPlaying && (
            <div className="absolute inset-0 rounded-xl ring-2 ring-cyan-400/50 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Title, Artist & Badges */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span 
              onClick={() => navigate('playlist', currentTrack.albumId)}
              className="text-sm font-bold text-white hover:text-cyan-400 transition-colors truncate cursor-pointer tracking-tight"
            >
              {currentTrack.title}
            </span>
            {currentTrack.language && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-cyan-300 font-mono font-semibold border border-cyan-400/20 flex-shrink-0">
                {currentTrack.language}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5 min-w-0">
            <span 
              onClick={() => navigate('artist', currentTrack.artistId)}
              className="text-xs text-[#94a3b8] hover:text-white truncate cursor-pointer transition-colors"
            >
              {currentTrack.artist}
            </span>

            <span
              className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider ${
                hasFullTrackAudio
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                  : 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
              }`}
              title={hasFullTrackAudio ? 'Playing your full-length audio file' : 'Playing the available preview'}
            >
              {hasFullTrackAudio ? 'FULL TRACK' : 'PREVIEW'}
            </span>
          </div>
        </div>

        {/* Like Button */}
        <button 
          onClick={() => toggleLikeTrack(currentTrack.id)}
          className="hidden sm:flex ml-1 p-2 rounded-full hover:bg-white/10 text-[#94a3b8] hover:text-white transition-all transform active:scale-125"
          title={t(isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs')}
        >
          <Heart className={`w-4 h-4 transition-colors ${
            isLiked ? 'fill-cyan-400 text-cyan-400 shadow-[0_0_10px_#00f0ff]' : 'hover:text-white'
          }`} />
        </button>
      </div>

      {/* CENTER: Playback Controls & Scrubber */}
      <div className="flex flex-col items-center gap-1.5 w-[200px] sm:w-2/4 max-w-xl">
        {/* Buttons Row with Mini Visualizer */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Shuffle button */}
          <button 
            onClick={toggleShuffle}
            className={`relative hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors ${
              isShuffle ? 'text-cyan-400' : 'text-[#94a3b8] hover:text-white'
            }`}
            title={t('Shuffle')}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && <span className="absolute bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]"></span>}
          </button>

          {/* Previous Track */}
          <button 
            onClick={playPreviousTrack}
            className="text-[#94a3b8] hover:text-white p-2 rounded-full hover:bg-white/10 transition-all active:scale-90"
            title={t('Previous')}
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Big Neon Glow Play / Pause Button */}
          <button 
            data-testid="main-play-btn"
            onClick={togglePlay}
            className="playmusic-primary-control w-10 h-10 sm:w-11 sm:h-11 rounded-full text-black flex items-center justify-center transition-all duration-200 transform hover:scale-108 active:scale-95"
            title={t(isPlaying ? 'Pause' : 'Play')}
          >
            {isBuffering ? (
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-black text-black" />
            ) : (
              <Play className="w-5 h-5 fill-black text-black translate-x-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button 
            onClick={playNextTrack}
            className="text-[#94a3b8] hover:text-white p-2 rounded-full hover:bg-white/10 transition-all active:scale-90"
            title={t('Next')}
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Repeat button */}
          <button 
            onClick={toggleRepeat}
            className={`relative hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors ${
              repeatMode !== 'off' ? 'text-cyan-400' : 'text-[#94a3b8] hover:text-white'
            }`}
            title={t('Repeat')}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && <span className="absolute bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]"></span>}
          </button>

          {/* Mini Live Canvas Visualizer right beside controls */}
          <div 
            onClick={() => setIsVisualizerOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-cyan-400/20 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-all ml-1 group"
            title="Open Cyber Visualizer Studio"
          >
            <canvas 
              ref={miniCanvasRef} 
              width={48} 
              height={14} 
              className="block opacity-85 group-hover:opacity-100"
            />
            <span className="text-[10px] font-mono font-bold text-cyan-400 group-hover:text-white transition-colors">
              EQ
            </span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div 
          className="w-full flex items-center gap-2.5 text-[11px] font-mono text-[#94a3b8] relative"
          onMouseEnter={() => setIsHoveringSeek(true)}
          onMouseLeave={() => setIsHoveringSeek(false)}
        >
          <span className="w-8 text-right tabular-nums font-medium text-white/70">
            {formatTime(playbackProgress)}
          </span>

          <div 
            className="relative flex-1 flex items-center group py-1 cursor-pointer"
            onMouseMove={handleSeekMouseMove}
          >
            {/* Background Track */}
            <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-500 rounded-full transition-all duration-75 relative shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Hover Tooltip Timestamp */}
            {isHoveringSeek && (
              <div 
                className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#0b0f1d] border border-cyan-400/40 text-[10px] text-cyan-300 font-mono font-bold shadow-lg pointer-events-none"
                style={{ left: `${seekHoverPos}%` }}
              >
                {formatTime(seekHoverTime)}
              </div>
            )}

            {/* Range input slider */}
            <input 
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={playbackProgress || 0}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <span className="w-8 tabular-nums font-medium text-white/70">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Visualizer Studio Button, Lyrics, Queue, Volume */}
      <div className="hidden sm:flex items-center justify-end gap-2 sm:gap-2.5 flex-none sm:w-1/4">
        {/* Visualizer Studio Trigger Button */}
        <button 
          onClick={() => setIsVisualizerOpen(!isVisualizerOpen)}
          className={`relative p-2 rounded-xl transition-all flex items-center gap-1.5 ${
            isVisualizerOpen 
              ? 'bg-cyan-400/25 text-cyan-300 ring-1 ring-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
              : 'text-[#94a3b8] hover:text-cyan-400 hover:bg-cyan-400/10'
          }`}
          title="Cyber Visualizer Studio"
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider hidden lg:inline">
            Studio
          </span>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
        </button>

        {/* Lyrics Toggle */}
        <button 
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-2 rounded-xl transition-all ${
            isLyricsOpen 
              ? 'bg-fuchsia-500/25 text-fuchsia-300 ring-1 ring-fuchsia-500/50' 
              : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
          }`}
          title={t('Lyrics')}
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Toggle */}
        <button 
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-xl transition-all ${
            isQueueOpen 
              ? 'bg-cyan-400/25 text-cyan-300 ring-1 ring-cyan-400/50' 
              : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
          }`}
          title={t('Queue')}
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume Slider */}
        <div 
          className="flex items-center gap-2 group relative"
          onMouseEnter={() => setIsHoveringVolume(true)}
          onMouseLeave={() => setIsHoveringVolume(false)}
        >
          <button 
            onClick={toggleMute}
            className="p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors"
            title={t(isMuted ? 'Unmute' : 'Mute')}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="w-18 hidden md:flex items-center relative py-1">
            <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full transition-colors"
                style={{ width: `${isMuted ? 0 : volumePercent}%` }}
              />
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : (volume ?? 1)}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Fullscreen Button */}
        <button 
          onClick={handleFullscreenToggle}
          className="p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors"
          title={t('Fullscreen')}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Hide Player Button */}
        <button
          type="button"
          onClick={onHide}
          className="p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors"
          title="Minimize Dock"
          aria-label="Minimize dock"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Hide Player Button */}
      <button
        type="button"
        onClick={onHide}
        className="sm:hidden absolute -top-2 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#12182c] text-[#c4c7d0] shadow-lg hover:bg-[#1a2340]"
        title="Minimize dock"
        aria-label="Minimize dock"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
