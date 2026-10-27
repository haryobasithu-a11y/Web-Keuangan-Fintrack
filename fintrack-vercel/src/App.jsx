import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowDownLeft,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Download,
  Home,
  LogOut,
  MessageCircle,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from '@firebase/auth';
import LandingPage from './components/LandingPage';
import {
  firebaseAuth,
  githubAuthProvider,
  googleAuthProvider,
  isFirebaseConfigured,
} from './firebase';
import { createTransactionWorkbook } from './utils/transactionExport';
import SettingsPage from './components/SettingsPage';
import MetricCards from './components/MetricCards';
import FinancialCalendar from './components/FinancialCalendar';
import TrendChart from './components/TrendChart';
import BudgetOverview from './components/BudgetOverview';
import DayDetailModal from './components/DayDetailModal';
import AddTransactionModal from './components/AddTransactionModal';
import {
  formatRupiah,
  initialCategories,
  initialTransactions,
  initialBudgets,
  initialBills,
  removeLegacyDemoTransactions,
  removeLegacyDemoBudgets,
  removeLegacyDemoBills,
} from './data/initialData';

const PROFILE_NAME = 'Haryo Basithu Priyono';
const pages = [
  { id: 'dashboard', hash: '#dashboard', label: 'Beranda', Icon: Home },
  { id: 'activity', hash: '#aktivitas', label: 'Aktivitas', Icon: CircleDollarSign },
  { id: 'calendar', hash: '#kalender', label: 'Kalender', Icon: CalendarDays },
  { id: 'analysis', hash: '#analisis', label: 'Analisis', Icon: ChartNoAxesCombined },
  { id: 'transactions', hash: '#transaksi', label: 'Transaksi', Icon: MessageCircle },
  { id: 'settings', hash: '#pengaturan', label: 'Pengaturan', Icon: Settings },
];

