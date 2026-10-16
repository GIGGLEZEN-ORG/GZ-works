// Advanced Web Audio procedural synth & audio player
class AudioEngine {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.preload = 'auto';

    this.audioCtx = null;
    this.isSynthPlaying = false;
    this.synthTimer = null;
    this.currentSongId = null;

    // Track active tone oscillators for clean shutoff
    this.activeNodes = [];

    this.onTimeUpdateCallback = null;
    this.onEndedCallback = null;
    this.volume = 1;

    this.audioElement.volume = this.volume;

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.onTimeUpdateCallback && !this.isSynthPlaying) {
        this.onTimeUpdateCallback(this.audioElement.currentTime, this.audioElement.duration || 0);
      }
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    });
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playTrack(track, startTime = 0) {
    this.stop();
    this.currentSongId = track.id;

    if (track.audioSrc) {
      this.audioElement.src = track.audioSrc;
      this.audioElement.currentTime = startTime;

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("HTML5 audio playback blocked or failed, falling back to Web Audio Synth:", err);
          this.startProceduralMusic(track, startTime);
        });
      }
    } else {
      this.startProceduralMusic(track, startTime);
    }
  }

  pause() {
    this.audioElement.pause();
    this.stopProceduralMusic();
  }

  resume(track, currentTime = 0) {
    if (this.isSynthPlaying) {
      this.startProceduralMusic(track, currentTime);
    } else if (this.audioElement.src) {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.startProceduralMusic(track, currentTime);
        });
      }
    } else {
      this.startProceduralMusic(track, currentTime);
    }
  }

  stop() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.stopProceduralMusic();
  }

  seek(seconds) {
    if (this.isSynthPlaying) {
      this.synthCurrentTime = seconds;
    } else {
      try {
        this.audioElement.currentTime = seconds;
      } catch (e) {
        // seek error handle
      }
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audioElement.volume = this.volume;
    if (this.synthMasterGain) {
      this.synthMasterGain.gain.setValueAtTime(this.volume * 0.3, this.audioCtx?.currentTime || 0);
    }
  }

  // Musical procedural audio synthesizer
  startProceduralMusic(track, startTime = 0) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.isSynthPlaying = true;
      this.synthCurrentTime = startTime;
      const duration = track.duration || 180;

      this.synthMasterGain = ctx.createGain();
      this.synthMasterGain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
      this.synthMasterGain.connect(ctx.destination);

      // Pentatonic / pleasant chord frequencies
      const chords = [
        [261.63, 329.63, 392.00], // C major
        [220.00, 261.63, 329.63], // A minor
        [174.61, 220.00, 261.63], // F major
        [196.00, 246.94, 293.66], // G major
      ];

      let beatIndex = 0;
      const bpm = track.genre === 'Lo-Fi' ? 76 : (track.genre === 'Pop' ? 116 : 100);
      const intervalMs = (60 / bpm) * 500;

      const playChordTick = () => {
        if (!this.isSynthPlaying) return;
        const currentChord = chords[Math.floor(beatIndex / 4) % chords.length];
        const noteFreq = currentChord[beatIndex % currentChord.length];

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = track.genre === 'Lo-Fi' ? 'sine' : (track.genre === 'Rock' ? 'sawtooth' : 'triangle');
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

        osc.connect(noteGain);
        noteGain.connect(this.synthMasterGain);

        osc.start();
        osc.stop(ctx.currentTime + 0.65);

        beatIndex++;
        this.synthCurrentTime += (intervalMs / 1000);

        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.synthCurrentTime, duration);
        }

        if (this.synthCurrentTime >= duration) {
          this.stopProceduralMusic();
          if (this.onEndedCallback) this.onEndedCallback();
        } else {
          this.synthTimer = setTimeout(playChordTick, intervalMs);
        }
      };

      playChordTick();
    } catch (e) {
      console.error("Synth error:", e);
    }
  }

  stopProceduralMusic() {
    this.isSynthPlaying = false;
    if (this.synthTimer) {
      clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
  }
}

export const audioEngine = new AudioEngine();
