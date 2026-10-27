import React, { useState } from 'react';
import {
  Camera,
  Check,
  CirclePlus,
  Download,
  FileSpreadsheet,
  LockKeyhole,
  Moon,
  PiggyBank,
  Sun,
  Trash2,
  UserRound,
} from 'lucide-react';
import { formatRupiah } from '../data/initialData';

const tabs = [
  { id: 'profile', label: 'Profil', Icon: UserRound },
  { id: 'security', label: 'Keamanan', Icon: LockKeyhole },
  { id: 'preferences', label: 'Preferensi', Icon: Sun },
  { id: 'data', label: 'Data', Icon: FileSpreadsheet },
  { id: 'savings', label: 'Target Tabungan', Icon: PiggyBank },
];

const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;
const MAX_AVATAR_DIMENSION = 512;

function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SettingsPage({
  profile,
  onSaveProfile,
  theme,
  onThemeChange,
  currency,
  onCurrencyChange,
  onExportTransactions,
  transactionCount,
  exportMessage,
  savingsGoals,
  onCreateSavingsGoal,
  onAddSavingsContribution,
  onDeleteSavingsGoal,
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(profile.name);
  const [avatarDataUrl, setAvatarDataUrl] = useState(profile.avatarDataUrl || '');
  const [profileMessage, setProfileMessage] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalError, setGoalError] = useState('');
  const [goalMessage, setGoalMessage] = useState('');
  const [contributions, setContributions] = useState({});
  const [contributionError, setContributionError] = useState('');

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const updatedProfile = {
      name: name.trim(),
      email: profile.email,
      avatarDataUrl,
    };
    onSaveProfile(updatedProfile);
    setName(updatedProfile.name);
    setProfileMessage('Profil berhasil diperbarui di browser ini.');
  };

  const handleAvatarSelection = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setAvatarError('');
    setProfileMessage('');

    if (!file.type.startsWith('image/')) {
      setAvatarError('Pilih file gambar seperti JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > MAX_AVATAR_FILE_SIZE) {
      setAvatarError('Ukuran foto maksimal 5 MB.');
      return;
    }

    try {
      const image = await createImageBitmap(file);
      const side = Math.min(image.width, image.height);
      const sourceX = (image.width - side) / 2;
      const sourceY = (image.height - side) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = MAX_AVATAR_DIMENSION;
      canvas.height = MAX_AVATAR_DIMENSION;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Browser tidak dapat memproses gambar.');
      context.drawImage(
        image,
        sourceX,
        sourceY,
        side,
        side,
        0,
        0,
        MAX_AVATAR_DIMENSION,
        MAX_AVATAR_DIMENSION,
      );
      image.close();
      setAvatarDataUrl(canvas.toDataURL('image/jpeg', 0.82));
    } catch (error) {
      console.error('FinTrack profile photo processing failed:', error);
      setAvatarError(error.message || 'Foto tidak dapat diproses. Coba file gambar lain.');
    }
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();
    const targetAmount = Number(goalTarget);
    if (!goalName.trim()) {
      setGoalError('Masukkan nama target tabungan.');
      return;
    }
    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      setGoalError('Target nominal harus lebih besar dari Rp 0.');
      return;
    }
    if (goalDate && goalDate < getLocalDateValue()) {
      setGoalError('Tanggal target tidak boleh di masa lalu.');
      return;
    }

    onCreateSavingsGoal({
      name: goalName.trim(),
      targetAmount,
      targetDate: goalDate,
    });
    setGoalName('');
    setGoalTarget('');
    setGoalDate('');
    setGoalError('');
    setGoalMessage('Target tabungan berhasil dibuat.');
  };

  const handleContributionSubmit = (event, goalId) => {
    event.preventDefault();
    const amount = Number(contributions[goalId]);
    if (!Number.isFinite(amount) || amount <= 0) {
      setContributionError('Masukkan jumlah tabungan yang valid.');
      return;
    }
    onAddSavingsContribution(goalId, amount);
    setContributions((current) => ({ ...current, [goalId]: '' }));
    setContributionError('');
    setGoalMessage('Tabungan berhasil ditambahkan ke target.');
  };

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';
  const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300';

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm lg:flex-col lg:overflow-visible dark:border-slate-800 dark:bg-slate-900" aria-label="Tab pengaturan">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            aria-current={activeTab === id ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
              activeTab === id
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <section key={activeTab} className="page-enter min-w-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        {activeTab === 'profile' && (
          <>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Profil</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Atur nama dan foto profil pribadimu.</p>
            <form onSubmit={handleProfileSubmit} className="mt-6 max-w-xl space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-100 text-2xl font-extrabold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {avatarDataUrl ? (
                    <img src={avatarDataUrl} alt="Pratinjau foto profil" className="h-full w-full object-cover" />
                  ) : (
                    (name.trim() || 'H').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="space-y-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    <Camera className="h-4 w-4" />
                    Pilih foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelection}
                      className="sr-only"
                    />
                  </label>
                  {avatarDataUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarDataUrl('');
                        setProfileMessage('');
                        setAvatarError('');
                      }}
                      className="ml-2 text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Hapus foto
                    </button>
                  )}
                  <p className="text-xs text-slate-400">Gambar dipotong persegi dan disimpan di browser ini (maks. 5 MB).</p>
                </div>
              </div>
              {avatarError && <p role="alert" className="text-sm text-rose-600">{avatarError}</p>}
              <div>
                <label htmlFor="settings-name" className={labelClass}>Nama lengkap</label>
                <input id="settings-name" value={name} onChange={(event) => { setName(event.target.value); setProfileMessage(''); }} required minLength={2} maxLength={80} autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="settings-email" className={labelClass}>Email akun</label>
                <input id="settings-email" type="email" value={profile.email} readOnly autoComplete="email" className={`${inputClass} cursor-not-allowed opacity-70`} />
              </div>
              <button type="submit" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">Simpan profil</button>
              {profileMessage && <p role="status" className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{profileMessage}</p>}
              <p className="text-xs text-slate-400">Profil disimpan secara lokal di browser ini.</p>
            </form>
          </>
        )}

        {activeTab === 'security' && (
          <>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Keamanan</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Akun FinTrack menggunakan Firebase Authentication.</p>
            <div className="mt-6 max-w-xl rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                FinTrack tidak menyimpan kata sandi. Untuk akun Google, kelola keamanan melalui Akun Google; untuk akun email, gunakan tautan reset kata sandi dari halaman masuk.
              </p>
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Keamanan Akun Google
              </a>
            </div>
          </>
        )}

        {activeTab === 'preferences' && (
          <>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Preferensi</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Atur tampilan dan format angka aplikasi.</p>
            <div className="mt-6 max-w-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Mode tampilan</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{theme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif'}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={theme === 'dark'}
                  onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'}`}
                >
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </button>
              </div>
              <div>
                <label htmlFor="settings-currency" className={labelClass}>Mata uang</label>
                <select id="settings-currency" value={currency} onChange={(event) => onCurrencyChange(event.target.value)} className={inputClass}>
                  <option value="IDR">Rupiah Indonesia (IDR)</option>
                </select>
                <p className="mt-2 text-xs text-slate-400">Format mata uang saat ini menggunakan Rupiah (IDR).</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'data' && (
          <>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Data & laporan</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Unduh catatan keuangan dalam format Excel (.xlsx).</p>
            <div className="mt-6 flex max-w-xl flex-col gap-4 rounded-2xl border border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><FileSpreadsheet className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Laporan transaksi</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Total {transactionCount} transaksi</p>
                </div>
              </div>
              <button type="button" onClick={onExportTransactions} className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
                <Download className="h-4 w-4" /> Ekspor Excel
              </button>
            </div>
            {exportMessage && <p role="status" className="mt-3 text-sm text-emerald-700 dark:text-emerald-400">{exportMessage}</p>}
            <p className="mt-4 text-xs text-slate-400">Ekspor dibuat langsung di perangkat ini; data transaksi tidak dikirim ke server.</p>
          </>
        )}

        {activeTab === 'savings' && (
          <>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Target tabungan</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Buat tujuan pribadi dan catat progres tabungan secara manual.</p>
            <form onSubmit={handleGoalSubmit} className="mt-6 grid gap-4 rounded-2xl border border-slate-100 p-4 sm:grid-cols-2 sm:p-5 dark:border-slate-800">
              <div className="sm:col-span-2">
                <label htmlFor="savings-goal-name" className={labelClass}>Nama target</label>
                <input
                  id="savings-goal-name"
                  value={goalName}
                  onChange={(event) => setGoalName(event.target.value)}
                  required
                  maxLength={60}
                  placeholder="Contoh: Dana darurat"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="savings-goal-amount" className={labelClass}>Target nominal</label>
                <input
                  id="savings-goal-amount"
                  type="number"
                  min="1"
                  step="1000"
                  value={goalTarget}
                  onChange={(event) => setGoalTarget(event.target.value)}
                  required
                  placeholder="Contoh: 10000000"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="savings-goal-date" className={labelClass}>Target tanggal <span className="font-normal text-slate-400">(opsional)</span></label>
                <input
                  id="savings-goal-date"
                  type="date"
                  value={goalDate}
                  onChange={(event) => setGoalDate(event.target.value)}
                  min={getLocalDateValue()}
                  className={inputClass}
                />
              </div>
              {goalError && <p role="alert" className="text-sm text-rose-600 sm:col-span-2">{goalError}</p>}
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 sm:col-span-2 sm:justify-self-start">
                <CirclePlus className="h-4 w-4" /> Buat target
              </button>
            </form>

            {goalMessage && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{goalMessage}</p>}
            {contributionError && <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{contributionError}</p>}

            {savingsGoals.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
                <PiggyBank className="mx-auto h-8 w-8 text-indigo-400" />
                <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">Belum ada target tabungan</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Buat target pertamamu untuk mulai melacak progres.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {savingsGoals.map((goal) => {
                  const targetAmount = Number(goal.targetAmount) || 0;
                  const savedAmount = Number(goal.savedAmount) || 0;
                  const progress = targetAmount > 0
                    ? Math.min(100, Math.round((savedAmount / targetAmount) * 100))
                    : 0;
                  return (
                    <article key={goal.id} className="rounded-2xl border border-slate-100 p-4 sm:p-5 dark:border-slate-800">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{goal.name}</h3>
                          {goal.targetDate && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Target {new Date(`${goal.targetDate}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteSavingsGoal(goal.id)}
                          aria-label={`Hapus target ${goal.name}`}
                          title="Hapus target"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-extrabold text-indigo-700 dark:text-indigo-300">{formatRupiah(savedAmount)} <span className="font-medium text-slate-400">terkumpul</span></p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">dari {formatRupiah(targetAmount)} · {progress}%</p>
                      </div>
                      <div
                        className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                        role="progressbar"
                        aria-label={`Progres tabungan ${goal.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                      >
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <form onSubmit={(event) => handleContributionSubmit(event, goal.id)} className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <label className="sr-only" htmlFor={`contribution-${goal.id}`}>Jumlah tabungan untuk {goal.name}</label>
                        <input
                          id={`contribution-${goal.id}`}
                          type="number"
                          min="1"
                          step="1000"
                          value={contributions[goal.id] || ''}
                          onChange={(event) => setContributions((current) => ({ ...current, [goal.id]: event.target.value }))}
                          placeholder="Jumlah yang ditabung (Rp)"
                          className={`${inputClass} min-w-0 flex-1`}
                        />
                        <button type="submit" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-indigo-200 px-4 py-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10">
                          <CirclePlus className="h-4 w-4" /> Tambah tabungan
                        </button>
                      </form>
                    </article>
                  );
                })}
              </div>
            )}
            <p className="mt-4 text-xs leading-5 text-slate-400">Progres dicatat manual di browser ini dan tidak membuat atau mengubah transaksi keuangan.</p>
          </>
        )}
      </section>
    </div>
  );
}
