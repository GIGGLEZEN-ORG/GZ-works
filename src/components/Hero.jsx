import React, { useEffect, useRef, useState } from 'react';
import { navigate } from '../router';
import { useApp } from '../context/AppContext';
import { PlayIcon, InfoIcon, VolumeIcon, ReplayIcon } from './Icons';

export default function Hero({ items = [] }) {
  const { openModal } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeIndex = currentIndex >= items.length ? 0 : currentIndex;
  const item = items[safeIndex];
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    if (items.length < 2 || isHovered || hasFocus || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % items.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex, hasFocus, isHovered, items.length]);

  useEffect(() => {
    if (!item) return;
    const v = videoRef.current;
    if (!v) return;
    v.load();
    const t = setTimeout(() => {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }, 1500);
    const onEnded = () => {
      setPlaying(false);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    };
    v.addEventListener('ended', onEnded);
    return () => {
      clearTimeout(t);
      v.removeEventListener('ended', onEnded);
    };
  }, [item?.id, items.length]);

  // Collapse the synopsis once the trailer has been playing for a while.
  useEffect(() => {
    if (!playing) {
      setShowInfo(true);
      return;
    }
    const t = setTimeout(() => setShowInfo(false), 6000);
    return () => clearTimeout(t);
  }, [playing]);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };

  if (!item) return null;

  return (
    <section
      className="hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
      }}
    >
      <div className="hero__media">
        <img className={`hero__poster ${playing ? 'is-hidden' : ''}`} src={item.poster} alt="" />
        <video
          ref={videoRef}
          className={`hero__video ${playing ? 'is-visible' : ''}`}
          src={item.video}
          muted={muted}
          playsInline
          preload="metadata"
        />
        <div className="hero__vignette" />
        <div className="hero__bottom-fade" />
      </div>

      <div className={`hero__content ${showInfo ? '' : 'is-collapsed'}`}>
        {item.heroLogo ? (
          <img className="hero__title" src={item.heroLogo} alt={item.title} style={{ width: '100%', maxWidth: '400px', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
        ) : (
          <h1 className="hero__title">{item.title}</h1>
        )}
        <div className="hero__meta" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <span>{item.type === 'series' ? 'Series' : 'Film'}</span>
          {item.genres && item.genres[0] && <span>&bull; {item.genres[0]}</span>}
          {item.year && <span>&bull; {item.year}</span>}
          {item.duration && <span>&bull; {item.duration}</span>}
          {item.rating && <span>&bull; {item.rating}</span>}
        </div>
        <p className="hero__desc">{item.description}</p>
        <div className="hero__actions">
          <button className="btn btn--white" type="button" onClick={() => navigate(`/watch/${item.id}`)}>
            <PlayIcon /> Play
          </button>
          <button className="btn btn--grey" type="button" onClick={() => openModal(item.id)}>
            <InfoIcon /> More Info
          </button>
        </div>
      </div>

      <div className="hero__right">
        <button
          className="hero__mute"
          type="button"
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={() => (playing ? setMuted((m) => !m) : replay())}
        >
          {playing ? <VolumeIcon muted={muted} /> : <ReplayIcon />}
        </button>
      </div>

      {items.length > 1 && (
        <div className="hero__indicators" role="group" aria-label="Featured titles">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === safeIndex ? 'is-active' : ''}
              onClick={() => {
                setCurrentIndex(i);
                setPlaying(false);
                setShowInfo(true);
              }}
              aria-pressed={i === safeIndex}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
