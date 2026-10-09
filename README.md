# JETIX — a streaming-service-style demo app (React + plain JavaScript)

A front-end clone of the Netflix web experience built with **React 18 and plain JS** (no TypeScript, no UI
libraries, no router dependency). All content is dummy data: the clips are the public Google/Blender sample
videos and the posters are placeholder images, so nothing is hosted by you.

## Features

- **Sign in** and **sign up** pages with email, name, and password validation (demo only; nothing is sent anywhere)
- **Who's watching?** profile picker with add / edit / delete profiles and a Children's profile that only shows
  U-rated titles
- **Browse** page: auto-playing hero billboard with mute toggle and collapsing synopsis, horizontally paged rows
  (Trending, Top 10 with big outlined numbers, New Releases, genre rows…), hover-to-expand preview cards with
  muted autoplay and quick actions
- **Detail modal** (also deep-linkable via `#/browse?jbv=<id>`) with trailer preview, Play / Resume, My List,
  like / dislike, cast & genres, **episode list with season selector** for series, More Like This, About
- **Custom video player**: play/pause, ±10 s, volume slider, seek bar with hover timestamp and buffer indicator,
  playback speed, episodes menu, next episode, full screen, Skip Intro, keyboard shortcuts
  (`Space` `←` `→` `↑` `↓` `M` `F` `Esc`), auto-hiding controls, "You're watching" pause overlay
- **Continue Watching** row with progress bars (progress is saved per profile)
- **My List**, **Search** (title / genre / cast / tags with "Explore titles related to"), TV Shows / Movies /
  New & Popular pages with a genre dropdown, notifications dropdown, account menu, footer
- Everything persists in `localStorage` per profile. Responsive down to phone widths.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Project structure

```
index.html
vite.config.js
src/
  main.jsx                 entry point
  App.jsx                  routes + auth guards + layout shell
  router.jsx               tiny hash-based router (Link, navigate, useRoute)
  context/AppContext.jsx   auth, profiles, My List, likes, watch progress, modal, toast
  data/titles.js           dummy catalogue (titles, episodes, row builder)
  components/              Navbar, Hero, Row, Card (hover preview), DetailModal, Footer, Avatar, Icons
  pages/                   Login, Profiles, Browse, Search, MyList, Watch (player)
  styles/                  plain CSS, one file per area
```

## Notes

- Routing uses the URL hash (`#/browse`, `#/watch/sintel?s=1&ep=2`), so the built `dist/` folder can be
  served from any static host or sub-folder without server rewrites.
- To use your own content, edit `src/data/titles.js` — each title needs a `poster` image URL and a `video` URL
  (any format the browser can play).
- This is a learning / portfolio project and is not affiliated with Netflix.
