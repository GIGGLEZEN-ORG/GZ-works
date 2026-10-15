import React from 'react';
import { useApp } from '../context/AppContext';
import { TITLES } from '../data/titles';
import Card from '../components/Card';

export default function MyList() {
  const { myList } = useApp();
  const items = myList.map((id) => TITLES.find((t) => t.id === id)).filter(Boolean);

  return (
    <main className="search-page my-list">
      <h1 className="page-title">My List</h1>
      {items.length === 0 ? (
        <div className="search-page__empty">
          <p>You haven't added any titles to your list yet.</p>
          <p>Hover over a title and press the + button to save it here.</p>
        </div>
      ) : (
        <div className="grid">
          {items.map((t) => (
            <div className="grid__slot" key={t.id}>
              <Card item={t} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
