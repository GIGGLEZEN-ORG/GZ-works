import React, { useEffect, useMemo, useState } from 'react';
import { navigate, useRoute } from '../router';
import { useApp } from '../context/AppContext';
import { TITLES, GENRES, buildRows } from '../data/titles';
import Hero from '../components/Hero';
import Row from '../components/Row';
import { CaretIcon, ChevronDownIcon } from '../components/Icons';

const PAGE_TITLES = {
  all: null,
  series: 'TV Shows',
  movies: 'Movies',
  latest: 'New & Popular',
  kids: 'Children & Family',
  languages: 'Browse by Languages',
};

export default function Browse({ filter = 'all' }) {
  const { query } = useRoute();
  const { profile, myList, progress, continueWatching, openModal, modalId } = useApp();
  const genre = query.genre || '';
  const [collapsedRows, setCollapsedRows] = useState({});

  // Deep link: #/browse?jbv=<id> opens the detail modal (mirrors the real site's URL scheme).
  useEffect(() => {
    if (query.jbv && query.jbv !== modalId) openModal(query.jbv);
  }, [query.jbv]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => {
    let l = TITLES;
    if (profile?.kids || filter === 'kids') l = l.filter((t) => t.rating === 'U');
    if (filter === 'series') l = l.filter((t) => t.type === 'series');
    if (filter === 'movies') l = l.filter((t) => t.type === 'movie');
    if (filter === 'latest') l = l.filter((t) => t.isNew || t.trending || t.top10);
    if (genre) l = l.filter((t) => t.genres.includes(genre));
    return l;
  }, [filter, genre, profile]);

  const heroItems = useMemo(() => {
    const pool = list.filter((t) => t.trending || t.isNew);
    let candidates = pool.length ? pool : list;
    if (!candidates.length) return [];
    
    // Ensure G.D.N is first if available
    const gdn = candidates.find((t) => t.id === 'gdn');
    if (gdn) {
      candidates = [gdn, ...candidates.filter((t) => t.id !== 'gdn')];
    }
    return candidates.slice(0, 5);
  }, [list]);

  const rows = useMemo(() => buildRows(list), [list]);
  const cw = continueWatching();
  const progressMap = useMemo(() => {
    const m = {};
    cw.forEach((p) => {
      if (!m[p.item.id]) m[p.item.id] = p;
    });
    return m;
  }, [cw]);
  const myListItems = myList.map((id) => TITLES.find((t) => t.id === id)).filter(Boolean);

  const pageTitle = PAGE_TITLES[filter];
  const showGenrePicker = filter === 'series' || filter === 'movies' || (filter === 'all' && genre);

  const allRowKeys = useMemo(() => {
    const keys = [];
    if (filter === 'all' && !genre && cw.length > 0) keys.push('cw');
    if (filter === 'all' && !genre && myListItems.length > 0) keys.push('mylist');
    rows.forEach((r) => keys.push(r.key));
    return keys;
  }, [filter, genre, cw.length, myListItems.length, rows]);

  const allCollapsed = allRowKeys.length > 0 && allRowKeys.every((k) => !!collapsedRows[k]);

  const toggleRowCollapse = (key) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllRows = () => {
    const shouldCollapse = !allCollapsed;
    const next = {};
    allRowKeys.forEach((k) => {
      next[k] = shouldCollapse;
    });
    setCollapsedRows(next);
  };

  if (!heroItems.length) {
    return (
      <main className="browse browse--empty">
        <h2>No titles in this category yet.</h2>
      </main>
    );
  }

  return (
    <main className="browse">
      {(pageTitle || genre) && (
        <div className="browse__subheader">
          <h1>{genre ? `${genre}` : pageTitle}</h1>
          {(showGenrePicker || genre) && (
            <div className="genre-select">
              <select
                value={genre}
                onChange={(e) => navigate(`${routeFor(filter)}${e.target.value ? `?genre=${encodeURIComponent(e.target.value)}` : ''}`)}
                aria-label="Genres"
              >
                <option value="">Genres</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <CaretIcon width={18} height={18} />
            </div>
          )}
        </div>
      )}

      <Hero items={heroItems} />

      <div className="rows">
        <div className="rows__controls">
          <button
            type="button"
            className="rows__toggle-all"
            onClick={toggleAllRows}
            aria-expanded={!allCollapsed}
            title={allCollapsed ? 'Display cards for all rows' : 'Collapse cards for all rows'}
          >
            <ChevronDownIcon
              width={15}
              height={15}
              className={`rows__toggle-all-icon ${allCollapsed ? 'is-collapsed' : ''}`}
            />
            <span>{allCollapsed ? 'Expand All Rows' : 'Collapse All Rows'}</span>
          </button>
        </div>

        {filter === 'all' && !genre && cw.length > 0 && (
          <Row
            title={`Continue Watching for ${profile?.name || 'you'}`}
            items={cw.map((p) => p.item)}
            progressMap={progressMap}
            collapsed={!!collapsedRows['cw']}
            onToggleCollapse={() => toggleRowCollapse('cw')}
            variant="continue-watching"
          />
        )}
        {filter === 'all' && !genre && myListItems.length > 0 && (
          <Row
            title="My List"
            items={myListItems}
            explore
            collapsed={!!collapsedRows['mylist']}
            onToggleCollapse={() => toggleRowCollapse('mylist')}
            variant="my-list"
          />
        )}
        {rows.map((r) => (
          <Row
            key={r.key}
            title={r.title}
            items={r.items}
            top10={r.top10}
            progressMap={progressMap}
            explore
            collapsed={!!collapsedRows[r.key]}
            onToggleCollapse={() => toggleRowCollapse(r.key)}
            variant={r.key}
          />
        ))}
      </div>
    </main>
  );
}

function routeFor(filter) {
  return filter === 'all' ? '/browse' : `/browse/${filter}`;
}
