import React, { useState, useEffect, useRef } from "react";
import { Film, LockKeyhole, Mail, UserRound, Clapperboard, X, Ticket, Eye, EyeOff } from "lucide-react";

const USERS_KEY = "cineverse_users";

function readUsers() {
  const storedUsers = localStorage.getItem(USERS_KEY);
  if (!storedUsers) return [];

  const users = JSON.parse(storedUsers);
  if (
    !Array.isArray(users) ||
    users.some(
      (user) =>
        !user ||
        typeof user.email !== "string" ||
        !(
          (typeof user.salt === "string" &&
            typeof user.passwordHash === "string") ||
          typeof user.password === "string"
        )
    )
  ) {
    throw new Error("Saved account data is invalid. Clear this app's saved data and try again.");
  }
  return users;
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

function createSalt() {
  const salt = new Uint8Array(16);
  window.crypto.getRandomValues(salt);
  return Array.from(salt, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function AuthPage({ onAuthenticated, onClose, contextMessage }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lastCharVisible, setLastCharVisible] = useState(false);
  const [lastConfirmCharVisible, setLastConfirmCharVisible] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pwdTimerRef = useRef(null);
  const confirmPwdTimerRef = useRef(null);

  // Keep all fields completely empty before user enters their own details
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLastCharVisible(false);
    setLastConfirmCharVisible(false);
    setError("");
  }, [mode]);

  useEffect(() => {
    return () => {
      if (pwdTimerRef.current) clearTimeout(pwdTimerRef.current);
      if (confirmPwdTimerRef.current) clearTimeout(confirmPwdTimerRef.current);
    };
  }, []);

  const isRegistering = mode === "register";

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (!showPassword && val.length > 0) {
      setLastCharVisible(true);
      if (pwdTimerRef.current) clearTimeout(pwdTimerRef.current);
      pwdTimerRef.current = setTimeout(() => {
        setLastCharVisible(false);
      }, 900);
    } else {
      setLastCharVisible(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (!showConfirmPassword && val.length > 0) {
      setLastConfirmCharVisible(true);
      if (confirmPwdTimerRef.current) clearTimeout(confirmPwdTimerRef.current);
      confirmPwdTimerRef.current = setTimeout(() => {
        setLastConfirmCharVisible(false);
      }, 900);
    } else {
      setLastConfirmCharVisible(false);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!window.crypto?.subtle || !window.crypto?.getRandomValues) {
      setError("Secure browser authentication is unavailable. Open this app over HTTPS or localhost.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    // Validation checks
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!emailRegex.test(normalizedEmail)) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (isRegistering) {
      if (!normalizedName || normalizedName.length < 2) {
        setError("Enter your full name using at least 2 characters.");
        return;
      }
      if (password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }
      if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setError("Password must contain at least one letter and one number.");
        return;
      }
      if (password !== confirmPassword) {
        setError("The passwords do not match. Please verify and re-enter.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const users = readUsers();
      let authenticatedUser;

      if (isRegistering) {
        if (users.some((user) => user.email === normalizedEmail)) {
          setError("An account with this email already exists. Sign in instead.");
          return;
        }

        const salt = createSalt();
        const newUser = {
          name: normalizedName,
          email: normalizedEmail,
          salt,
          passwordHash: await hashPassword(password, salt),
        };
        localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
        authenticatedUser = { name: newUser.name, email: newUser.email, profileImage: "" };
      } else {
        const user = users.find(
          (savedUser) => savedUser.email.trim().toLowerCase() === normalizedEmail
        );
        if (!user) {
          setError("Email or password is incorrect.");
          return;
        }

        if (typeof user.passwordHash === "string" && typeof user.salt === "string") {
          if ((await hashPassword(password, user.salt)) !== user.passwordHash) {
            setError("Email or password is incorrect.");
            return;
          }
        } else if (user.password === password) {
          const salt = createSalt();
          user.salt = salt;
          user.passwordHash = await hashPassword(password, salt);
          delete user.password;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } else {
          setError("Email or password is incorrect.");
          return;
        }

        authenticatedUser = {
          name: user.name,
          email: user.email,
          profileImage: user.profileImage || "",
        };
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      onAuthenticated(authenticatedUser);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to access saved accounts. Check your browser storage settings."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((currentMode) => (currentMode === "login" ? "register" : "login"));
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const containerClass = onClose
    ? "relative w-full max-h-[90vh] overflow-y-auto text-slate-100 rounded-4xl"
    : "relative min-h-screen overflow-hidden bg-[#07090e] px-4 py-10 text-slate-100 sm:px-6";

  return (
    <div className={containerClass}>
      {!onClose && (
        <>
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(225,29,72,0.18),transparent_70%)]" />
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[32px_32px] opacity-30" />
        </>
      )}

      <div className={onClose ? "relative mx-auto flex items-center justify-center w-full" : "relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center"}>
        <section 
          className="relative grid w-full overflow-hidden rounded-4xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/80 lg:grid-cols-[1fr_0.9fr]"
          style={{
            WebkitFontSmoothing: "subpixel-antialiased",
            textRendering: "geometricPrecision"
          }}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="relative hidden min-h-162.5 flex-col justify-between overflow-hidden border-r border-white/10 bg-linear-to-br from-rose-950/50 via-slate-950 to-indigo-950/40 p-12 lg:flex">
            <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-rose-600/20 blur-[100px]" />
            <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-[100px]" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-rose-600 to-indigo-600 shadow-lg shadow-rose-600/30">
                <Film className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-extrabold tracking-widest text-white">CINEVERSE</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Next-Gen Cinema</p>
              </div>
            </div>

            <div className="relative max-w-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/10">
                <Clapperboard className="h-7 w-7 text-rose-300" />
              </div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-rose-300">
                Your next cinema night
              </p>
              <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">
                The best seat in the house is waiting.
              </h1>
              <p className="mt-5 text-sm leading-7 text-slate-400">
                Sign in to explore showtimes, choose your seats, and keep your movie tickets together.
              </p>
            </div>

            <p className="relative text-xs text-slate-500">
              Immersive movies. Unforgettable nights.
            </p>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-rose-600 to-indigo-600">
                    <Film className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-extrabold tracking-widest text-white">CINEVERSE</span>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-400">
                Welcome to Cineverse
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                {isRegistering ? "Create your account" : "Sign in to continue"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {isRegistering
                  ? "Register once and use your account to sign in."
                  : "Enter your account details to pick up where the movie magic begins."}
              </p>

              {contextMessage && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 px-3.5 py-2.5 text-xs font-medium text-rose-200">
                  <Ticket className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{contextMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
                {isRegistering && (
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-300">Full name</span>
                    <span className="relative block">
                      <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        name="full_name"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        required
                        minLength={2}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder=""
                        className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-rose-500/70 focus:ring-2 focus:ring-rose-500/20"
                      />
                    </span>
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-300">Email address</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      name="account_email"
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder=""
                      className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-rose-500/70 focus:ring-2 focus:ring-rose-500/20"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-300">Password</span>
                  <span className="relative block">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 z-10" />
                    
                    {/* Hidden/Actual input where user types */}
                    <input
                      type="text"
                      name="account_password"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      required
                      minLength={isRegistering ? 8 : undefined}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder=""
                      className={`w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-rose-500/70 focus:ring-2 focus:ring-rose-500/20 ${
                        showPassword ? "text-white" : "text-transparent caret-white"
                      }`}
                    />

                    {/* Masked overlay: shows dots for all except the last entered character if lastCharVisible is true */}
                    {!showPassword && password.length > 0 && (
                      <span className="pointer-events-none absolute left-11 right-11 top-1/2 -translate-y-1/2 text-sm text-white font-mono tracking-wider overflow-hidden truncate">
                        {lastCharVisible ? (
                          <>
                            <span>{"•".repeat(Math.max(0, password.length - 1))}</span>
                            <span className="text-white font-bold">{password.slice(-1)}</span>
                          </>
                        ) : (
                          <span>{"•".repeat(password.length)}</span>
                        )}
                      </span>
                    )}

                    {/* Eye toggle button - White color */}
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-white hover:text-rose-200 transition-colors cursor-pointer z-10"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-white stroke-[2.5]" />
                      ) : (
                        <Eye className="w-4 h-4 text-white stroke-[2.5]" />
                      )}
                    </button>
                  </span>
                </label>

                {isRegistering && (
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-300">Confirm password</span>
                    <span className="relative block">
                      <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 z-10" />
                      
                      {/* Actual input for confirm password */}
                      <input
                        type="text"
                        name="account_confirm_password"
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        required
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder=""
                        className={`w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-rose-500/70 focus:ring-2 focus:ring-rose-500/20 ${
                          showConfirmPassword ? "text-white" : "text-transparent caret-white"
                        }`}
                      />

                      {/* Masked overlay for confirm password */}
                      {!showConfirmPassword && confirmPassword.length > 0 && (
                        <span className="pointer-events-none absolute left-11 right-11 top-1/2 -translate-y-1/2 text-sm text-white font-mono tracking-wider overflow-hidden truncate">
                          {lastConfirmCharVisible ? (
                            <>
                              <span>{"•".repeat(Math.max(0, confirmPassword.length - 1))}</span>
                              <span className="text-white font-bold">{confirmPassword.slice(-1)}</span>
                            </>
                          ) : (
                            <span>{"•".repeat(confirmPassword.length)}</span>
                          )}
                        </span>
                      )}

                      {/* Eye toggle button - White color */}
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-white hover:text-rose-200 transition-colors cursor-pointer z-10"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-white stroke-[2.5]" />
                        ) : (
                          <Eye className="w-4 h-4 text-white stroke-[2.5]" />
                        )}
                      </button>
                    </span>
                  </label>
                )}

                {error && (
                  <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-pink-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-600/25 transition hover:from-rose-500 hover:to-pink-500 disabled:cursor-wait disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting
                    ? "Please wait..."
                    : isRegistering
                      ? "Create account"
                      : "Sign in"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                {isRegistering ? "Already have an account?" : "New to Cineverse?"}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-bold text-rose-400 transition hover:text-rose-300 cursor-pointer"
                >
                  {isRegistering ? "Sign in" : "Create an account"}
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
