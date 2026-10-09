import React, { useEffect, useRef, useState } from 'react';
import { navigate } from '../router';
import { useApp } from '../context/AppContext';
import { PlayIcon, PlusIcon, CheckIcon, ThumbUpIcon, ChevronDownIcon, VolumeIcon } from './Icons';

export function metaLine(item) {
  return item.type === 'series' ? `${item.seasons} Season${item.seasons > 1 ? 's' : ''}` : item.duration;
}

/**
 * A poster tile. After hovering for a moment it expands into a preview card with
 * an auto-playing muted clip and quick actions, like the real browse page.
 */
export default function Card({ item, rank, progress, edge }) {
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

  return (
    <div className={`card ${expanded ? 'is-expanded' : ''} ${edge ? `card--${edge}` : ''}`} onMouseEnter={enter} onMouseLeave={leave}>
      <div className="card__tile" onClick={() => openModal(item.id)}>
        {rank && (
          <div className="card__rank">
            <span>{rank}</span>
          </div>
        )}
        <img className="card__img" src={item.poster} alt={item.title} loading="lazy" />
        {rank && <div className="card__rank-title">{item.title}</div>}
        {item.isNew && !rank && <span className="card__new">New</span>}
        {item.top10 && !rank && <span className="card__top10">TOP 10</span>}
        {pct != null && (
          <div className="card__progress">
            <div style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>

      {expanded && (
        <div className="preview">
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
