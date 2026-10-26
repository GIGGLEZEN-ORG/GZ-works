// HTML5 audio playback engine
class AudioEngine {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';

    this.currentSongId = null;
    this.playbackErrorReported = false;
    this.volume = 1;
    this.audioElement.volume = this.volume;

    this.onTimeUpdateCallback = null;
    this.onEndedCallback = null;
    this.onBufferingCallback = null;
    this.onErrorCallback = null;

    // Time update listener
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(
          this.audioElement.currentTime,
          this.audioElement.duration || 0
        );
      }
    });

    // Ended listener
    this.audioElement.addEventListener('ended', () => {
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    });

    // Buffering & loading states
    this.audioElement.addEventListener('waiting', () => {
      if (this.onBufferingCallback) this.onBufferingCallback(true);
    });

    this.audioElement.addEventListener('playing', () => {
      if (this.onBufferingCallback) this.onBufferingCallback(false);
    });

    this.audioElement.addEventListener('canplay', () => {
      if (this.onBufferingCallback) this.onBufferingCallback(false);
    });

    this.audioElement.addEventListener('error', () => {
      console.warn("HTML5 audio playback error event:", this.audioElement.error);
      this.reportPlaybackError(this.audioElement.error);
    });
  }

  reportPlaybackError(error) {
    if (this.playbackErrorReported) return;
    this.playbackErrorReported = true;
    this.audioElement.pause();
    if (this.onBufferingCallback) this.onBufferingCallback(false);
    if (this.onErrorCallback) this.onErrorCallback(error, this.currentSongId);
  }

  playTrack(track, startTime = 0) {
    if (!track) return;
    this.stop();
    this.currentSongId = track.id;
    this.playbackErrorReported = false;

    if (this.onBufferingCallback) this.onBufferingCallback(true);

    if (!track.audioSrc) {
      this.reportPlaybackError(Object.assign(new Error('No audio source is available.'), { code: 4 }));
      return;
    }

    this.audioElement.src = track.audioSrc;

    if (startTime > 0) {
      const handleMetadata = () => {
        try {
          this.audioElement.currentTime = startTime;
        } catch (e) {
          console.warn("Could not seek to startTime:", e);
        }
        this.audioElement.removeEventListener('loadedmetadata', handleMetadata);
      };
      this.audioElement.addEventListener('loadedmetadata', handleMetadata);
    }

    this.audioElement.play()
      .then(() => {
        if (this.onBufferingCallback) this.onBufferingCallback(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.warn("HTML5 audio playback failed:", err);
        this.reportPlaybackError(err);
      });
  }

  pause() {
    this.audioElement.pause();
    if (this.onBufferingCallback) this.onBufferingCallback(false);
  }

  resume(track, currentTime = 0) {
    if (!track) return;

    if (!this.audioElement.src || this.currentSongId !== track.id) {
      this.playTrack(track, currentTime);
      return;
    }

    this.playbackErrorReported = false;
    if (this.onBufferingCallback) this.onBufferingCallback(true);
    this.audioElement.play()
      .then(() => {
        if (this.onBufferingCallback) this.onBufferingCallback(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        this.reportPlaybackError(err);
      });
  }

  stop() {
    this.audioElement.pause();
    try {
      this.audioElement.currentTime = 0;
    } catch {}
    if (this.onBufferingCallback) this.onBufferingCallback(false);
  }

  seek(seconds) {
    try {
      if (!isNaN(seconds) && isFinite(seconds) && seconds >= 0) {
        this.audioElement.currentTime = seconds;
      }
    } catch (e) {
      console.warn("Seek error:", e);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audioElement.volume = this.volume;
  }
}

export const audioEngine = new AudioEngine();
