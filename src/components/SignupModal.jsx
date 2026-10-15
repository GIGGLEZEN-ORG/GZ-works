import React, { useState } from 'react';
import { X, UserPlus, Mail, Lock, UserRound } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { getPasswordValidationMessage, isValidGmailAddress } from '../utils/auth';

export default function SignupModal() {
  const {
    signupModalOpen,
    setSignupModalOpen,
    setLoginModalOpen,
    setBookingLoginPending,
    setPendingCouponCode,
    signup
  } = useBooking();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!signupModalOpen) return null;

  const validateField = (name, value, currentForm) => {
    if (name === 'fullName') {
      const safeName = value.trim();
      if (!safeName) return 'Full name is required.';
      if (safeName.length < 2) return 'Enter a name with at least 2 characters.';
    }
    if (name === 'email') {
      const safeEmail = value.trim();
      if (!safeEmail) return 'Email is required.';
      if (!isValidGmailAddress(safeEmail)) return 'Enter a valid Gmail address (example@gmail.com).';
    }
    if (name === 'password') {
      return getPasswordValidationMessage(value);
    }
    if (name === 'confirmPassword') {
      if (!value) return 'Please confirm your password.';
      if (value !== currentForm.password) return 'Passwords do not match.';
    }
    return '';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    setErrors(prev => {
      const nextErrors = {
        ...prev,
        [name]: validateField(name, value, nextForm),
        form: ''
      };
      if (name === 'password' && nextForm.confirmPassword) {
        nextErrors.confirmPassword = validateField('confirmPassword', nextForm.confirmPassword, nextForm);
      }
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    const safeName = form.fullName.trim();
    const safeEmail = form.email.trim();

    for (const field of ['fullName', 'email', 'password', 'confirmPassword']) {
      const error = validateField(field, form[field], form);
      if (error) nextErrors[field] = error;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await signup({ fullName: safeName, email: safeEmail, password: form.password });
      if (!result.success) {
        setErrors({ form: result.message });
      } else {
        setSignupModalOpen(false);
        setLoginModalOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div className="my-auto w-full max-w-md overflow-y-auto rounded-[28px] border border-gray-100 bg-white shadow-2xl sm:max-h-[90dvh]">
        <div className="bg-gradient-to-r from-[#087e8b] to-[#1e4d6b] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Create account</p>
            <h2 className="text-2xl font-black font-['Montserrat']">Sign Up</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setSignupModalOpen(false);
              setBookingLoginPending(false);
              setPendingCouponCode(null);
            }}
            className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-6">
          <div className="space-y-2">
            <label htmlFor="signup-full-name" className="text-xs font-bold uppercase tracking-wide text-gray-500">Full name</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
              <UserRound className="w-4 h-4 text-gray-400" />
              <input
                id="signup-full-name"
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'signup-full-name-error' : undefined}
                className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            {errors.fullName && <p id="signup-full-name-error" className="text-sm text-rose-700">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-wide text-gray-500">Email</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
              <Mail className="w-4 h-4 text-gray-400" />
              <input
                id="signup-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                required
                autoComplete="email"
                inputMode="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'signup-email-error' : undefined}
                className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            {errors.email && <p id="signup-email-error" className="text-sm text-rose-700">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-wide text-gray-500">Password</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
              <Lock className="w-4 h-4 text-gray-400" />
              <input
                id="signup-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'signup-password-hint signup-password-error' : 'signup-password-hint'}
                className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <p id="signup-password-hint" className="text-xs text-gray-500">
              Use at least 8 characters with uppercase and lowercase letters, a number, and a special character.
            </p>
            {errors.password && <p id="signup-password-error" className="text-sm text-rose-700">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-confirm-password" className="text-xs font-bold uppercase tracking-wide text-gray-500">Confirm password</label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#087e8b] focus-within:bg-white transition">
              <Lock className="w-4 h-4 text-gray-400" />
              <input
                id="signup-confirm-password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
                className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            {errors.confirmPassword && <p id="signup-confirm-password-error" className="text-sm text-rose-700">{errors.confirmPassword}</p>}
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
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating account...' : 'Create account'}</span>
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setSignupModalOpen(false);
                setLoginModalOpen(true);
              }}
              className="font-bold text-[#087e8b] hover:text-[#075e68] cursor-pointer"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
