import React, { useEffect, useState } from 'react';
import { Link, navigate, useRoute } from '../router';
import { useApp } from '../context/AppContext';
import { TITLES } from '../data/titles';

function validateIdentifier(value) {
  const identifier = value.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const isPhone = /^\d{10}$/.test(identifier);
  return isEmail || isPhone ? '' : 'Enter a valid email address or 10-digit mobile number.';
}

function validatePassword(value) {
  return value.length >= 4 && value.length <= 60
    ? ''
    : 'Your password must contain between 4 and 60 characters.';
}

export default function Login() {
  const { authenticate, authenticateWithCode } = useApp();
  const { query } = useRoute();
  const [email, setEmail] = useState(query.email || '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [codeExpiresAt, setCodeExpiresAt] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [codeMode, setCodeMode] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!codeMode || !codeExpiresAt) return undefined;
    const updateCountdown = () => {
      setSecondsRemaining(Math.max(0, Math.ceil((codeExpiresAt - Date.now()) / 1000)));
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [codeMode, codeExpiresAt]);

  const issueDemoCode = () => {
    const identifier = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      setEmail('demo@nextflix.app');
    }
    const nextCode = String(Math.floor(100000 + Math.random() * 900000));
    setDemoCode(nextCode);
    setCode('');
    setCodeExpiresAt(Date.now() + 60_000);
    setErrors({});
    setCodeMode(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (codeMode) {
      if (!/^\d{6}$/.test(code)) {
        setErrors({ code: 'Enter the 6-digit sign-in code.' });
        return;
      }
      if (!demoCode || Date.now() >= codeExpiresAt) {
        setDemoCode('');
        setSecondsRemaining(0);
        setErrors({ code: 'This sign-in code has expired. Request a new code.' });
        return;
      }
      if (code !== demoCode) {
        setErrors({ code: 'That sign-in code is incorrect.' });
        return;
      }
      setBusy(true);
      window.setTimeout(() => {
        if (Date.now() >= codeExpiresAt) {
          setDemoCode('');
          setSecondsRemaining(0);
          setErrors({ code: 'This sign-in code has expired. Request a new code.' });
          setBusy(false);
          return;
        }
        const success = authenticateWithCode(email.trim());
        if (success) {
          setDemoCode('');
          navigate('/profiles');
        } else {
          setErrors({ email: 'No account was found for this email. Sign up first.' });
          setBusy(false);
        }
      }, 300);
      return;
    }
    const identifier = email.trim();
    const errs = {
      email: validateIdentifier(email),
      password: validatePassword(password),
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setBusy(true);
    setTimeout(() => {
      const success = authenticate(identifier, password);
      if (success) {
        navigate('/profiles');
      } else {
        setErrors({ email: 'Invalid email or password.' });
        setBusy(false);
      }
    }, 600);
  };

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

      <header className="login__header">
        <span className="logo logo--lg">JETIX</span>
      </header>

      <main className="login__box">
        <h1>Sign In</h1>
        <form onSubmit={submit} noValidate>
          {!codeMode ? (
            <>
              <div className={`field ${errors.email ? 'has-error' : ''}`}>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    setErrors((current) => ({ ...current, email: validateIdentifier(value) }));
                  }}
                  onBlur={() => setErrors((current) => ({ ...current, email: validateIdentifier(email) }))}
                  placeholder=" "
                  autoComplete="username"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                />
                <label htmlFor="email">Email or mobile number</label>
                {errors.email && <div className="field__error" id="login-email-error">{errors.email}</div>}
              </div>
              <div className={`field ${errors.password ? 'has-error' : ''}`}>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    setErrors((current) => ({ ...current, password: validatePassword(value) }));
                  }}
                  onBlur={() => setErrors((current) => ({ ...current, password: validatePassword(password) }))}
                  placeholder=" "
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                />
                <label htmlFor="password">Password</label>
                {errors.password && <div className="field__error" id="login-password-error">{errors.password}</div>}
              </div>
              <button className="btn btn--red btn--block" type="submit" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign In'}
              </button>
              <div className="login__or">OR</div>
              <button className="btn btn--translucent btn--block" type="button" onClick={issueDemoCode}>
                Use a sign-in code
              </button>
              <a className="login__forgot" href="#/login">Forgot password?</a>
              <label className="login__remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
              </label>
            </>
          ) : (
            <>
              <div className={`field ${errors.email ? 'has-error' : ''}`}>
                <input
                  id="code-email"
                  type="email"
                  value={email}
                  readOnly
                  placeholder=" "
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'code-email-error' : undefined}
                />
                <label htmlFor="code-email">Email address</label>
                {errors.email && <div className="field__error" id="code-email-error">{errors.email}</div>}
              </div>
              <div className={`field ${errors.code ? 'has-error' : ''}`}>
                <input
                  id="sign-in-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setErrors((current) => ({ ...current, code: '' }));
                  }}
                  placeholder=" "
                  autoComplete="one-time-code"
                  aria-invalid={Boolean(errors.code)}
                  aria-describedby={errors.code ? 'sign-in-code-error' : 'sign-in-code-help'}
                />
                <label htmlFor="sign-in-code">6-digit sign-in code</label>
                {errors.code && <div className="field__error" id="sign-in-code-error">{errors.code}</div>}
              </div>
              <p className="login__captcha" id="sign-in-code-help">
                Demo code: <strong>{demoCode}</strong>
                {secondsRemaining > 0 ? ` · Expires in ${Math.floor(secondsRemaining / 60)}:${String(secondsRemaining % 60).padStart(2, '0')}` : ' · Code expired'}
              </p>
              <button className="btn btn--red btn--block" type="submit" disabled={busy || secondsRemaining === 0}>
                {busy ? 'Verifying…' : 'Verify code'}
              </button>
              <button className="btn btn--translucent btn--block" type="button" onClick={issueDemoCode}>
                Get a new code
              </button>
              <button className="login__forgot" type="button" onClick={() => { setCodeMode(false); setDemoCode(''); setErrors({}); }}>
                Sign in with password instead
              </button>
              <p className="login__captcha">This demo code is shown here instead of being sent by email.</p>
            </>
          )}
          <p className="login__signup">
            New to JETIX? <Link to="/signup">Sign up now.</Link>
          </p>
          {!codeMode && (
            <p className="login__captcha">
              This is a demo. Please use the credentials you signed up with, or click "Use a sign-in code" above.
            </p>
          )}
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
