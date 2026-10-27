import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-4 w-4">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.72 6C44.42 38.02 46.98 31.92 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.72-6c-2.14 1.45-4.89 2.3-8.19 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.53.23 2.67.11 2.95.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function BrandMark() {
  return (
    <a href="#home" aria-label="FinTrack" className="inline-flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
        <ChartLogo />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-slate-900">FinTrack</span>
    </a>
  );
}

function ChartLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M4 18V9m5 9V5m5 13v-6m5 6V3" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

function Illustration() {
  return (
    <div className="login-illustration relative mx-auto mt-8 h-[260px] w-full max-w-[390px] sm:h-[330px]">
      <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.04] sm:h-[310px] sm:w-[310px]" />
      <div className="absolute left-1/2 top-1/2 h-[195px] w-[195px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-sky-300/[0.08] sm:h-[245px] sm:w-[245px]" />
      <div className="absolute left-[13%] top-[46%] h-1 w-[48%] rounded-full bg-sky-300/25" />
      <div className="absolute left-[30%] top-[21%] h-[60%] w-1 rounded-full bg-sky-300/25" />

      <div className="absolute left-[10%] top-[15%] grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white text-xl font-extrabold text-indigo-600 shadow-lg sm:left-[15%] sm:h-14 sm:w-14">✦</div>
      <div className="absolute left-[2%] top-[43%] grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white text-indigo-600 shadow-lg sm:left-[8%] sm:h-14 sm:w-14">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-xs font-black text-white">K</span>
      </div>
      <div className="absolute left-[16%] top-[72%] grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white text-lg font-bold text-emerald-500 shadow-lg sm:left-[22%] sm:h-14 sm:w-14">✓</div>
      <div className="absolute left-[34%] top-[5%] grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white shadow-lg sm:h-14 sm:w-14">
        <GoogleMark />
      </div>

      <div className="absolute right-[4%] top-[19%] w-[54%] overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xl sm:right-[1%]">
        <div className="flex h-7 items-center gap-1.5 border-b border-slate-100 px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="h-2 w-16 rounded bg-slate-200" />
            <span className="h-2 w-8 rounded bg-indigo-100" />
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5">
            <span className="text-[9px] font-medium text-slate-400">Total saldo</span>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-xs font-extrabold text-slate-800 sm:text-sm">Rp 12.840.000</span>
              <span className="text-[9px] font-bold text-emerald-500">+12,8%</span>
            </div>
            <div className="mt-3 flex h-10 items-end gap-1">
              {[30, 45, 36, 62, 50, 76, 58, 92, 68, 100, 78, 112].map((height, index) => (
                <span key={index} className="flex-1 rounded-t-sm bg-indigo-400/80" style={{ height: `${height / 1.7}%` }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-100 p-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-[10px] text-emerald-600">↙</span>
            <span className="h-2 w-16 rounded bg-slate-200" />
            <span className="ml-auto text-[9px] font-bold text-slate-700">+ Rp 2,5 jt</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-100 p-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-50 text-[10px] text-rose-500">↗</span>
            <span className="h-2 w-20 rounded bg-slate-200" />
            <span className="ml-auto text-[9px] font-bold text-slate-700">- Rp 850 rb</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({
  onGoogleLogin,
  onGitHubLogin,
  onAnonymousLogin,
  onEmailAuth,
  onPasswordReset,
  isGoogleConfigured,
  isGitHubConfigured,
  isAnonymousConfigured,
  isLoading,
  error,
}) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const isSignup = mode === 'signup';
  const isReset = mode === 'reset';

  const setAuthMode = (nextMode) => {
    setMode(nextMode);
    setFormError('');
    setNotice('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setNotice('');
    if (isReset && !email.trim()) {
      setFormError('Masukkan email terlebih dahulu untuk menerima tautan reset.');
      return;
    }
    if (isSignup && name.trim().length < 2) {
      setFormError('Nama harus terdiri dari minimal 2 karakter.');
      return;
    }
    if (!isReset && password.length < (isSignup ? 8 : 6)) {
      setFormError(isSignup ? 'Kata sandi baru minimal 8 karakter.' : 'Kata sandi minimal 6 karakter.');
      return;
    }

    try {
      if (isReset) {
        await onPasswordReset(email.trim());
        setNotice('Tautan reset kata sandi sudah dikirim. Periksa kotak masuk email Anda.');
      } else {
        await onEmailAuth({
          mode,
          name: name.trim(),
          email: email.trim(),
          password,
          rememberMe,
        });
      }
    } catch (authFailure) {
      setFormError(authFailure.message || String(authFailure));
    }
  };

  const fieldClass = 'h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

  return (
    <main className="login-page login-launch-enter flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <section className="login-card page-enter grid w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_22px_70px_-28px_rgba(15,23,42,0.35)] md:min-h-[650px] md:grid-cols-2">
        <div className="flex items-center justify-center px-6 py-9 sm:px-12 md:px-8 xl:px-14">
          <div key={mode} className="auth-mode-enter w-full max-w-sm">
            <BrandMark />
            <h1 className="mt-8 text-[27px] font-extrabold tracking-tight text-slate-900">
              {isSignup ? 'Buat akun FinTrack' : isReset ? 'Reset kata sandi' : 'Masuk ke akunmu'}
            </h1>
            <p className="mt-1.5 text-xs text-slate-500">
              {isSignup
                ? 'Daftar untuk mulai mengatur keuangan dengan lebih baik.'
                : isReset
                  ? 'Kami akan mengirim tautan reset ke email kamu.'
                  : 'Selamat datang kembali! Pilih metode untuk melanjutkan.'}
            </p>

            {!isReset && (
              <>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onGoogleLogin}
                    disabled={isLoading || !isGoogleConfigured}
                    className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <GoogleMark /> Google
                  </button>
                  <button
                    type="button"
                    onClick={onGitHubLogin}
                    disabled={isLoading || !isGitHubConfigured}
                    className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <GitHubMark /> GitHub
                  </button>
                </div>
                {!isSignup && (
                  <button
                    type="button"
                    onClick={onAnonymousLogin}
                    disabled={isLoading || !isAnonymousConfigured}
                    className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <UserRound aria-hidden="true" className="h-4 w-4" />
                    Lanjut sebagai tamu
                  </button>
                )}
                <div className="my-5 flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" />
                  atau lanjutkan dengan email
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignup && (
                <label className="relative block">
                  <UserRound aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nama lengkap"
                    aria-label="Nama lengkap"
                    className={fieldClass}
                  />
                </label>
              )}
              <label className="relative block">
                <Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  aria-label="Email"
                  className={fieldClass}
                />
              </label>

              {!isReset && (
                <label className="relative block">
                  <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    required
                    minLength={isSignup ? 8 : 6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Kata sandi"
                    aria-label="Kata sandi"
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </label>
              )}

              {!isSignup && !isReset && (
                <div className="flex items-center justify-between text-[10px]">
                  <label className="flex cursor-pointer items-center gap-1.5 text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600"
                    />
                    Ingat saya
                  </label>
                  <button type="button" onClick={() => setAuthMode('reset')} className="font-medium text-blue-700 hover:underline">
                    Lupa kata sandi?
                  </button>
                </div>
              )}

              {(formError || error) && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700">
                  {formError || error}
                </p>
              )}
              {notice && (
                <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-700">
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-700 text-xs font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading
                  ? 'Memproses…'
                  : isSignup
                    ? 'Buat akun'
                    : isReset
                      ? 'Kirim tautan reset'
                      : 'Masuk'}
                {!isLoading && !isReset && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            {isReset ? (
              <p className="mt-5 text-center text-[10px] text-slate-500">
                Ingat kata sandi?{' '}
                <button type="button" onClick={() => setAuthMode('login')} className="font-semibold text-blue-700 hover:underline">Kembali masuk</button>
              </p>
            ) : (
              <p className="mt-5 text-center text-[10px] text-slate-500">
                {isSignup ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode(isSignup ? 'login' : 'signup')}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  {isSignup ? 'Masuk' : 'Buat akun baru'}
                </button>
              </p>
            )}
            <p className="mt-5 text-center text-[9px] leading-4 text-slate-400">
              Data keuangan tersimpan di browser ini. Autentikasi email dikelola oleh Firebase.
            </p>
          </div>
        </div>

        <aside className="login-art relative hidden min-h-[650px] flex-col items-center justify-center overflow-hidden px-6 py-12 text-white md:flex xl:px-10">
          <div className="absolute -right-28 -top-36 h-[420px] w-[420px] rounded-full bg-sky-300/10" />
          <div className="absolute -bottom-40 -left-28 h-[420px] w-[420px] rounded-full bg-blue-950/20" />
          <div className="relative z-10 w-full max-w-lg text-center">
            <Illustration />
            <h2 className="mt-4 text-xl font-extrabold">Semua keuangan, satu kendali.</h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-blue-100/80">
              Pantau pemasukan, atur pengeluaran, dan capai tujuan finansialmu dengan lebih percaya diri.
            </p>
            <div className="mt-7 flex justify-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-5 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            </div>
          </div>
          <span className="absolute bottom-7 right-7 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-2xl backdrop-blur-sm" aria-hidden="true">
            <Check className="h-5 w-5" />
          </span>
        </aside>
      </section>
    </main>
  );
}
