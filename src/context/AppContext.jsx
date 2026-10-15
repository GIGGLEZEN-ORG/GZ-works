import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { byId } from '../data/titles';

const AppContext = createContext(null);

const LS = {
  user: 'nf.user',
  users: 'nf.users',
  profiles: 'nf.profiles',
  currentProfile: 'nf.currentProfile',
  data: 'nf.profileData', // { [profileId]: { myList: [], progress: {}, likes: {} } }
};

const DEFAULT_PROFILES = [
  { id: 'p1', name: 'Sarvesh', avatar: 'blue', kids: false },
  { id: 'p2', name: 'Family', avatar: 'red', kids: false },
  { id: 'p3', name: 'Kids', avatar: 'yellow', kids: true },
];

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function loadActiveUser() {
  const user = load(LS.user, null);
  return user?.expiresAt && Date.now() >= user.expiresAt ? null : user;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(loadActiveUser);
  const [users, setUsers] = useState(() => load(LS.users, []));
  const [profiles, setProfiles] = useState(() => load(LS.profiles, DEFAULT_PROFILES));
  const [currentProfileId, setCurrentProfileId] = useState(() =>
    loadActiveUser() ? load(LS.currentProfile, null) : null
  );
  const [profileData, setProfileData] = useState(() => load(LS.data, {}));
  const [modalId, setModalId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => save(LS.user, user), [user]);
  useEffect(() => save(LS.users, users), [users]);
  useEffect(() => save(LS.profiles, profiles), [profiles]);
  useEffect(() => save(LS.currentProfile, currentProfileId), [currentProfileId]);
  useEffect(() => save(LS.data, profileData), [profileData]);

  useEffect(() => {
    if (!user?.expiresAt) return undefined;
    const timeout = window.setTimeout(() => {
      if (Date.now() >= user.expiresAt) {
        setUser(null);
        setCurrentProfileId(null);
      }
    }, Math.max(0, user.expiresAt - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [user]);

  const profile = profiles.find((p) => p.id === currentProfileId) || null;
  const data = (profile && profileData[profile.id]) || { myList: [], progress: {}, likes: {} };

  const updateData = useCallback(
    (fn) => {
      if (!profile) return;
      setProfileData((prev) => {
        const cur = prev[profile.id] || { myList: [], progress: {}, likes: {} };
        return { ...prev, [profile.id]: fn(cur) };
      });
    },
    [profile]
  );

  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(showToast.t);
    showToast.t = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const api = useMemo(
    () => ({
      user,
      register: (email, password, name) => {
        setUsers((prev) => {
          const existing = prev.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
          return [...existing, { email: email.toLowerCase(), password, name }];
        });
        setUser({ email: email.toLowerCase(), name, since: Date.now() });
      },
      authenticate: (email, password) => {
        const lowerEmail = email.toLowerCase();
        if (lowerEmail === 'demo@nextflix.app' && password === 'Demo@1234') {
          setUser({ email: lowerEmail, name: 'Demo User', since: Date.now() });
          return true;
        }
        const found = users.find((u) => u.email.toLowerCase() === lowerEmail && u.password === password);
        if (found) {
          setUser({ email: found.email, name: found.name, since: Date.now() });
          return true;
        }
        return false;
      },
      authenticateWithCode: (email) => {
        const lowerEmail = email.toLowerCase();
        const expiresAt = Date.now() + 60_000;
        if (lowerEmail === 'demo@nextflix.app') {
          setUser({ email: lowerEmail, name: 'Demo User', since: Date.now(), expiresAt });
          return true;
        }
        const found = users.find((u) => u.email.toLowerCase() === lowerEmail);
        if (!found) return false;
        setUser({ email: found.email, name: found.name, since: Date.now(), expiresAt });
        return true;
      },
      logout: () => {
        setUser(null);
        setCurrentProfileId(null);
      },

      profiles,
      profile,
      selectProfile: (id) => setCurrentProfileId(id),
      addProfile: (name, avatar, kids = false) =>
        setProfiles((p) => [...p, { id: `p${Date.now()}`, name, avatar, kids }]),
      updateProfile: (id, patch) => setProfiles((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x))),
      deleteProfile: (id) => {
        setProfiles((p) => p.filter((x) => x.id !== id));
        if (currentProfileId === id) setCurrentProfileId(null);
      },

      myList: data.myList,
      inList: (id) => data.myList.includes(id),
      toggleList: (id) => {
        const was = data.myList.includes(id);
        updateData((d) => ({
          ...d,
          myList: was ? d.myList.filter((x) => x !== id) : [id, ...d.myList],
        }));
        showToast(was ? 'Removed from My List' : 'Added to My List');
      },

      likes: data.likes,
      setLike: (id, value) =>
        updateData((d) => ({ ...d, likes: { ...d.likes, [id]: d.likes[id] === value ? null : value } })),

      progress: data.progress,
      saveProgress: (key, info) =>
        updateData((d) => ({ ...d, progress: { ...d.progress, [key]: { ...info, updatedAt: Date.now() } } })),
      clearProgress: (key) =>
        updateData((d) => {
          const next = { ...d.progress };
          delete next[key];
          return { ...d, progress: next };
        }),
      continueWatching: () =>
        Object.entries(data.progress)
          .map(([key, p]) => ({ key, ...p, item: byId(p.titleId) }))
          .filter((p) => p.item && p.time > 5 && p.time / p.duration < 0.97)
          .sort((a, b) => b.updatedAt - a.updatedAt),

      modalId,
      openModal: (id) => setModalId(id),
      closeModal: () => setModalId(null),

      toast,
      showToast,
    }),
    [user, users, profiles, profile, currentProfileId, data, updateData, modalId, toast, showToast]
  );

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
