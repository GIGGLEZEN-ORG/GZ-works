import React, { useRef, useEffect, useState } from 'react';
import { 
  X, 
  Activity, 
  Radio, 
  Disc, 
  Sliders, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Layers,
  Palette
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const THEMES = {
  cyber: { name: 'Cyber Wave', primary: '#00f0ff', secondary: '#f04de4', glow: 'rgba(0, 240, 255, 0.4)' },
  sunset: { name: 'Neon Sunset', primary: '#f04de4', secondary: '#ffbe0b', glow: 'rgba(240, 77, 228, 0.4)' },
  aurora: { name: 'Aurora Matrix', primary: '#00ff9d', secondary: '#00b4d8', glow: 'rgba(0, 255, 157, 0.4)' },
  amethyst: { name: 'Electric Violet', primary: '#a855f7', secondary: '#ec4899', glow: 'rgba(168, 85, 247, 0.4)' },
};

export default function VisualizerStudio() {
  const { 
    isVisualizerOpen, 
    setIsVisualizerOpen, 
    visualizerMode, 
    setVisualizerMode,
    currentTrack,
    isPlaying,
    playbackProgress,
    duration,
    togglePlay,
    playNextTrack,
    playPreviousTrack,
    seekTo,
    volume,
    isMuted,
    toggleMute
  } = useMusic();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [activeThemeKey, setActiveThemeKey] = useState('cyber');
  const [sensitivity, setSensitivity] = useState(1.4);
  const [enableParticles, setEnableParticles] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Peak caps memory for bars mode
  const peaksRef = useRef(new Array(64).fill(0));
  const peakDecayRef = useRef(new Array(64).fill(0));

  // Particles array
  const particlesRef = useRef([]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisualizerOpen) {
        setIsVisualizerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisualizerOpen, setIsVisualizerOpen]);

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isVisualizerOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas resizing for sharp retina screens
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    if (particlesRef.current.length === 0) {
      const parts = [];
      for (let i = 0; i < 90; i++) {
        parts.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2.5 + 1,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.5 ? THEMES[activeThemeKey].primary : THEMES[activeThemeKey].secondary
        });
      }
      particlesRef.current = parts;
    }

    let t = 0;

    const render = () => {
      t += 0.035;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const theme = THEMES[activeThemeKey] || THEMES.cyber;
      const color1 = theme.primary;
      const color2 = theme.secondary;

      // Activity level multiplier (dampened when paused)
      const energy = isPlaying ? sensitivity : 0.12;

      // 1. Render Background Floating Particles
      if (enableParticles) {
        particlesRef.current.forEach(p => {
          p.x += p.speedX * (isPlaying ? 1.5 : 0.5);
          p.y += p.speedY * (isPlaying ? 1.5 : 0.5);

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * (isPlaying ? 0.8 : 0.3);
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // 2. Render Selected Mode
      if (visualizerMode === 'wave') {
        // --- MODE 1: CYBER WAVEFORM (OSCILLOSCOPE) ---
        const centerY = height * 0.52;
        const waveCount = 3;

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const waveFreq = 0.012 + w * 0.006;
          const waveSpeed = t * (1.2 + w * 0.4);
          const amp = (height * 0.16) * energy * (1 - w * 0.22);

          for (let x = 0; x <= width; x += 3) {
            // Harmonic equation with beat envelope
            const envelope = Math.sin((x / width) * Math.PI);
            const y1 = Math.sin(x * waveFreq + waveSpeed) * amp * envelope;
            const y2 = Math.cos(x * 0.024 - waveSpeed * 1.5) * (amp * 0.35) * envelope;
            const y = centerY + y1 + y2;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          // Gradient neon stroke
          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, color1);
          grad.addColorStop(0.5, color2);
          grad.addColorStop(1, color1);

          ctx.strokeStyle = grad;
          ctx.lineWidth = w === 0 ? 3.5 : 1.8;
          ctx.shadowBlur = w === 0 ? 25 : 10;
          ctx.shadowColor = color1;
          ctx.stroke();

          // Wave reflection floor
          if (w === 0) {
            ctx.beginPath();
            for (let x = 0; x <= width; x += 3) {
              const envelope = Math.sin((x / width) * Math.PI);
              const y1 = Math.sin(x * waveFreq + waveSpeed) * amp * envelope;
              const y = centerY - y1 * 0.4 + 40;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = color2;
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      } else if (visualizerMode === 'bars') {
        // --- MODE 2: NEON FREQUENCY BARS (SPECTRUM) ---
        const barCount = 44;
        const totalGapRatio = 0.35;
        const barWidth = (width / barCount) * (1 - totalGapRatio);
        const gap = (width / barCount) * totalGapRatio;
        const baseline = height * 0.72;
        const maxBarHeight = height * 0.45;

        for (let i = 0; i < barCount; i++) {
          const norm = i / barCount;
          // Dynamic frequency calculation
          const freqMultiplier = Math.sin(norm * Math.PI) * 1.3;
          const osc1 = Math.sin(t * 3.5 + i * 0.4);
          const osc2 = Math.cos(t * 2.2 + i * 0.65);
          const osc3 = Math.sin(t * 5.0 + i * 0.2);
          const rawHeight = Math.max(8, (Math.abs(osc1 * 0.5 + osc2 * 0.3 + osc3 * 0.2) * maxBarHeight * freqMultiplier * energy));

          // Peak drop physics
          if (rawHeight >= peaksRef.current[i]) {
            peaksRef.current[i] = rawHeight;
            peakDecayRef.current[i] = 0;
          } else {
            peakDecayRef.current[i] += 0.45;
            peaksRef.current[i] = Math.max(0, peaksRef.current[i] - peakDecayRef.current[i]);
          }

          const x = i * (barWidth + gap) + gap * 0.5;
          const y = baseline - rawHeight;

          // Bar Gradient
          const barGrad = ctx.createLinearGradient(x, y, x, baseline);
          barGrad.addColorStop(0, color2);
          barGrad.addColorStop(0.7, color1);
          barGrad.addColorStop(1, 'rgba(0, 240, 255, 0.15)');

          ctx.fillStyle = barGrad;
          ctx.shadowBlur = 14;
          ctx.shadowColor = color1;

          // Draw rounded bar
          ctx.beginPath();
          const r = Math.min(barWidth / 2, 4);
          ctx.roundRect ? ctx.roundRect(x, y, barWidth, rawHeight, [r, r, 0, 0]) : ctx.rect(x, y, barWidth, rawHeight);
          ctx.fill();

          // Peak cap
          const peakY = baseline - peaksRef.current[i] - 5;
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.shadowColor = color2;
          ctx.fillRect(x, peakY, barWidth, 3);

          // Under reflection
          ctx.fillStyle = color1;
          ctx.globalAlpha = 0.18;
          ctx.fillRect(x, baseline + 4, barWidth, rawHeight * 0.35);
          ctx.globalAlpha = 1;
        }
      } else if (visualizerMode === 'radial') {
        // --- MODE 3: ORBITAL RADIAL PULSE ---
        const cx = width * 0.5;
        const cy = height * 0.5;
        const baseRadius = Math.min(width, height) * 0.22;
        const ringSpikes = 64;

        // Central glow ring
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = color1;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 30;
        ctx.shadowColor = color1;
        ctx.stroke();

        // Radiating Spikes
        for (let i = 0; i < ringSpikes; i++) {
          const angle = (i / ringSpikes) * Math.PI * 2 + t * 0.4;
          const osc = Math.sin(t * 3.2 + i * 0.7) * Math.cos(t * 2.1 + i * 0.3);
          const spikeLen = Math.max(6, Math.abs(osc) * baseRadius * 0.85 * energy);

          const x1 = cx + Math.cos(angle) * baseRadius;
          const y1 = cy + Math.sin(angle) * baseRadius;
          const x2 = cx + Math.cos(angle) * (baseRadius + spikeLen);
          const y2 = cy + Math.sin(angle) * (baseRadius + spikeLen);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = i % 2 === 0 ? color1 : color2;
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = color2;
          ctx.stroke();
        }

        // Concentric pulsing aura
        const pulseR = baseRadius * (1 + Math.sin(t * 4) * 0.08 * energy);
        ctx.beginPath();
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = color2;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (visualizerMode === 'matrix') {
        // --- MODE 4: CYBER MATRIX RAIN ---
        const cols = 36;
        const colWidth = width / cols;
        const rows = 20;
        const cellH = (height * 0.6) / rows;
        const startY = height * 0.18;

        for (let c = 0; c < cols; c++) {
          const colEnergy = Math.abs(Math.sin(t * 2.5 + c * 0.45)) * energy;
          const activeRows = Math.floor(colEnergy * rows);

          for (let r = 0; r < rows; r++) {
            const x = c * colWidth + colWidth * 0.15;
            const y = startY + (rows - r - 1) * cellH;
            const w = colWidth * 0.7;
            const h = cellH - 3;

            if (r <= activeRows) {
              const rowProgress = r / rows;
              ctx.fillStyle = rowProgress > 0.75 ? color2 : color1;
              ctx.shadowBlur = 10;
              ctx.shadowColor = color1;
            } else {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
              ctx.shadowBlur = 0;
            }

            ctx.fillRect(x, y, w, h);
          }
        }
      }

      ctx.shadowBlur = 0;
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isVisualizerOpen, visualizerMode, activeThemeKey, sensitivity, enableParticles, isPlaying]);

  if (!isVisualizerOpen) return null;

  const currentTheme = THEMES[activeThemeKey] || THEMES.cyber;
  const progressPercent = duration > 0 ? (playbackProgress / duration) * 100 : 0;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#04060d]/95 backdrop-blur-3xl flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300"
    >
      {/* Background Animated Gradient Mesh */}
      <div 
        className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 transition-all duration-700"
        style={{ backgroundColor: currentTheme.primary }}
      />
      <div 
        className="pointer-events-none absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 transition-all duration-700"
        style={{ backgroundColor: currentTheme.secondary }}
      />

      {/* TOP BAR: Header & Mode Switcher */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#070b16]/70 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              Cyber Visualizer Studio
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] uppercase font-mono font-bold tracking-wider border border-cyan-400/30">
                PRO 60 FPS
              </span>
            </h2>
            <p className="text-xs text-[#94a3b8]">Real-time harmonic audio spectrum & waveform synthesizer</p>
          </div>
        </div>

        {/* Visualizer Mode Tabs */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.06] border border-white/10">
          {[
            { id: 'wave', label: 'Waveform', icon: Activity },
            { id: 'bars', label: 'Spectrum', icon: Radio },
            { id: 'radial', label: 'Orbital Ring', icon: Disc },
            { id: 'matrix', label: 'Matrix Rain', icon: Layers },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setVisualizerMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                visualizerMode === m.id
                  ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black shadow-lg font-bold'
                  : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
              }`}
            >
              <m.icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Theme Picker & Window Controls */}
        <div className="flex items-center gap-2">
          {/* Themes */}
          <div className="flex items-center gap-1.5 mr-2">
            {Object.keys(THEMES).map(k => (
              <button
                key={k}
                onClick={() => setActiveThemeKey(k)}
                className={`w-6 h-6 rounded-full transition-transform ${
                  activeThemeKey === k ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${THEMES[k].primary}, ${THEMES[k].secondary})`,
                }}
                title={THEMES[k].name}
              />
            ))}
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#94a3b8] hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsVisualizerOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-[#94a3b8] hover:text-red-400 transition-colors"
            title="Close Visualizer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* CENTER: Canvas Stage */}
      <main className="relative flex-1 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Radial Center Album Art Overlay (Only shown in radial mode) */}
        {visualizerMode === 'radial' && currentTrack && (
          <div className="absolute pointer-events-none flex flex-col items-center justify-center">
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_40px_rgba(0,240,255,0.4)] ${isPlaying ? 'animate-spin-vinyl' : ''}`}>
              <img 
                src={currentTrack.coverArt} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Floating Quick Controls Toggle */}
        <div className="absolute top-4 left-6 flex items-center gap-4 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[#94a3b8] text-[11px]">Boost</span>
            <input 
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#94a3b8] hover:text-white">
            <input 
              type="checkbox"
              checked={enableParticles}
              onChange={(e) => setEnableParticles(e.target.checked)}
              className="rounded accent-cyan-400"
            />
            <span className="text-[11px]">Particles</span>
          </label>
        </div>
      </main>

      {/* BOTTOM DOCK: Track Info & Playback Controls */}
      <footer className="relative z-20 px-6 py-4 border-t border-white/[0.08] bg-[#070b16]/80 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Current Song */}
          <div className="flex items-center gap-3.5 min-w-0 sm:w-1/3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/10 flex-shrink-0">
              <img 
                src={currentTrack?.coverArt} 
                alt={currentTrack?.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">
                {currentTrack?.title || 'No track selected'}
              </span>
              <span className="text-xs text-[#94a3b8] truncate">
                {currentTrack?.artist || 'PlayMusic'}
              </span>
            </div>
          </div>

          {/* Central Playback Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 w-full sm:w-1/2 max-w-md">
            <div className="flex items-center gap-4">
              <button 
                onClick={playPreviousTrack}
                className="text-[#94a3b8] hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-black text-black" /> : <Play className="w-5 h-5 fill-black text-black translate-x-0.5" />}
              </button>

              <button 
                onClick={playNextTrack}
                className="text-[#94a3b8] hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Scrubber */}
            <div className="w-full flex items-center gap-2 text-xs font-mono text-[#94a3b8]">
              <span className="tabular-nums">{formatTime(playbackProgress)}</span>
              <div className="relative flex-1 flex items-center py-1">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <input 
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={playbackProgress || 0}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <span className="tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center justify-end gap-2 sm:w-1/3">
            <button 
              onClick={toggleMute}
              className="text-[#94a3b8] hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
