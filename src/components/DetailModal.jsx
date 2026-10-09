import React, { useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from '../router';
import { useApp } from '../context/AppContext';
import { TITLES, byId } from '../data/titles';
import { metaLine } from './Card';
import { PlayIcon, PlusIcon, CheckIcon, ThumbUpIcon, ThumbDownIcon, CloseIcon, VolumeIcon } from './Icons';

function similar(item) {
  return TITLES.filter((t) => t.id !== item.id)
    .map((t) => ({ t, score: t.genres.filter((g) => item.genres.includes(g)).length + (t.type === item.type ? 0.5 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 9)
    .map((x) => x.t);
}

export default function DetailModal() {
  const { modalId, closeModal, openModal, inList, toggleList, likes, setLike, progress } = useApp();
  const item = modalId ? byId(modalId) : null;
  const [muted, setMuted] = useState(true);
  const [season, setSeason] = useState(1);
  const [moreOpen, setMoreOpen] = useState(false);
  const videoRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!item) return;
    setSeason(1);
    setMoreOpen(false);
    setMuted(true);
    scrollRef.current?.scrollTo(0, 0);
    document.body.classList.add('modal-open');
    const onKey = (e) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', onKey);
    const v = videoRef.current;
    const t = setTimeout(() => v?.play().catch(() => {}), 400);
    return () => {
      clearTimeout(t);
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [item?.id, closeModal]);

  const related = useMemo(() => (item ? similar(item) : []), [item]);
  if (!item) return null;

  const liked = likes[item.id];
  const saved = progress[item.id];
  const resumePct = saved ? Math.round((saved.time / saved.duration) * 100) : 0;
  const episodeList = item.episodes || [];
  const visibleRelated = moreOpen ? related : related.slice(0, 6);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal" ref={scrollRef} role="dialog" aria-modal="true" aria-label={item.title}>
        <button className="modal__close" type="button" aria-label="Close" onClick={closeModal}>
          <CloseIcon />
        </button>

        <div className="modal__media">
          <img src={item.poster} alt="" />
          <video ref={videoRef} src={item.video} muted={muted} loop playsInline preload="metadata" />
          <div className="modal__media-fade" />
          <div className="modal__hero">
            <h2 className="modal__title">{item.title}</h2>
            <div className="modal__hero-actions">
              <button className="btn btn--white" type="button" onClick={() => navigate(`/watch/${item.id}`)}>
                <PlayIcon /> {saved && resumePct > 0 && resumePct < 97 ? 'Resume' : 'Play'}
              </button>
              <button
                className="round-btn round-btn--lg"
                type="button"
                data-tip={inList(item.id) ? 'Remove from My List' : 'Add to My List'}
                aria-label="My List"
                onClick={() => toggleList(item.id)}
              >
                {inList(item.id) ? <CheckIcon /> : <PlusIcon />}
              </button>
              <button
                className={`round-btn round-btn--lg ${liked === 'up' ? 'is-on' : ''}`}
                type="button"
                data-tip="I like this"
                aria-label="I like this"
                onClick={() => setLike(item.id, 'up')}
              >
                <ThumbUpIcon />
              </button>
              <button
                className={`round-btn round-btn--lg ${liked === 'down' ? 'is-on' : ''}`}
                type="button"
                data-tip="Not for me"
                aria-label="Not for me"
                onClick={() => setLike(item.id, 'down')}
              >
                <ThumbDownIcon />
              </button>
            </div>
          </div>
          <button className="modal__mute" type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted((m) => !m)}>
            <VolumeIcon muted={muted} />
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__cols">
            <div className="modal__main">
              <div className="modal__meta">
                <span className="match">{item.match}% Match</span>
                <span>{item.year}</span>
                <span>{metaLine(item)}</span>
                <span className="hd">HD</span>
                <span className="hd">5.1</span>
              </div>
              <div className="modal__meta modal__meta--secondary">
                <span className="rating-box">{item.rating}</span>
                <span>{item.tags.join(', ')}</span>
              </div>
              {saved && resumePct > 0 && resumePct < 97 && (
                <div className="modal__resume">
                  <div className="modal__resume-bar">
                    <div style={{ width: `${resumePct}%` }} />
                  </div>
                  <span>
                    {Math.floor(saved.time / 60)}m of {Math.floor(saved.duration / 60)}m
                  </span>
                </div>
              )}
              <p className="modal__desc">{item.description}</p>
            </div>
            <div className="modal__side">
              <p>
                <span className="modal__label">Cast:</span> {item.cast.join(', ')}
                {item.cast.length > 2 && <em>, more</em>}
              </p>
              <p>
                <span className="modal__label">Genres:</span>{' '}
                {item.genres.map((g, i) => (
                  <React.Fragment key={g}>
                    <button type="button" className="link-btn" onClick={() => { closeModal(); navigate(`/browse?genre=${encodeURIComponent(g)}`); }}>
                      {g}
                    </button>
                    {i < item.genres.length - 1 ? ', ' : ''}
                  </React.Fragment>
                ))}
              </p>
              <p>
                <span className="modal__label">This {item.type === 'series' ? 'show' : 'film'} is:</span> {item.tags.join(', ')}
              </p>
            </div>
          </div>

          {episodeList.length > 0 && (
            <div className="episodes">
              <div className="episodes__header">
                <h3>Episodes</h3>
                <div className="episodes__season">
                  <select value={season} onChange={(e) => setSeason(Number(e.target.value))} aria-label="Season">
                    {Array.from({ length: item.seasons }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Season {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="episodes__list">
                {episodeList.map((ep) => {
                  const key = `${item.id}:s${season}e${ep.id}`;
                  const p = progress[key];
                  const pct = p ? Math.round((p.time / p.duration) * 100) : 0;
                  return (
                    <button
                      type="button"
                      className="episode"
                      key={ep.id}
                      onClick={() => navigate(`/watch/${item.id}?s=${season}&ep=${ep.id}`)}
                    >
                      <div className="episode__num">{ep.id}</div>
                      <div className="episode__thumb">
                        <img src={ep.thumb} alt="" loading="lazy" />
                        <span className="episode__play">
                          <PlayIcon />
                        </span>
                        {pct > 0 && (
                          <div className="episode__progress">
                            <div style={{ width: `${pct}%` }} />
                          </div>
                        )}
                      </div>
                      <div className="episode__info">
                        <div className="episode__row">
                          <span className="episode__title">{ep.title}</span>
                          <span className="episode__dur">{ep.duration}</span>
                        </div>
                        <p>{ep.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="more-like">
            <h3>More Like This</h3>
            <div className="more-like__grid">
              {visibleRelated.map((t) => (
                <div className="more-like__card" key={t.id} onClick={() => openModal(t.id)}>
                  <div className="more-like__media">
                    <img src={t.poster} alt={t.title} loading="lazy" />
                    <span className="more-like__dur">{metaLine(t)}</span>
                    <span className="more-like__play">
                      <PlayIcon />
                    </span>
                    {t.isNew && <span className="card__new">New</span>}
                  </div>
                  <div className="more-like__body">
                    <div className="more-like__meta">
                      <span className="match">{t.match}% Match</span>
                      <span className="rating-box">{t.rating}</span>
                      <span>{t.year}</span>
                      <button
                        type="button"
                        className="round-btn"
                        aria-label="My List"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleList(t.id);
                        }}
                      >
                        {inList(t.id) ? <CheckIcon width={18} height={18} /> : <PlusIcon width={18} height={18} />}
                      </button>
                    </div>
                    <p>{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {related.length > 6 && (
              <div className="more-like__toggle">
                <button type="button" className={`round-btn ${moreOpen ? 'is-flipped' : ''}`} aria-label="Show more" onClick={() => setMoreOpen((o) => !o)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="about">
            <h3>
              About <strong>{item.title}</strong>
            </h3>
            <p>
              <span className="modal__label">Cast:</span> {item.cast.join(', ')}
            </p>
            <p>
              <span className="modal__label">Genres:</span> {item.genres.join(', ')}
            </p>
            <p>
              <span className="modal__label">This {item.type === 'series' ? 'show' : 'film'} is:</span> {item.tags.join(', ')}
            </p>
            <p className="about__rating">
              <span className="modal__label">Maturity rating:</span> <span className="rating-box">{item.rating}</span>{' '}
              <span>{item.rating === 'U' ? 'Suitable for all ages.' : item.rating === 'A' ? 'Recommended for ages 18 and up.' : 'Parental guidance recommended.'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
