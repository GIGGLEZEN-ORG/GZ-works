import React, { useState } from 'react';
import { Link, navigate, useRoute } from '../router';
import { useApp } from '../context/AppContext';
import { TITLES } from '../data/titles';

function validateName(value) {
  const length = value.trim().length;
  return length >= 2 && length <= 60 ? '' : 'Enter a name between 2 and 60 characters.';
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address.';
}

function validatePassword(value) {
  const isValid = value.length >= 8 && value.length <= 60 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value);
  return isValid ? '' : 'password contains 8 letters one upper case,lower case,special character,number';
}

export default function Signup() {
  const { register } = useApp();
  const { query } = useRoute();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(query.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const errs = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: confirmPassword === password ? '' : 'Passwords do not match.',
    };

    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setBusy(true);
    setTimeout(() => {
      register(cleanEmail, password, cleanName);
      navigate('/profiles');
    }, 600);
  };

  const tiles = [...TITLES, ...TITLES, ...TITLES].slice(0, 64);

  return (
    <div className="login">
      <div className="login__bg" aria-hidden="true">
        <div className="login__collage">
          {tiles.map((title, i) => (
            <img key={`${title.id}-${i}`} src={title.poster} alt="" />
          ))}
        </div>
        <div className="login__bg-fade" />
      </div>

      <header className="login__header">
        <span className="logo logo--lg">JETIX</span>
      </header>

      <main className="login__box">
        <h1>Create Account</h1>
        <form onSubmit={submit} noValidate>
          <div className={`field ${errors.name ? 'has-error' : ''}`}>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                setErrors((current) => ({ ...current, name: validateName(value) }));
              }}
              onBlur={() => setErrors((current) => ({ ...current, name: validateName(name) }))}
              placeholder=" "
              autoComplete="name"
              maxLength={60}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'signup-name-error' : undefined}
            />
            <label htmlFor="signup-name">Full name</label>
            {errors.name && <div className="field__error" id="signup-name-error">{errors.name}</div>}
          </div>
          <div className={`field ${errors.email ? 'has-error' : ''}`}>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                setErrors((current) => ({ ...current, email: validateEmail(value) }));
              }}
              onBlur={() => setErrors((current) => ({ ...current, email: validateEmail(email) }))}
              placeholder=" "
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
            />
            <label htmlFor="signup-email">Email address</label>
            {errors.email && <div className="field__error" id="signup-email-error">{errors.email}</div>}
          </div>
          <div className={`field ${errors.password ? 'has-error' : ''}`}>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setErrors((current) => ({
                  ...current,
                  password: validatePassword(value),
                  confirmPassword: confirmPassword === value ? '' : 'Passwords do not match.',
                }));
              }}
              onBlur={() => setErrors((current) => ({ ...current, password: validatePassword(password) }))}
              placeholder=" "
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'signup-password-error' : undefined}
            />
            <label htmlFor="signup-password">Password</label>
            {errors.password && <div className="field__error" id="signup-password-error">{errors.password}</div>}
          </div>
          <div className={`field ${errors.confirmPassword ? 'has-error' : ''}`}>
            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmPassword(value);
                setErrors((current) => ({
                  ...current,
                  confirmPassword: value === password ? '' : 'Passwords do not match.',
                }));
              }}
              onBlur={() => setErrors((current) => ({
                ...current,
                confirmPassword: confirmPassword === password ? '' : 'Passwords do not match.',
              }))}
              placeholder=" "
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
            />
            <label htmlFor="signup-confirm-password">Confirm password</label>
            {errors.confirmPassword && <div className="field__error" id="signup-confirm-password-error">{errors.confirmPassword}</div>}
          </div>
          <button className="btn btn--red btn--block" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Sign Up'}
          </button>
          <p className="login__signup">
            Already have an account? <Link to="/login">Sign in.</Link>
          </p>
          <p className="login__captcha">
            This is a demo. Your details are only used in this browser and are not sent anywhere.
          </p>
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
