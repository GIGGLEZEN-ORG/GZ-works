import React, { useState } from 'react';
import { X, LogIn, Mail, Lock, UserPlus, Tag } from 'lucide-react';
import { useAccount } from '../context/AccountContext';
import { getPasswordValidationMessage, isValidGmailAddress } from '../utils/auth';

export default function LoginModal() {
  const {
    loginModalOpen,
    setLoginModalOpen,
    setSignupModalOpen,
    setBookingLoginPending,
    bookingLoginPending,
    pendingCouponCode,
    setPendingCouponCode,
    login,
    navigateToHome,
    checkoutModalOpen,
    passengerInfoModalOpen
  } = useAccount();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loginModalOpen) return null;

  const validateField = (name, value) => {
    if (name === 'email') {
      const safeEmail = value.trim();
      if (!safeEmail) return 'Email is required.';
      if (!isValidGmailAddress(safeEmail)) return 'Enter a valid Gmail address (example@gmail.com).';
    }
    if (name === 'password') {
      return getPasswordValidationMessage(value);
    }
    return '';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value), form: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const safeEmail = form.email.trim();
    const nextErrors = {};

    for (const field of ['email', 'password']) {
      const error = validateField(field, form[field]);
      if (error) nextErrors[field] = error;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await login({ email: safeEmail, password: form.password });
      if (!result.success) {
        setErrors({ form: result.message });
      } else {
        if (bookingLoginPending) {
          setBookingLoginPending(false);
        } else if (!pendingCouponCode && !checkoutModalOpen && !passengerInfoModalOpen) {
          navigateToHome();
        } else {
          setErrors({});
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div className="account-modal my-auto w-full max-w-md overflow-y-auto rounded-[28px] border border-gray-100 bg-white shadow-2xl sm:max-h-[90dvh]">
        <div className="account-modal-header bg-gradient-to-r from-[#087e8b] to-[#1e4d6b] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Welcome back</p>
            <h2 className="text-2xl font-black font-['Montserrat']">Login</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoginModalOpen(false);
              setBookingLoginPending(false);
              setPendingCouponCode(null);
            }}
            className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {pendingCouponCode && (
          <div className="mx-4 mt-4 sm:mx-6 rounded-2xl border border-sky-200 bg-sky-50 p-3.5 text-xs text-sky-900">
            <div className="flex items-center gap-1.5 font-bold">
              <Tag className="w-4 h-4 text-[#087e8b]" />
              <span>Log in to apply coupon: <span className="font-mono text-sm tracking-wider">{pendingCouponCode}</span></span>
            </div>
            <p className="mt-1 text-sky-700">
              Sign in to your account and your discount will be automatically applied to your booking.
            </p>
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-6">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wide text-gray-500">Email</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
              <Mail className="w-4 h-4 text-gray-400" />
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                required
                autoComplete="email"
                inputMode="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            {errors.email && <p id="login-email-error" className="text-sm text-rose-700">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wide text-gray-500">Password</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
              <Lock className="w-4 h-4 text-gray-400" />
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={8}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-password-hint login-password-error' : 'login-password-hint'}
                className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <p id="login-password-hint" className="text-xs text-gray-500">
              At least 8 characters with uppercase and lowercase letters, a number, and a special character.
            </p>
            {errors.password && <p id="login-password-error" className="text-sm text-rose-700">{errors.password}</p>}
          </div>

          {errors.form && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errors.form}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#087e8b] text-white font-bold px-4 py-3 shadow-lg shadow-sky-500/20 hover:bg-[#1e4d6b] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
          </button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setLoginModalOpen(false);
                setSignupModalOpen(true);
              }}
              className="inline-flex items-center gap-1 font-bold text-[#087e8b] hover:text-[#075e68] cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
