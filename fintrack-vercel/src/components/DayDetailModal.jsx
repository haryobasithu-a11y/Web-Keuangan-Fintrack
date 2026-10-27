import React from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Trash2, PlusCircle, AlertTriangle, Receipt } from 'lucide-react';
import { formatRupiah } from '../data/initialData';

export default function DayDetailModal({
  isOpen,
  onClose,
  selectedDate,
  transactions,
  bills,
  categories,
  onDeleteTransaction,
  onPayBill,
  onOpenAddModalWithDate,
}) {
  if (!isOpen || !selectedDate) return null;

  // Filter transaksi & tagihan untuk tanggal ini
  const dayTransactions = transactions.filter((t) => t.date === selectedDate);
  const dayBills = bills.filter((b) => b.due_date === selectedDate && b.status === 'unpaid');

  // Kalkulasi total hari ini
  let dayIncome = 0;
  let dayExpense = 0;
  dayTransactions.forEach((t) => {
    if (t.type === 'income') dayIncome += Number(t.amount);
    else dayExpense += Number(t.amount);
  });
  const netBalance = dayIncome - dayExpense;

  // Format tanggal bahasa Indonesia
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(selectedDate + 'T00:00:00'));

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : 'Umum';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Rincian Finansial Harian</span>
            <h3 className="text-xl font-bold text-slate-900">{formattedDate}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ringkasan Arus Kas Hari Ini */}
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <span className="text-[11px] font-semibold text-emerald-700 block mb-0.5">Pemasukan</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900">{formatRupiah(dayIncome)}</span>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <span className="text-[11px] font-semibold text-rose-600 block mb-0.5">Pengeluaran</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900">{formatRupiah(dayExpense)}</span>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <span className="text-[11px] font-semibold text-indigo-600 block mb-0.5">Cash Flow Bersih</span>
              <span className={`text-sm sm:text-base font-extrabold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatRupiah(netBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* List Transaksi & Tagihan */}
        <div className="p-6 max-h-[380px] overflow-y-auto space-y-4">
          {/* Tagihan Jatuh Tempo (Jika ada) */}
          {dayBills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Tagihan Jatuh Tempo ({dayBills.length})
              </h4>
              <div className="space-y-2">
                {dayBills.map((bill) => (
                  <div
                    key={bill.id}
                    className={`flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between ${
                      bill.status === 'paid'
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">{bill.title}</p>
                      <span className={`text-xs font-medium ${bill.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {bill.status === 'paid'
                          ? `Lunas${bill.paid_at ? ` · dibayar ${new Date(`${bill.paid_at}T00:00:00`).toLocaleDateString('id-ID')}` : ''}`
                          : 'Belum dibayar'}
                      </span>
                      {bill.status === 'unpaid' && (
                        <p className="mt-1 text-[11px] leading-4 text-slate-500">
                          Dicatat sebagai pengeluaran; tidak mengirim uang ke bank/provider.
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <span className="text-sm font-extrabold text-slate-900">{formatRupiah(bill.amount)}</span>
                      {bill.status === 'unpaid' && (
                        <button
                          type="button"
                          onClick={() => onPayBill(bill.id)}
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                        >
                          Bayar & catat pengeluaran
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-4 text-slate-500">
                Menandai tagihan lunas dan mengurangi saldo tercatat di FinTrack, tetapi pembayaran sebenarnya tetap dilakukan lewat bank/aplikasi penyedia.
              </p>
            </div>
          )}

          {/* Daftar Transaksi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              Daftar Transaksi ({dayTransactions.length})
            </h4>

            {dayTransactions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-500">Belum ada transaksi tercatat pada tanggal ini.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dayTransactions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white border border-slate-100 hover:border-slate-300 rounded-2xl flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {item.type === 'income' ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.description}</p>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {getCategoryName(item.category_id)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm sm:text-base font-extrabold ${
                          item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {item.type === 'income' ? '+' : '-'}
                        {formatRupiah(item.amount)}
                      </span>
                      <button
                        onClick={() => onDeleteTransaction(item.id)}
                        title="Hapus Transaksi"
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal: Quick Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            Tutup
          </button>
          <button
            onClick={() => onOpenAddModalWithDate(selectedDate)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat di Tanggal Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
}
