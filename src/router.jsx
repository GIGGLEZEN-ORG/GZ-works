import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Minimal hash-based router (no external dependency).
// Routes look like  #/browse?genre=Action  or  #/watch/sintel?ep=2

const RouterContext = createContext(null);

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const query = {};
  new URLSearchParams(queryPart).forEach((v, k) => (query[k] = v));
  return { path: pathPart || '/', query };
}

export function navigate(path, { replace = false } = {}) {
  const target = `#${path}`;
  if (replace) {
    const url = window.location.pathname + window.location.search + target;
    window.history.replaceState(null, '', url);
    // Fire asynchronously (like a real hash change) so listeners registered in
    // parent effects always receive it.
    setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 0);
  } else {
    window.location.hash = path;
  }
}

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return <RouterContext.Provider value={route}>{children}</RouterContext.Provider>;
}

export function useRoute() {
  return useContext(RouterContext);
}

// Matches "/watch/:id" style patterns and returns params or null.
export function matchPath(pattern, path) {
  const p = pattern.split('/').filter(Boolean);
  const a = path.split('/').filter(Boolean);
  if (p.length !== a.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(a[i]);
    else if (p[i] !== a[i]) return null;
  }
  return params;
}

export function Link({ to, children, className, onClick, ...rest }) {
  const handle = useCallback(
    (e) => {
      if (onClick) onClick(e);
      if (e.defaultPrevented) return;
      e.preventDefault();
      navigate(to);
    },
    [to, onClick]
  );
  return (
    <a href={`#${to}`} className={className} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
