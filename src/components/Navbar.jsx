import React, { useEffect, useRef, useState } from 'react';
import { Link, navigate, useRoute } from '../router';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';
import { SearchIcon, BellIcon, CaretIcon, CloseIcon, PencilIcon } from './Icons';
import { TITLES } from '../data/titles';

export function Logo({ className = '' }) {
  return (
    <Link to="/browse" className={`logo ${className}`} aria-label="JETIX home">
      JETIX
    </Link>
  );
}

const NAV = [
  { to: '/browse', label: 'Home' },
  { to: '/browse/series', label: 'TV Shows' },
  { to: '/browse/movies', label: 'Movies' },
  { to: '/latest', label: 'New & Popular' },
  { to: '/my-list', label: 'My List' },
];

export default function Navbar() {
  const { path, query } = useRoute();
  const { profile, profiles, selectProfile, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(path === '/search');
  const [q, setQ] = useState(query.q || '');
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const inputRef = useRef(null);
  const prevPath = useRef(path);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // Keep input in sync when landing on /search?q=
  useEffect(() => {
    if (path === '/search') {
      setSearchOpen(true);
      setQ(query.q || '');
    }
  }, [path, query.q]);

  const onSearchChange = (e) => {
    const value = e.target.value;
    setQ(value);
    if (value.trim()) {
      if (path !== '/search') prevPath.current = path;
      navigate(`/search?q=${encodeURIComponent(value)}`, { replace: path === '/search' });
    } else if (path === '/search') {
      navigate(prevPath.current && prevPath.current !== '/search' ? prevPath.current : '/browse', { replace: true });
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQ('');
    if (path === '/search') navigate(prevPath.current && prevPath.current !== '/search' ? prevPath.current : '/browse');
  };

  const isActive = (to) => path === to;
  const newTitles = TITLES.filter((t) => t.isNew).slice(0, 4);

  return (
    <header className={`navbar ${scrolled ? 'navbar--solid' : ''}`}>
      <div className="navbar__left">
        <Logo />
        <nav className="navbar__links">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={`navbar__link ${isActive(n.to) ? 'is-active' : ''}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="navbar__browse" onMouseEnter={() => setBrowseOpen(true)} onMouseLeave={() => setBrowseOpen(false)}>
          <button className="navbar__browse-btn" type="button">
            Browse <CaretIcon width={18} height={18} />
          </button>
          {browseOpen && (
            <div className="dropdown dropdown--browse">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className={`dropdown__item ${isActive(n.to) ? 'is-active' : ''}`}>
                  {n.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="navbar__right">
        <div className={`navbar__search ${searchOpen ? 'is-open' : ''}`}>
          <button className="icon-btn" type="button" aria-label="Search" onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}>
            <SearchIcon />
          </button>
          <input
            ref={inputRef}
            value={q}
            onChange={onSearchChange}
            onBlur={() => !q && setSearchOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
            placeholder="Titles, people, genres"
            aria-label="Search"
          />
          {q && (
            <button className="icon-btn navbar__search-clear" type="button" aria-label="Clear" onClick={closeSearch}>
              <CloseIcon width={18} height={18} />
            </button>
          )}
        </div>

        <Link to="/browse/kids" className="navbar__kids">
          Children
        </Link>

        <div className="navbar__notif" onMouseEnter={() => setNotifOpen(true)} onMouseLeave={() => setNotifOpen(false)}>
          <button className="icon-btn" type="button" aria-label="Notifications">
            <BellIcon />
            <span className="navbar__badge">{newTitles.length}</span>
          </button>
          {notifOpen && (
            <div className="dropdown dropdown--notif">
              {newTitles.map((t) => (
                <button key={t.id} type="button" className="notif" onClick={() => navigate(`/browse?jbv=${t.id}`)}>
                  <img src={t.poster} alt="" />
                  <div>
                    <div className="notif__title">New Arrival</div>
                    <div className="notif__sub">{t.title} is now available</div>
                    <div className="notif__time">2 days ago</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="navbar__profile" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
          <button className="navbar__profile-btn" type="button" aria-label="Account menu">
            <Avatar color={profile?.avatar || 'blue'} size={32} />
            <CaretIcon width={18} height={18} className={`caret ${menuOpen ? 'is-open' : ''}`} />
          </button>
          {menuOpen && (
            <div className="dropdown dropdown--profile">
              {profiles
                .filter((p) => p.id !== profile?.id)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="dropdown__item dropdown__item--profile"
                    onClick={() => {
                      selectProfile(p.id);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Avatar color={p.avatar} size={32} /> {p.name}
                  </button>
                ))}
              <Link to="/profiles?manage=1" className="dropdown__item dropdown__item--profile">
                <span className="dropdown__pencil">
                  <PencilIcon width={18} height={18} />
                </span>
                Manage Profiles
              </Link>
              <div className="dropdown__sep" />
              <Link to="/profiles" className="dropdown__item">
                Transfer Profile
              </Link>
              <Link to="/account" className="dropdown__item">
                Account
              </Link>
              <Link to="/help" className="dropdown__item">
                Help Centre
              </Link>
              <div className="dropdown__sep" />
              <button
                type="button"
                className="dropdown__item"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Sign out of JETIX
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
