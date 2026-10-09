import React from 'react';

const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' };

export const PlayIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 3.5v17a1 1 0 0 0 1.5.87l14-8.5a1 1 0 0 0 0-1.74l-14-8.5A1 1 0 0 0 5 3.5z" />
  </svg>
);
export const PauseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);
export const PlusIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);
export const CheckIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M4.5 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ThumbUpIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm0 0l3.2-6.6A2 2 0 0 1 12 3.5h.2a1.8 1.8 0 0 1 1.8 1.8V10h4.5a2 2 0 0 1 2 2.3l-1.1 6a2 2 0 0 1-2 1.7H7" strokeLinejoin="round" />
  </svg>
);
export const ThumbDownIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 13V4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3zm0 0l-3.2 6.6a2 2 0 0 1-1.8 1H11.8a1.8 1.8 0 0 1-1.8-1.8V14H5.5a2 2 0 0 1-2-2.3l1.1-6a2 2 0 0 1 2-1.7H17" strokeLinejoin="round" />
  </svg>
);
export const ChevronDownIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ChevronLeftIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ChevronRightIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const InfoIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5v.5" strokeLinecap="round" />
  </svg>
);
export const SearchIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" strokeLinecap="round" />
  </svg>
);
export const BellIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16zM10 20a2 2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);
export const VolumeIcon = ({ muted, level = 1, ...p }) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" strokeLinejoin="round" />
    {muted || level === 0 ? (
      <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
    ) : (
      <>
        <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" strokeLinecap="round" />
        {level > 0.5 && <path d="M18 7a7 7 0 0 1 0 10" strokeLinecap="round" />}
      </>
    )}
  </svg>
);
export const BackIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M20 12H5M11 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Replay10Icon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 5a7.5 7.5 0 1 1-6.5 3.7" strokeLinecap="round" />
    <path d="M5 3.5v5h5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="12" y="16" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">10</text>
  </svg>
);
export const Forward10Icon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 5a7.5 7.5 0 1 0 6.5 3.7" strokeLinecap="round" />
    <path d="M19 3.5v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="12" y="16" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">10</text>
  </svg>
);
export const FullscreenIcon = ({ exit, ...p }) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2">
    {exit ? (
      <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);
export const SpeedIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 16a8 8 0 1 1 16 0" strokeLinecap="round" />
    <path d="M12 16l4-5" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.2" fill="currentColor" />
  </svg>
);
export const EpisodesIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M8 5v14" />
  </svg>
);
export const PencilIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4z" strokeLinejoin="round" />
  </svg>
);
export const CaretIcon = (p) => (
  <svg {...base} {...p} fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);
export const ReplayIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5a7 7 0 1 1-6.3 4" strokeLinecap="round" />
    <path d="M5 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
