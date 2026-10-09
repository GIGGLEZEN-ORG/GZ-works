import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { navigate, useRoute } from '../router';
import { useApp } from '../context/AppContext';
import { byId } from '../data/titles';
import {
  PlayIcon, PauseIcon, Replay10Icon, Forward10Icon, VolumeIcon, FullscreenIcon,
  BackIcon, SpeedIcon, EpisodesIcon,
} from '../components/Icons';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

function fmt(s) {
  if (!isFinite(s)) return '0:00';
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
}

export default function Watch({ id }) {
  const { query } = useRoute();
  const { saveProgress, progress, clearProgress } = useApp();
  const item = byId(id);

  const season = Number(query.s || 1);
  const epNum = query.ep ? Number(query.ep) : null;
  const episode = item?.episodes && epNum ? item.episodes.find((e) => e.id === epNum) : null;
  const nextEpisode = episode ? item.episodes.find((e) => e.id === episode.id + 1) : null;
  const progressKey = episode ? `${item.id}:s${season}e${episode.id}` : item?.id;
  const src = episode ? episode.video : item?.video;

  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimer = useRef(null);
  const lastSave = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [controls, setControls] = useState(true);
  const [waiting, setWaiting] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [flash, setFlash] = useState(null); // 'play' | 'pause' | 'fwd' | 'back'
  const [menu, setMenu] = useState(null); // 'speed' | 'episodes'
  const [seekHover, setSeekHover] = useState(null);
  const [ended, setEnded] = useState(false);

  const resumeAt = useMemo(() => {
    const p = progress[progressKey];
    return p && p.time / p.duration < 0.97 ? p.time : 0;
  }, [progressKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- keep controls visible while the mouse moves ----
  const poke = useCallback(() => {
    setControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!videoRef.current?.paused && !menu) setControls(false);
    }, 3000);
  }, [menu]);

  useEffect(() => {
    poke();
    return () => clearTimeout(hideTimer.current);
  }, [poke, playing]);

  // ---- video event wiring ----
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = resumeAt;
    v.playbackRate = speed;
    const p = v.play();
    if (p) p.then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback(
    (force) => {
      const v = videoRef.current;
      if (!v || !item || !v.duration) return;
      const now = Date.now();
      if (!force && now - lastSave.current < 2000) return;
      lastSave.current = now;
      saveProgress(progressKey, { titleId: item.id, time: v.currentTime, duration: v.duration, episode: episode ? { season, id: episode.id, title: episode.title } : null });
    },
    [item, progressKey, saveProgress, episode, season]
  );

  // Save once more when leaving the player (ref so the effect only runs on unmount).
  const persistRef = useRef(persist);
  persistRef.current = persist;
  useEffect(() => () => persistRef.current(true), []);

  const showFlash = (kind) => {
    setFlash(kind);
    setTimeout(() => setFlash(null), 500);
  };

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      showFlash('play');
    } else {
      v.pause();
      showFlash('pause');
    }
  }, []);

  const seekBy = useCallback((delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(v.duration || 0, Math.max(0, v.currentTime + delta));
    showFlash(delta > 0 ? 'fwd' : 'back');
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // ---- keyboard shortcuts ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
          seekBy(-10);
          break;
        case 'ArrowRight':
        case 'l':
          seekBy(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((vol) => Math.min(1, vol + 0.1));
          setMuted(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((vol) => Math.max(0, vol - 0.1));
          break;
        case 'm':
          setMuted((m) => !m);
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'Escape':
          if (!document.fullscreenElement) navigate('/browse');
          break;
        default:
          return;
      }
      poke();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, seekBy, toggleFullscreen, poke]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.volume = volume;
      v.muted = muted;
    }
  }, [volume, muted]);
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed]);

  if (!item) {
    return (
      <div className="watch watch--missing">
        <p>Title not found.</p>
        <button className="btn btn--white" type="button" onClick={() => navigate('/browse')}>
          Back to Browse
        </button>
      </div>
    );
  }

  const onSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    if (videoRef.current && duration) videoRef.current.currentTime = pct * duration;
  };
  const onSeekMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setSeekHover({ pct, time: pct * duration });
  };

  const pct = duration ? (time / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;
  const showSkipIntro = playing && time > 3 && time < 14 && !episode;
  const showNext = nextEpisode && duration && duration - time < 12;

  const goNext = () => {
    clearProgress(progressKey);
    navigate(`/watch/${item.id}?s=${season}&ep=${nextEpisode.id}`, { replace: true });
  };

  return (
    <div
      ref={wrapRef}
      className={`watch ${controls ? 'has-controls' : 'is-idle'}`}
      onMouseMove={poke}
      onClick={() => menu && setMenu(null)}
    >
      <video
        key={src}
        ref={videoRef}
        className="watch__video"
        src={src}
        playsInline
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => { setPlaying(true); setEnded(false); }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          setTime(e.currentTarget.currentTime);
          persist(false);
        }}
        onProgress={(e) => {
          const b = e.currentTarget.buffered;
          if (b.length) setBuffered(b.end(b.length - 1));
        }}
        onEnded={() => {
          setEnded(true);
          persist(true);
          if (nextEpisode) goNext();
        }}
      />

      {waiting && !ended && (
        <div className="watch__spinner">
          <div />
        </div>
      )}

      {flash && (
        <div className={`watch__flash watch__flash--${flash}`}>
          {flash === 'play' && <PlayIcon width={48} height={48} />}
          {flash === 'pause' && <PauseIcon width={48} height={48} />}
          {flash === 'fwd' && <Forward10Icon width={48} height={48} />}
          {flash === 'back' && <Replay10Icon width={48} height={48} />}
        </div>
      )}

      {!playing && !waiting && !ended && (
        <div className="watch__paused">
          <span>You're watching</span>
          <h2>{item.title}</h2>
          {episode && (
            <h3>
              S{season}:E{episode.id} "{episode.title}"
            </h3>
          )}
          <p>{episode ? episode.description : item.description}</p>
        </div>
      )}

      {ended && !nextEpisode && (
        <div className="watch__ended">
          <h2>{item.title}</h2>
          <div className="watch__ended-actions">
            <button className="btn btn--white" type="button" onClick={() => { videoRef.current.currentTime = 0; videoRef.current.play(); }}>
              <PlayIcon /> Watch Again
            </button>
            <button className="btn btn--grey" type="button" onClick={() => navigate('/browse')}>
              Back to Browse
            </button>
          </div>
        </div>
      )}

      <div className="watch__top">
        <button className="icon-btn watch__back" type="button" aria-label="Back to Browse" onClick={() => navigate('/browse')}>
          <BackIcon width={34} height={34} />
        </button>
      </div>

      {showSkipIntro && (
        <button className="watch__skip" type="button" onClick={() => seekBy(14 - time)}>
          Skip Intro
        </button>
      )}
      {showNext && (
        <button className="watch__skip watch__next" type="button" onClick={goNext}>
          Next Episode
        </button>
      )}

      <div className="watch__controls" onClick={(e) => e.stopPropagation()}>
        <div
          className="seek"
          onClick={onSeekClick}
          onMouseMove={onSeekMove}
          onMouseLeave={() => setSeekHover(null)}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={time}
          aria-label="Seek"
        >
          <div className="seek__track">
            <div className="seek__buffer" style={{ width: `${bufPct}%` }} />
            <div className="seek__fill" style={{ width: `${pct}%` }} />
            <div className="seek__knob" style={{ left: `${pct}%` }} />
          </div>
          {seekHover && (
            <div className="seek__tip" style={{ left: `${seekHover.pct * 100}%` }}>
              {fmt(seekHover.time)}
            </div>
          )}
          <span className="seek__remaining">{fmt(duration - time)}</span>
        </div>

        <div className="controls">
          <div className="controls__group">
            <button className="ctl" type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
              {playing ? <PauseIcon width={32} height={32} /> : <PlayIcon width={32} height={32} />}
            </button>
            <button className="ctl" type="button" aria-label="Back 10 seconds" onClick={() => seekBy(-10)}>
              <Replay10Icon width={32} height={32} />
            </button>
            <button className="ctl" type="button" aria-label="Forward 10 seconds" onClick={() => seekBy(10)}>
              <Forward10Icon width={32} height={32} />
            </button>
            <div className="volume">
              <button className="ctl" type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted((m) => !m)}>
                <VolumeIcon muted={muted} level={volume} width={32} height={32} />
              </button>
              <div className="volume__slider">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setMuted(false);
                  }}
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>

          <div className="controls__title">
            <strong>{item.title}</strong>
            {episode && (
              <span>
                S{season}:E{episode.id} {episode.title}
              </span>
            )}
          </div>

          <div className="controls__group controls__group--right">
            {nextEpisode && (
              <button className="ctl" type="button" aria-label="Next episode" data-tip="Next Episode" onClick={goNext}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 4.5v15a1 1 0 0 0 1.5.87L17 12 6.5 3.63A1 1 0 0 0 5 4.5zM18 4h2v16h-2z" />
                </svg>
              </button>
            )}
            {item.episodes && (
              <div className="menu-wrap">
                <button className="ctl" type="button" aria-label="Episodes" onClick={(e) => { e.stopPropagation(); setMenu(menu === 'episodes' ? null : 'episodes'); }}>
                  <EpisodesIcon width={32} height={32} />
                </button>
                {menu === 'episodes' && (
                  <div className="menu menu--episodes" onClick={(e) => e.stopPropagation()}>
                    <div className="menu__title">
                      {item.title} — Season {season}
                    </div>
                    {item.episodes.map((ep) => (
                      <button
                        key={ep.id}
                        type="button"
                        className={`menu__ep ${episode?.id === ep.id ? 'is-active' : ''}`}
                        onClick={() => {
                          setMenu(null);
                          navigate(`/watch/${item.id}?s=${season}&ep=${ep.id}`, { replace: true });
                        }}
                      >
                        <img src={ep.thumb} alt="" />
                        <div>
                          <div>
                            {ep.id}. {ep.title}
                          </div>
                          <small>{ep.duration}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="menu-wrap">
              <button className="ctl" type="button" aria-label="Playback speed" onClick={(e) => { e.stopPropagation(); setMenu(menu === 'speed' ? null : 'speed'); }}>
                <SpeedIcon width={32} height={32} />
              </button>
              {menu === 'speed' && (
                <div className="menu menu--speed" onClick={(e) => e.stopPropagation()}>
                  <div className="menu__title">Playback Speed</div>
                  <div className="speed">
                    {SPEEDS.map((s) => (
                      <button key={s} type="button" className={s === speed ? 'is-active' : ''} onClick={() => { setSpeed(s); setMenu(null); }}>
                        <span className="speed__dot" />
                        <span className="speed__label">{s === 1 ? 'Normal' : `${s}x`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="ctl" type="button" aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} onClick={toggleFullscreen}>
              <FullscreenIcon exit={fullscreen} width={32} height={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
