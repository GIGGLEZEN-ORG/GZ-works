import React, { useMemo } from 'react';
import { navigate, useRoute } from '../router';
import { useApp } from '../context/AppContext';
import { TITLES } from '../data/titles';
import Card from '../components/Card';

function score(t, q) {
  const s = q.toLowerCase();
  let n = 0;
  if (t.title.toLowerCase().includes(s)) n += 10;
  if (t.genres.some((g) => g.toLowerCase().includes(s))) n += 5;
  if (t.tags.some((g) => g.toLowerCase().includes(s))) n += 3;
  if (t.cast.some((c) => c.toLowerCase().includes(s))) n += 4;
  if (t.description.toLowerCase().includes(s)) n += 1;
  return n;
}

export default function Search() {
  const { query } = useRoute();
  const { profile } = useApp();
  const q = (query.q || '').trim();

  const results = useMemo(() => {
    if (!q) return [];
    let l = TITLES;
    if (profile?.kids) l = l.filter((t) => t.rating === 'U');
    return l
      .map((t) => ({ t, n: score(t, q) }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .map((x) => x.t);
  }, [q, profile]);

  const related = useMemo(() => {
    const set = new Set();
    results.slice(0, 4).forEach((t) => t.genres.forEach((g) => set.add(g)));
    return Array.from(set).slice(0, 8);
  }, [results]);

  return (
    <main className="search-page">
      {q && results.length > 0 && (
        <div className="search-page__related">
          <span>Explore titles related to:</span>
          {related.map((g) => (
            <button type="button" key={g} onClick={() => navigate(`/search?q=${encodeURIComponent(g)}`)}>
              {g}
            </button>
          ))}
        </div>
      )}
      {q && results.length === 0 && (
        <div className="search-page__empty">
          <p>Your search for "{q}" did not have any matches.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Try different keywords</li>
            <li>Looking for a movie or TV show?</li>
            <li>Try using a movie, TV show title, an actor or director</li>
            <li>Try a genre, like comedy, romance, sports or drama</li>
          </ul>
        </div>
      )}
      <div className="grid">
        {results.map((t) => (
          <div className="grid__slot" key={t.id}>
            <Card item={t} />
          </div>
        ))}
      </div>
    </main>
  );
}
