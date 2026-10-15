import React, { useEffect, useRef, useState } from 'react';
import { Link, navigate } from '../router';
import { TITLES } from '../data/titles';

const TRENDING_TITLES = TITLES
  .filter((title) => title.trending)
  .sort((a, b) => (a.top10 || Infinity) - (b.top10 || Infinity))
  .slice(0, 10);

const FAQS = [
  {
    question: 'What is JETIX?',
    answer: 'JETIX is a streaming demo where you can explore movies and shows, create profiles, build your list, and pick up where you left off.',
  },
  {
    question: 'How much does JETIX cost?',
    answer: 'This demo is free to explore. The membership details shown on the landing page are sample content; no payment is collected.',
  },
  {
    question: 'Where can I watch?',
    answer: 'Watch on your computer, phone, tablet, or TV using a modern web browser.',
  },
  {
    question: 'How do I cancel?',
    answer: 'There is no paid subscription to cancel. You can sign out of the demo at any time from your profile menu.',
  },
  {
    question: 'What can I watch on JETIX?',
    answer: 'Browse a growing catalogue of movies and series across a range of genres, with details and sample playback available for each title.',
  },
  {
    question: 'Is JETIX suitable for kids?',
    answer: 'You can create a kids profile to keep a separate, family-friendly viewing space in this demo.',
  },
];

const JOIN_REASONS = [
  {
    title: 'Enjoy on your TV',
    description: 'Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.',
    icon: <><rect x="3" y="4" width="18" height="13" rx="1" /><path d="M8 21h8m-4-4v4" /></>,
  },
  {
    title: 'Download your shows to watch offline',
    description: 'Save your favourites easily and always have something to watch.',
    icon: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 17v3h14v-3" /></>,
  },
  {
    title: 'Watch everywhere',
    description: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.',
    icon: <><path d="M4 17a8 8 0 0 1 16 0" /><path d="m12 13 4-4" /><circle cx="12" cy="17" r="1" /></>,
  },
  {
    title: 'Create profiles for kids',
    description: 'Send kids on adventures with their favourite characters in a space made just for them.',
    icon: <><rect x="3" y="4" width="12" height="13" rx="3" /><path d="M7 9h.01M11 9h.01m-4 4c1.2 1 2.8 1 4 0" /><rect x="13" y="11" width="8" height="9" rx="2" /><path d="M16 15h.01M18 15h.01m-2 2c.6.5 1.4.5 2 0" /></>,
  },
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [isTrendingHovered, setIsTrendingHovered] = useState(false);
  const [hasTrendingFocus, setHasTrendingFocus] = useState(false);
  const trendingRef = useRef(null);

  useEffect(() => {
    const carousel = trendingRef.current;
    if (
      !carousel ||
      isTrendingHovered ||
      hasTrendingFocus ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return undefined;

    const timer = window.setInterval(() => {
      if (document.hidden) return;

      const firstCard = carousel.querySelector('.landing__trending-card');
      if (!firstCard) return;

      const gap = parseFloat(window.getComputedStyle(carousel).columnGap) || 0;
      const nextPosition = carousel.scrollLeft + firstCard.getBoundingClientRect().width + gap;
      const lastPosition = carousel.scrollWidth - carousel.clientWidth;

      carousel.scrollTo({
        left: nextPosition >= lastPosition - 8 ? 0 : nextPosition,
        behavior: 'smooth',
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, [hasTrendingFocus, isTrendingHovered]);

  // Collage background built from the catalogue posters.
  const tiles = [...TITLES, ...TITLES, ...TITLES].slice(0, 64);

  return (
    <div className="login">
      <section className="landing__hero">
        <div className="login__bg" aria-hidden="true">
          <div className="login__collage">
            {tiles.map((t, i) => (
              <img key={`${t.id}-${i}`} src={t.poster} alt="" />
            ))}
          </div>
          <div className="login__bg-fade" />
        </div>

        <header className="login__header landing__header">
          <span className="logo logo--lg">JETIX</span>
          <Link to="/login" className="btn btn--red landing__signin">Sign In</Link>
        </header>

        <div className="landing__content">
          <h1>So much to watch,<br />matched to you</h1>
          <h2>Starts at ₹149. Cancel at any time.</h2>
          <p>Ready to watch? Enter your email to create or restart your membership.</p>

          <form
            className="landing__form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/login?email=${encodeURIComponent(email.trim())}`);
            }}
          >
            <div className="field landing__email">
              <input
                id="landing-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="landing-email">Email address</label>
            </div>
            <button type="submit" className="btn btn--red landing__submit">
              Get Started <span style={{ fontSize: '1.5rem' }}>›</span>
            </button>
          </form>
        </div>
      </section>

      <main className="landing__sections">
        <section className="landing__section landing__trending" aria-labelledby="landing-trending-title">
          <div className="landing__section-heading">
            <h2 id="landing-trending-title">Trending Now</h2>
          </div>
          <div
            className="landing__trending-list"
            ref={trendingRef}
            tabIndex={0}
            aria-label="Trending titles"
            onMouseEnter={() => setIsTrendingHovered(true)}
            onMouseLeave={() => setIsTrendingHovered(false)}
            onFocusCapture={() => setHasTrendingFocus(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setHasTrendingFocus(false);
            }}
          >
            {TRENDING_TITLES.map((title, index) => (
              <article className="landing__trending-card" key={title.id}>
                <div className="landing__poster">
                  <img src={title.poster} alt="" loading="lazy" />
                  <span className="landing__rank" aria-hidden="true">{index + 1}</span>
                </div>
                <span className="landing__trending-name">{title.title}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="landing__section" aria-labelledby="landing-reasons-title">
          <h2 id="landing-reasons-title">More reasons to join</h2>
          <div className="landing__reasons">
            {JOIN_REASONS.map((reason) => (
              <article className="landing__reason" key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
                <svg viewBox="0 0 24 24" aria-hidden="true">{reason.icon}</svg>
              </article>
            ))}
          </div>
        </section>

        <section className="landing__section landing__faq" aria-labelledby="landing-faq-title">
          <h2 id="landing-faq-title">Frequently Asked Questions</h2>
          <div className="landing__faq-list">
            {FAQS.map((faq) => (
              <details className="landing__faq-item" key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <span className="landing__faq-plus" aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="login__footer">
        <p>Questions? Call 000-800-919-1694 (Toll-Free)</p>
        <ul>
          <li>FAQ</li><li>Help Centre</li><li>Terms of Use</li><li>Privacy</li><li>Cookie Preferences</li><li>Corporate Information</li>
        </ul>
      </footer>
    </div>
  );
}
