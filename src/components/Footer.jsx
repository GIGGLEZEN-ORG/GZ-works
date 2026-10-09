import React from 'react';

const LINKS = [
  'Audio Description', 'Help Centre', 'Gift Cards', 'Media Centre',
  'Investor Relations', 'Jobs', 'Terms of Use', 'Privacy',
  'Legal Notices', 'Cookie Preferences', 'Corporate Information', 'Contact Us',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__social">
        <a href="#/browse" aria-label="Facebook">f</a>
        <a href="#/browse" aria-label="Instagram">◎</a>
        <a href="#/browse" aria-label="X">✕</a>
        <a href="#/browse" aria-label="YouTube">▶</a>
      </div>
      <ul className="footer__links">
        {LINKS.map((l) => (
          <li key={l}>
            <a href="#/browse">{l}</a>
          </li>
        ))}
      </ul>
      <button type="button" className="footer__service">Service Code</button>
      <p className="footer__copy">© 2026 JETIX demo — a portfolio clone built with React. Not affiliated with any streaming service.</p>
    </footer>
  );
}
