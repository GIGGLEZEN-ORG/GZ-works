import React, { useEffect } from 'react';
import { RouterProvider, useRoute, matchPath, navigate, Link } from './router';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DetailModal from './components/DetailModal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profiles from './pages/Profiles';
import Browse from './pages/Browse';
import Search from './pages/Search';
import MyList from './pages/MyList';
import Watch from './pages/Watch';
import Landing from './pages/Landing';
import ErrorBoundary from './components/ErrorBoundary';

function Toast() {
  const { toast } = useApp();
  return <div className={`toast ${toast ? 'is-visible' : ''}`}>{toast}</div>;
}

function SimplePage({ title, children }) {
  return (
    <main className="simple-page">
      <h1>{title}</h1>
      {children}
      <Link to="/browse" className="btn btn--white">
        Back to Home
      </Link>
    </main>
  );
}

function Shell({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <DetailModal />
    </>
  );
}

function Routes() {
  const { path } = useRoute();
  const { user, profile, closeModal } = useApp();

  // Close any open modal and reset scroll when the route changes.
  useEffect(() => {
    closeModal();
    window.scrollTo(0, 0);
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- auth guards ----
  const isAuthPage = path === '/' || path === '' || path === '/login' || path === '/signup';
  const needsAuth = !isAuthPage;
  const needsProfile = needsAuth && path !== '/profiles';
  useEffect(() => {
    if (needsAuth && !user) navigate('/', { replace: true });
    else if (needsProfile && !profile) navigate('/profiles', { replace: true });
    else if (isAuthPage && user) navigate(profile ? '/browse' : '/profiles', { replace: true });
  }, [path, user, profile, isAuthPage, needsAuth, needsProfile]);

  if (path === '/' || path === '') return user ? null : <Landing />;
  if (path === '/login') return user ? null : <Login />;
  if (path === '/signup') return user ? null : <Signup />;
  if (!user) return null;
  if (path === '/profiles') return <Profiles />;
  if (!profile) return null;

  let m;
  if ((m = matchPath('/watch/:id', path))) return <Watch key={m.id} id={m.id} />;
  if (path === '/browse') return <Shell><Browse filter="all" /></Shell>;
  if (path === '/browse/series') return <Shell><Browse filter="series" /></Shell>;
  if (path === '/browse/movies') return <Shell><Browse filter="movies" /></Shell>;
  if (path === '/browse/kids') return <Shell><Browse filter="kids" /></Shell>;
  if (path === '/browse/languages') return <Shell><Browse filter="languages" /></Shell>;
  if (path === '/latest') return <Shell><Browse filter="latest" /></Shell>;
  if (path === '/search') return <Shell><Search /></Shell>;
  if (path === '/my-list') return <Shell><MyList /></Shell>;
  if (path === '/account')
    return (
      <Shell>
        <SimplePage title="Account">
          <p>Signed in as <strong>{user.email}</strong>. Membership: Premium (demo). Profiles, My List and watch progress are stored in this browser only.</p>
        </SimplePage>
      </Shell>
    );
  if (path === '/help')
    return (
      <Shell>
        <SimplePage title="Help Centre">
          <p>Keyboard shortcuts in the player: <kbd>Space</kbd> play/pause, <kbd>←</kbd>/<kbd>→</kbd> skip 10s, <kbd>↑</kbd>/<kbd>↓</kbd> volume, <kbd>M</kbd> mute, <kbd>F</kbd> full screen, <kbd>Esc</kbd> back.</p>
        </SimplePage>
      </Shell>
    );
  return (
    <Shell>
      <SimplePage title="Lost your way?">
        <p>Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
      </SimplePage>
    </Shell>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
        <Toast />
      </AppProvider>
    </RouterProvider>
  );
}
