import React from 'react';

export const AVATAR_COLORS = {
  blue: ['#1d7bd4', '#0b3f73'],
  red: ['#e50914', '#7a0c12'],
  yellow: ['#f3b21b', '#9a6a05'],
  green: ['#2fa84f', '#115a26'],
  purple: ['#7b4ddb', '#3d1f7a'],
  grey: ['#6b6b6b', '#2d2d2d'],
};

// Simple generated avatar: coloured tile with a stylised face. Each colour gets a slightly
// different expression so the profiles feel distinct without using any brand artwork.
export default function Avatar({ color = 'blue', size = 44, className = '', style }) {
  const [c1, c2] = AVATAR_COLORS[color] || AVATAR_COLORS.blue;
  const mood = ['blue', 'green'].includes(color) ? 'smile' : color === 'red' ? 'grin' : color === 'yellow' ? 'wow' : 'cool';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`avatar ${className}`}
      style={{ borderRadius: 4, flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`g-${color}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#g-${color})`} />
      {/* eyes */}
      {mood === 'cool' ? (
        <>
          <rect x="22" y="36" width="22" height="12" rx="3" fill="#111" />
          <rect x="56" y="36" width="22" height="12" rx="3" fill="#111" />
          <rect x="44" y="39" width="12" height="4" fill="#111" />
        </>
      ) : (
        <>
          <ellipse cx="34" cy="40" rx="7" ry={mood === 'wow' ? 10 : 8} fill="#111" />
          <ellipse cx="66" cy="40" rx="7" ry={mood === 'wow' ? 10 : 8} fill="#111" />
          <circle cx="36.5" cy="37" r="2.5" fill="#fff" />
          <circle cx="68.5" cy="37" r="2.5" fill="#fff" />
        </>
      )}
      {/* mouth */}
      {mood === 'smile' && <path d="M30 62 Q50 80 70 62" stroke="#111" strokeWidth="6" fill="none" strokeLinecap="round" />}
      {mood === 'grin' && <path d="M28 60 Q50 88 72 60 Z" fill="#111" />}
      {mood === 'wow' && <ellipse cx="50" cy="68" rx="9" ry="11" fill="#111" />}
      {mood === 'cool' && <path d="M34 66 Q50 74 66 66" stroke="#111" strokeWidth="6" fill="none" strokeLinecap="round" />}
    </svg>
  );
}
