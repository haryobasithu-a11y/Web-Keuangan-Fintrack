import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { formatRupiah } from '../data/initialData';

export default function MetricCards({
  totalIncome,
  totalExpense,
  netBalance,
  totalBudget,
  remainingBudget,
  budgetUsagePercent,
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 2xl:grid-cols-4">
      <article className="relative col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg shadow-indigo-600/15 2xl:col-span-1">
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-white/10" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-100">Saldo bersih bulan ini</span>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
            <Wallet className="h-5 w-5" />
          </span>
        </div>
        <h2 className="relative mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">{formatRupiah(netBalance)}</h2>
        <p className="relative mt-1 text-xs text-indigo-100">
          {netBalance >= 0 ? 'Surplus arus kas' : 'Defisit arus kas'} periode ini
        </p>
        <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-2/3 rounded-full bg-white/90" />
        </div>
      </article>

      <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total pemasukan</span>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </span>
        </div>
        <h2 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">{formatRupiah(totalIncome)}</h2>
        <p className="mt-1 text-xs text-slate-500">Akumulasi pemasukan bulan ini</p>
      </article>

      <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Pengeluaran bulan ini</span>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-500">
            <TrendingDown className="h-5 w-5" />
          </span>
        </div>
        <h2 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">{formatRupiah(totalExpense)}</h2>
        <p className="mt-1 text-xs text-slate-500">Total pengeluaran tercatat</p>
      </article>

      <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Sisa anggaran</span>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <PiggyBank className="h-5 w-5" />
          </span>
        </div>
        <h2 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">{formatRupiah(remainingBudget)}</h2>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetUsagePercent > 90 ? 'bg-rose-500' : budgetUsagePercent > 75 ? 'bg-amber-400' : 'bg-indigo-600'
            }`}
            style={{ width: `${budgetUsagePercent}%` }}
          />
        </div>
        <p className="mt-2 flex justify-between text-[11px] text-slate-500">
          <span>Terpakai {budgetUsagePercent}%</span>
          <span>Limit {formatRupiah(totalBudget)}</span>
        </p>
      </article>
    </div>
  );
}
