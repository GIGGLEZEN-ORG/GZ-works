import React, { useEffect, useRef, useState } from 'react';
import { navigate } from '../router';
import { useApp } from '../context/AppContext';
import { PlayIcon, PlusIcon, CheckIcon, ThumbUpIcon, ChevronDownIcon, VolumeIcon } from './Icons';

export function metaLine(item) {
  return item.type === 'series' ? `${item.seasons} Season${item.seasons > 1 ? 's' : ''}` : item.duration;
}

function getThemeBadge(variant, item, rank) {
  if (rank) return null;
  if (variant === 'action') {
    const tag = item.tags?.[0] ? item.tags[0].toUpperCase() : 'ACTION';
    return <span className="card__theme-badge card__theme-badge--action">⚡ {tag}</span>;
  }
  if (variant === 'thriller') {
    return <span className="card__theme-badge card__theme-badge--thriller">👁️ SUSPENSE</span>;
  }
  if (variant === 'animation') {
    return <span className="card__theme-badge card__theme-badge--animation">★ FAMILY</span>;
  }
  if (variant === 'docs') {
    return <span className="card__theme-badge card__theme-badge--docs">🏆 DOCUSERIES</span>;
  }
  if (variant === 'trending') {
    return <span className="card__theme-badge card__theme-badge--trending">🔥 TRENDING</span>;
  }
  if (variant === 'scifi') {
    return <span className="card__theme-badge card__theme-badge--scifi">✦ SCI-FI</span>;
  }
  if (variant === 'cars') {
    return <span className="card__theme-badge card__theme-badge--cars">🏁 HIGH SPEED</span>;
  }
  if (variant === 'drama') {
    return <span className="card__theme-badge card__theme-badge--drama">🎭 ACCLAIMED</span>;
  }
  if (variant === 'popular') {
    return <span className="card__theme-badge card__theme-badge--popular">★ {item.match}% MATCH</span>;
  }
  if (variant === 'new') {
    return (
      <span className="card__theme-badge card__theme-badge--new">
        <span className="card__pulse-dot" /> NEW
      </span>
    );
  }
  if (item.isNew) {
    return <span className="card__new">New</span>;
  }
  if (item.top10) {
    return <span className="card__top10">TOP 10</span>;
  }
  return null;
}

/**
 * A poster tile. After hovering for a moment it expands into a preview card with
 * an auto-playing muted clip and quick actions, like the real browse page.
 */
export default function Card({ item, rank, progress, edge, variant }) {
  const { inList, toggleList, openModal, likes, setLike } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [muted, setMuted] = useState(true);
  const timer = useRef(null);
  const videoRef = useRef(null);

  const enter = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setExpanded(true), 450);
  };
  const leave = () => {
    clearTimeout(timer.current);
    setExpanded(false);
    setMuted(true);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (expanded) v.play().catch(() => {});
    else v.pause();
  }, [expanded]);

  const liked = likes[item.id];
  const pct = progress ? Math.min(100, Math.round((progress.time / progress.duration) * 100)) : null;
  const variantClass = variant ? `card--${variant}` : '';

  return (
    <div
      className={`card ${variantClass} ${expanded ? 'is-expanded' : ''} ${edge ? `card--${edge}` : ''}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <div className="card__tile" onClick={() => openModal(item.id)}>
        {rank && (
          <div className="card__rank">
            <span>{rank}</span>
          </div>
        )}
        <img className="card__img" src={item.poster} alt={item.title} loading="lazy" />
        {rank && <div className="card__rank-title">{item.title}</div>}
        <div className="card__quick-info">
          <span className="card__quick-title">{item.title}</span>
          <button
            className="card__quick-play"
            type="button"
            aria-label={`Play ${item.title}`}
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/watch/${item.id}`);
            }}
          >
            <PlayIcon width={15} height={15} />
          </button>
        </div>

        {/* Themed Badge */}
        {getThemeBadge(variant, item, rank)}

        {/* Continue Watching quick play bubble */}
        {variant === 'continue-watching' && (
          <div className="card__play-overlay">
            <div className="card__play-bubble" aria-label="Play">
              <PlayIcon width={22} height={22} />
            </div>
          </div>
        )}

        {/* Row-specific lower overlays */}
        {variant === 'action' && !rank && (
          <div className="card__action-bar">
            <span className="card__action-match">{item.match}% Match</span>
            <span className="card__action-info">{item.duration || `${item.seasons}S`}</span>
          </div>
        )}

        {variant === 'thriller' && !rank && (
          <div className="card__thriller-bar">
            <span className="card__thriller-info">{item.rating} • {item.genres[0]}</span>
          </div>
        )}

        {pct != null && (
          <div className="card__progress">
            <div style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>

      {expanded && (
        <div className={`preview ${variant ? `preview--${variant}` : ''}`}>
          <div className="preview__media" onClick={() => navigate(`/watch/${item.id}`)}>
            <img src={item.poster} alt="" />
            <video ref={videoRef} src={item.video} muted={muted} loop playsInline preload="metadata" />
            <div className="preview__title">{item.title}</div>
            <button
              className="preview__mute"
              type="button"
              aria-label={muted ? 'Unmute' : 'Mute'}
              onClick={(e) => {
                e.stopPropagation();
                setMuted((m) => !m);
              }}
            >
              <VolumeIcon muted={muted} width={18} height={18} />
            </button>
            {pct != null && (
              <div className="preview__progress">
                <div style={{ width: `${pct}%` }} />
              </div>
            )}
          </div>
          <div className="preview__body">
            <div className="preview__actions">
              <button className="round-btn round-btn--white" type="button" aria-label="Play" onClick={() => navigate(`/watch/${item.id}`)}>
                <PlayIcon width={20} height={20} />
              </button>
              <button
                className="round-btn"
                type="button"
                aria-label={inList(item.id) ? 'Remove from My List' : 'Add to My List'}
                data-tip={inList(item.id) ? 'Remove from My List' : 'Add to My List'}
                onClick={() => toggleList(item.id)}
              >
                {inList(item.id) ? <CheckIcon width={20} height={20} /> : <PlusIcon width={20} height={20} />}
              </button>
              <button
                className={`round-btn ${liked === 'up' ? 'is-on' : ''}`}
                type="button"
                aria-label="I like this"
                data-tip="I like this"
                onClick={() => setLike(item.id, 'up')}
              >
                <ThumbUpIcon width={18} height={18} />
              </button>
              <button className="round-btn preview__more" type="button" aria-label="More info" data-tip="Episodes & info" onClick={() => openModal(item.id)}>
                <ChevronDownIcon width={20} height={20} />
              </button>
            </div>
            <div className="preview__meta">
              <span className="match">{item.match}% Match</span>
              <span className="rating-box">{item.rating}</span>
              <span>{metaLine(item)}</span>
              <span className="hd">HD</span>
            </div>
            <ul className="preview__genres">
              {item.genres.slice(0, 3).map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