function getPageFromHash(hash) {
  return pages.find((page) => page.hash === hash)?.id || 'dashboard';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const billPaymentLocks = useRef(new Set());
  const [installPrompt, setInstallPrompt] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => getPageFromHash(window.location.hash));
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('fintrack_profile');
    return savedProfile ? JSON.parse(savedProfile) : { name: PROFILE_NAME, email: '' };
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('fintrack_theme') || 'light');
  const [currency, setCurrency] = useState(() => localStorage.getItem('fintrack_currency') || 'IDR');
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const savedGoals = localStorage.getItem('fintrack_savings_goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthReady(true);
      return undefined;
    }

    return onAuthStateChanged(
      firebaseAuth,
      (user) => {
        setCurrentUser(user);
        if (user) {
          setProfile((current) => ({
            ...current,
            name: current.name || user.displayName || PROFILE_NAME,
            email: user.email || current.email,
          }));
        }
        setAuthReady(true);
      },
      (error) => {
        console.error('FinTrack Firebase authentication state failed:', error);
        setAuthError('Status login tidak dapat diperiksa. Muat ulang halaman dan coba lagi.');
        setAuthReady(true);
      },
    );
  }, []);

  // LocalStorage state persistence
  const [categories] = useState(() => {
    const saved = localStorage.getItem('fintrack_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fintrack_transactions');
    return saved ? removeLegacyDemoTransactions(JSON.parse(saved)) : initialTransactions;
  });

  const [budgets] = useState(() => {
    const saved = localStorage.getItem('fintrack_budgets');
    return saved ? removeLegacyDemoBudgets(JSON.parse(saved)) : initialBudgets;
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('fintrack_bills');
    return saved ? removeLegacyDemoBills(JSON.parse(saved)) : initialBills;
  });

  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('fintrack_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('fintrack_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fintrack_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fintrack_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('fintrack_savings_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.removeItem('fintrack_subscription');
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('FinTrack service worker registration failed:', error);
      });
    }

    const handleInstallAvailable = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleInstallAvailable);
    return () => window.removeEventListener('beforeinstallprompt', handleInstallAvailable);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPage(getPageFromHash(window.location.hash));
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const activePage = pages.find((page) => page.id === currentPage);
    document.title = currentUser && activePage
      ? `${activePage.label} | FinTrack`
      : 'FinTrack | Keuangan Pribadi';
  }, [currentPage, currentUser]);

  // Modals state
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultDate, setAddModalDefaultDate] = useState('');

  // Perhitungan Keuangan Bulan Ini
  const now = new Date();
  const currentYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthTransactions = transactions.filter((t) => t.date.startsWith(currentYm));

  let totalIncome = 0;
  let totalExpense = 0;
  currentMonthTransactions.forEach((t) => {
    if (t.type === 'income') totalIncome += Number(t.amount);
    else totalExpense += Number(t.amount);
  });

  const netBalance = totalIncome - totalExpense;

  const totalBudget = budgets.reduce((acc, b) => acc + Number(b.amount_limit), 0);
  const remainingBudget = Math.max(0, totalBudget - totalExpense);
  const budgetUsagePercent = totalBudget > 0 ? Math.min(100, Math.round((totalExpense / totalBudget) * 100)) : 0;

  // Handlers
  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    setIsDayModalOpen(true);
  };

  const handleOpenAddModal = (dateStr = '') => {
    setAddModalDefaultDate(dateStr);
    setIsAddModalOpen(true);
  };

  const handleAddFromDayModal = (dateStr) => {
    setIsDayModalOpen(false);
    handleOpenAddModal(dateStr);
  };

  const handleSaveTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handlePayBill = (billId) => {
    if (billPaymentLocks.current.has(billId)) return;
    const bill = bills.find((item) => item.id === billId);
    if (!bill || bill.status !== 'unpaid') return;

    const amount = Number(bill.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert('Nominal tagihan tidak valid. Periksa data tagihan sebelum membayar.');
      return;
    }

    const confirmed = window.confirm(
      `Bayar dan catat ${bill.title} sebesar ${formatRupiah(amount)} sebagai pengeluaran hari ini?\n\nAksi ini memperbarui catatan saldo FinTrack, tetapi tidak mengirim pembayaran ke bank atau penyedia layanan.`,
    );
    if (!confirmed) return;

    billPaymentLocks.current.add(billId);
    const paidAt = new Date();
    const paidDate = `${paidAt.getFullYear()}-${String(paidAt.getMonth() + 1).padStart(2, '0')}-${String(paidAt.getDate()).padStart(2, '0')}`;
    const paymentTransactionId = globalThis.crypto.randomUUID();

    setTransactions((previousTransactions) => [{
      id: paymentTransactionId,
      type: 'expense',
      amount,
      category_id: Number(bill.category_id),
      date: paidDate,
      description: `Pembayaran tagihan: ${bill.title}`,
    }, ...previousTransactions]);
    setBills((previousBills) => previousBills.map((item) => (
      item.id === billId && item.status === 'unpaid'
        ? {
          ...item,
          status: 'paid',
          paid_at: paidDate,
          payment_transaction_id: paymentTransactionId,
        }
        : item
    )));
  };

  const handleExportTransactions = async () => {
    try {
      const workbookData = createTransactionWorkbook({
        transactions,
        categories,
        profile,
      });
      const file = new Blob([workbookData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const fileUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement('a');
      downloadLink.href = fileUrl;
      downloadLink.download = `FinTrack-Laporan-${new Date().toISOString().slice(0, 10)}.xlsx`;
      downloadLink.click();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
      setExportMessage('Laporan Excel berhasil diunduh.');
    } catch (error) {
      console.error('FinTrack transaction export failed:', error);
      setExportMessage('Gagal membuat laporan Excel. Coba lagi setelah memuat ulang halaman.');
    }
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleCreateSavingsGoal = ({ name, targetAmount, targetDate }) => {
    const goal = {
      id: globalThis.crypto.randomUUID(),
      name,
      targetAmount,
      targetDate,
      savedAmount: 0,
      createdAt: new Date().toISOString(),
    };
    setSavingsGoals((previousGoals) => [goal, ...previousGoals]);
  };

  const handleAddSavingsContribution = (goalId, amount) => {
    setSavingsGoals((previousGoals) => previousGoals.map((goal) => (
      goal.id === goalId
        ? { ...goal, savedAmount: Number(goal.savedAmount) + amount }
        : goal
    )));
  };

  const handleDeleteSavingsGoal = (goalId) => {
    setSavingsGoals((previousGoals) => previousGoals.filter((goal) => goal.id !== goalId));
  };

  const handleDeleteTransaction = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const getAuthErrorMessage = (error, action) => {
    const messages = {
      'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk.',
      'auth/invalid-credential': 'Email atau kata sandi salah.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/network-request-failed': 'Koneksi bermasalah. Periksa internet lalu coba lagi.',
      'auth/operation-not-allowed': 'Metode login ini belum diaktifkan pada Firebase Authentication.',
      'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
      'auth/user-disabled': 'Akun ini dinonaktifkan. Hubungi administrator.',
      'auth/user-not-found': 'Akun tidak ditemukan. Periksa email atau buat akun baru.',
      'auth/weak-password': 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter.',
      'auth/wrong-password': 'Email atau kata sandi salah.',
      'auth/account-exists-with-different-credential': 'Email ini sudah terdaftar dengan metode login lain.',
      'auth/requires-recent-login': 'Silakan keluar lalu masuk kembali sebelum melakukan tindakan ini.',
      'auth/unauthorized-domain': 'Domain aplikasi ini belum diizinkan pada Firebase Authentication.',
      'auth/popup-closed-by-user': 'Login dibatalkan sebelum selesai.',
      'auth/popup-blocked': 'Pop-up login diblokir. Izinkan pop-up lalu coba lagi.',
    };
    return messages[error.code] || `Gagal ${action}. Periksa koneksi dan pengaturan Firebase, lalu coba lagi.`;
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    if (!firebaseAuth) {
      setAuthError('Login Google belum dikonfigurasi. Lengkapi pengaturan Firebase lalu muat ulang halaman.');
      return;
    }

    setAuthLoading(true);
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (error) {
      console.error('FinTrack Google sign-in failed:', error);
      setAuthError(getAuthErrorMessage(error, 'masuk dengan Google'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setAuthError('');
    if (!firebaseAuth) {
      setAuthError('Login GitHub belum dikonfigurasi. Lengkapi pengaturan Firebase lalu muat ulang halaman.');
      return;
    }

    setAuthLoading(true);
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInWithPopup(firebaseAuth, githubAuthProvider);
    } catch (error) {
      console.error('FinTrack GitHub sign-in failed:', error);
      setAuthError(getAuthErrorMessage(error, 'masuk dengan GitHub'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setAuthError('');
    if (!firebaseAuth) {
      setAuthError('Login anonim belum dikonfigurasi. Lengkapi pengaturan Firebase lalu muat ulang halaman.');
      return;
    }

    setAuthLoading(true);
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInAnonymously(firebaseAuth);
    } catch (error) {
      console.error('FinTrack anonymous sign-in failed:', error);
      setAuthError(getAuthErrorMessage(error, 'masuk sebagai tamu'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async ({ mode, name, email, password, rememberMe }) => {
    if (!firebaseAuth) {
      throw new Error('Login belum dikonfigurasi. Lengkapi pengaturan Firebase lalu muat ulang halaman.');
    }
    setAuthError('');
    setAuthLoading(true);
    try {
      if (mode === 'signup') {
        await setPersistence(
          firebaseAuth,
          rememberMe ? browserLocalPersistence : browserSessionPersistence,
        );
        const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await updateProfile(credential.user, { displayName: name });
        setProfile((current) => ({ ...current, name, email }));
        return;
      }
      await setPersistence(
        firebaseAuth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error(`FinTrack email ${mode} failed:`, error);
      throw new Error(getAuthErrorMessage(error, mode === 'signup' ? 'membuat akun' : 'masuk'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordReset = async (email) => {
    if (!firebaseAuth) {
      throw new Error('Reset kata sandi belum dikonfigurasi. Lengkapi pengaturan Firebase lalu muat ulang halaman.');
    }
    setAuthLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
    } catch (error) {
      console.error('FinTrack password reset failed:', error);
      throw new Error(getAuthErrorMessage(error, 'mengirim email reset'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!firebaseAuth) return;
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error('FinTrack sign-out failed:', error);
      window.alert('Gagal keluar dari akun. Silakan coba lagi.');
    }
  };

  const navigateToPage = (pageId) => {
    const page = pages.find((item) => item.id === pageId);
    if (!page) return;
    if (window.location.hash !== page.hash) window.history.pushState(null, '', page.hash);
    setCurrentPage(page.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!authReady) {
    return (
      <main className="auth-loading-enter grid min-h-screen place-items-center bg-slate-50 text-sm font-medium text-slate-500">
        Memeriksa sesi…
      </main>
    );
  }

  if (!currentUser) {
    return (
      <LandingPage
        onGoogleLogin={handleGoogleLogin}
        onGitHubLogin={handleGitHubLogin}
        onAnonymousLogin={handleAnonymousLogin}
        onEmailAuth={handleEmailAuth}
        onPasswordReset={handlePasswordReset}
        isGoogleConfigured={isFirebaseConfigured}
        isGitHubConfigured={isFirebaseConfigured}
        isAnonymousConfigured={isFirebaseConfigured}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  const displayName = profile.name || PROFILE_NAME;
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarContent = profile.avatarDataUrl ? (
    <img src={profile.avatarDataUrl} alt="" className="h-full w-full object-cover" />
  ) : avatarInitial;

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const recentTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const renderTransactionList = (items) => (
    <div className="divide-y divide-slate-100">
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">Belum ada transaksi yang tercatat.</p>
      ) : items.map((transaction) => {
        const category = categories.find((item) => item.id === transaction.category_id);
        const isIncome = transaction.type === 'income';
        return (
          <div key={transaction.id} className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-0">
            <div className="flex min-w-0 items-center gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                <ArrowDownLeft className={`h-4 w-4 ${isIncome ? '' : 'rotate-180'}`} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{transaction.description}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {category?.name || 'Transaksi'} · {new Date(`${transaction.date}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <span className={`shrink-0 text-right text-sm font-extrabold ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
              {isIncome ? '+' : '−'}{formatRupiah(transaction.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 'activity':
        return (
          <>
            <section aria-label="Ringkasan aktivitas keuangan">
              <MetricCards {...{ totalIncome, totalExpense, netBalance, totalBudget, remainingBudget, budgetUsagePercent }} />
            </section>
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <BudgetOverview budgets={budgets} categories={categories} transactions={transactions} />
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-extrabold text-slate-900">Aktivitas terbaru</h2>
                <p className="mb-4 mt-1 text-xs text-slate-500">Pergerakan pemasukan dan pengeluaranmu</p>
                {renderTransactionList(recentTransactions.slice(0, 5))}
              </div>
            </section>
          </>
        );
      case 'calendar':
        return <FinancialCalendar transactions={transactions} bills={bills} onSelectDate={handleSelectDate} />;
      case 'analysis':
        return (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
            <TrendChart transactions={transactions} />
            <BudgetOverview budgets={budgets} categories={categories} transactions={transactions} />
          </div>
        );
      case 'transactions':
        return (
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Semua transaksi</h2>
                <p className="mt-1 text-xs text-slate-500">{transactions.length} transaksi tersimpan</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAddModal('')}
                className="flex shrink-0 items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
              >
                <PlusCircle className="h-4 w-4" /> Tambah
              </button>
            </div>
            {renderTransactionList(recentTransactions)}
          </section>
        );
      default:
        return (
          <>
            <section aria-label="Ringkasan saldo dan anggaran">
              <MetricCards {...{ totalIncome, totalExpense, netBalance, totalBudget, remainingBudget, budgetUsagePercent }} />
            </section>
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
              <TrendChart transactions={transactions} />
              <BudgetOverview budgets={budgets} categories={categories} transactions={transactions} />
            </section>
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Riwayat transaksi</h2>
                  <p className="mt-1 text-xs text-slate-500">Aktivitas keuangan terbaru</p>
                </div>
                <button type="button" onClick={() => navigateToPage('transactions')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  Lihat semua
                </button>
              </div>
              {renderTransactionList(recentTransactions.slice(0, 5))}
            </section>
          </>
        );
      case 'settings':
        return (
          <SettingsPage
            profile={profile}
            onSaveProfile={handleSaveProfile}
            theme={theme}
            onThemeChange={setTheme}
            currency={currency}
            onCurrencyChange={setCurrency}
            onExportTransactions={handleExportTransactions}
            transactionCount={transactions.length}
            exportMessage={exportMessage}
            savingsGoals={savingsGoals}
            onCreateSavingsGoal={handleCreateSavingsGoal}
            onAddSavingsContribution={handleAddSavingsContribution}
            onDeleteSavingsGoal={handleDeleteSavingsGoal}
          />
        );
    }
  };

  return (
    <div className={`dashboard-shell min-h-screen bg-[#08090d] p-0 text-slate-900 sm:p-4 lg:p-7 ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <div className="dashboard-frame dashboard-enter mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1500px] overflow-hidden rounded-none bg-white shadow-2xl sm:rounded-[2rem]">
        <aside className="dashboard-sidebar hidden w-[82px] shrink-0 flex-col items-center py-6 md:flex">
          <button type="button" onClick={() => navigateToPage('dashboard')} aria-label="FinTrack beranda" className="mb-12 h-10 w-14 overflow-hidden rounded-xl bg-white shadow-lg shadow-indigo-950/20">
            <img src="/fintrack-logo.png" alt="FinTrack" className="h-full w-full object-cover object-[center_40%]" />
          </button>
          <nav className="flex flex-1 flex-col items-center gap-3" aria-label="Navigasi utama">
            {pages.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => navigateToPage(id)}
                aria-label={label}
                aria-current={currentPage === id ? 'page' : undefined}
                title={label}
                className={`grid h-11 w-11 place-items-center rounded-2xl transition ${
                  currentPage === id ? 'bg-white text-indigo-600 shadow-md' : 'text-white/75 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Keluar"
            title="Keluar"
            className="mt-8 grid h-11 w-11 place-items-center rounded-full bg-white text-rose-500 shadow-lg transition hover:bg-rose-50"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <button type="button" onClick={() => navigateToPage('dashboard')} aria-label="FinTrack" className="h-10 w-36 overflow-hidden rounded-full bg-white md:hidden">
              <img src="/fintrack-logo.png" alt="FinTrack" className="h-full w-full object-cover object-[center_40%]" />
            </button>
            <div className="hidden h-11 w-40 overflow-hidden rounded-full bg-white md:block">
              <img src="/fintrack-logo.png" alt="FinTrack" className="h-full w-full object-cover object-[center_40%]" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigateToPage('transactions')}
                aria-label="Cari transaksi"
                title="Cari transaksi terbaru"
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateToPage('calendar');
                  handleSelectDate(bills.find((bill) => bill.status === 'unpaid')?.due_date || new Date().toISOString().slice(0, 10));
                }}
                aria-label="Lihat tagihan"
                title="Lihat tagihan"
                className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50"
              >
                <Bell className="h-4 w-4" />
                {bills.some((bill) => bill.status === 'unpaid') && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('settings')}
                aria-label="Buka profil dan pengaturan"
                title="Profil dan pengaturan"
                className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-100 text-sm font-extrabold text-indigo-700 md:hidden"
              >
                {avatarContent}
              </button>
                  {installPrompt && (
                    <button
                      type="button"
                      onClick={handleInstallApp}
                      className="hidden items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 sm:flex"
                    >
                      <Download className="h-4 w-4" />
                      Install app
                    </button>
                  )}
                  <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
                <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-100 text-sm font-extrabold text-indigo-700">{avatarContent}</div>
                <div className="max-w-36">
                  <p className="truncate text-xs font-bold text-slate-900">{displayName}</p>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500"><Sparkles className="h-3 w-3 text-indigo-500" /> Member</span>
                </div>
              </div>
              <button type="button" onClick={handleLogout} aria-label="Keluar" title="Keluar" className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-rose-600 md:hidden">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>

          <main className="space-y-5 px-4 pb-28 pt-1 sm:space-y-6 sm:px-7 sm:pb-8 lg:px-9">
            <section key={currentPage} className="page-enter space-y-5 sm:space-y-6">
              <header className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.17em] text-indigo-600">FinTrack · Keuangan pribadi</p>
                  <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                    {currentPage === 'dashboard' ? `Halo, ${displayName} 👋` : pages.find((page) => page.id === currentPage)?.label}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    {currentPage === 'dashboard'
                      ? 'Pantau status keuangan dan tabunganmu hari ini.'
                      : `Kelola dan pantau ${pages.find((page) => page.id === currentPage)?.label.toLowerCase()} keuanganmu.`}
                  </p>
                </div>
                {currentPage !== 'transactions' && (
                  <button
                    onClick={() => handleOpenAddModal('')}
                    className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                  >
                    <PlusCircle className="h-4 w-4" /> Catat transaksi
                  </button>
                )}
              </header>
              {renderPageContent()}
            </section>
            <footer className="pb-2 text-center text-[11px] text-slate-400">
              &copy; {now.getFullYear()} FinTrack · Data tersimpan di browser ini
            </footer>
          </main>

        </div>
      </div>

      <nav className={`app-launch-nav mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-slate-200/80 bg-white/95 px-1 pt-2 backdrop-blur-xl md:hidden ${theme === 'dark' ? 'theme-dark' : ''}`} aria-label="Navigasi utama">
        {pages.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => navigateToPage(id)}
            aria-current={currentPage === id ? 'page' : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-semibold transition active:bg-indigo-50 sm:text-[10px] ${
              currentPage === id ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <Icon className="h-5 w-5" />
            {id === 'transactions' ? 'Riwayat' : label}
          </button>
        ))}
      </nav>

      <DayDetailModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        selectedDate={selectedDate}
        transactions={transactions}
        bills={bills}
        categories={categories}
        onDeleteTransaction={handleDeleteTransaction}
        onPayBill={handlePayBill}
        onOpenAddModalWithDate={handleAddFromDayModal}
      />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultDate={addModalDefaultDate}
        categories={categories}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
