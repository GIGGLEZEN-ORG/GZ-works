import React, { useState } from 'react';
import { Link, navigate } from '../router';
import { TITLES } from '../data/titles';

export default function Landing() {
  const [email, setEmail] = useState('');
  
  // Collage background built from the catalogue posters.
  const tiles = [...TITLES, ...TITLES, ...TITLES].slice(0, 64);

  return (
    <div className="login">
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

      <main className="landing__content">
        <h1>So much to watch,<br />matched to you</h1>
        <h2>Starts at ₹149. Cancel at any time.</h2>
        <p>Ready to watch? Enter your email to create or restart your membership.</p>
        
        <form
          className="landing__form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/signup?email=${encodeURIComponent(email)}`);
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
