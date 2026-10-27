import React from 'react';
import { formatRupiah } from '../data/initialData';

export default function BudgetOverview({ budgets, categories, transactions }) {
  // Hitung pengeluaran per kategori bulan berjalan
  const now = new Date();
  const currentYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentYm)
  );

  const spentPerCategory = {};
  currentMonthExpenses.forEach((t) => {
    spentPerCategory[t.category_id] = (spentPerCategory[t.category_id] || 0) + Number(t.amount);
  });

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-extrabold text-slate-900">Anggaran kategori</h4>
          <span className="text-xs text-slate-500">Bulan ini</span>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {budgets.map((b) => {
            const cat = categories.find((c) => c.id === b.category_id);
            const catName = cat ? cat.name : 'Kategori';
            const spent = spentPerCategory[b.category_id] || 0;
            const pct = b.amount_limit > 0 ? Math.min(100, Math.round((spent / b.amount_limit) * 100)) : 0;
            const colorClass = pct > 90 ? 'bg-rose-500' : pct > 75 ? 'bg-amber-400' : 'bg-indigo-600';

            return (
              <div key={b.id}>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">{catName}</span>
                  <span className="text-slate-500">
                    {formatRupiah(spent)} /{' '}
                    <span className="text-slate-700 font-bold">{formatRupiah(b.amount_limit)}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorClass} transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between mt-4">
        <span>💡 Tips: Jaga pengeluaran di bawah 80% dari batas limit.</span>
      </div>
    </div>
  );
}
