import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function formatCompact(amount) {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'M';
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'jt';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'rb';
  return Number(amount).toLocaleString('id-ID');
}

export default function FinancialCalendar({ transactions, bills, onSelectDate }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12

  // Navigasi bulan
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  // Pre-kalkulasi data transaksi per tanggal YYYY-MM-DD
  const dailyData = {};
  transactions.forEach((t) => {
    if (!dailyData[t.date]) {
      dailyData[t.date] = { income: 0, expense: 0, count: 0 };
    }
    if (t.type === 'income') {
      dailyData[t.date].income += Number(t.amount);
    } else {
      dailyData[t.date].expense += Number(t.amount);
    }
    dailyData[t.date].count += 1;
  });

  // Pre-kalkulasi tagihan per tanggal YYYY-MM-DD
  const dailyBills = {};
  bills.forEach((b) => {
    if (b.status !== 'unpaid') return;
    if (!dailyBills[b.due_date]) {
      dailyBills[b.due_date] = [];
    }
    dailyBills[b.due_date].push(b);
  });

  // Hitung hari kalender
  const monthIdx = currentMonth - 1; // 0-indexed
  const firstDayIndex = new Date(currentYear, monthIdx, 1).getDay();
  const totalDays = new Date(currentYear, monthIdx + 1, 0).getDate();
  const prevMonthTotalDays = new Date(currentYear, monthIdx, 0).getDate();

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Trailing previous month days
  const prevDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevDays.push(prevMonthTotalDays - i);
  }

  // Active days
  const activeDays = [];
  for (let d = 1; d <= totalDays; d++) {
    activeDays.push(d);
  }

  // Trailing next month days to complete 7 cols
  const totalRendered = firstDayIndex + totalDays;
  const remainingCount = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
  const nextDays = [];
  for (let i = 1; i <= remainingCount; i++) {
    nextDays.push(i);
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      {/* Header Kalender: Judul & Kontrol */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {monthNames[currentMonth - 1]} {currentYear}
            </h3>
            <p className="text-xs text-slate-500">Pilih tanggal untuk melihat rincian transaksi</p>
          </div>
        </div>

        {/* Legend Indikator */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>Pengeluaran</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Jatuh Tempo</span>
          </div>
        </div>

        {/* Tombol Navigasi */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200 rounded-xl transition"
          >
            Hari Ini
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 rounded-xl transition"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 rounded-xl transition"
            title="Bulan Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Nama Hari */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-4 text-center">
        {dayNames.map((day) => (
          <div key={day} className="py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
            <span className="sm:hidden">{day.slice(0, 1)}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>

      {/* Grid Sel Kalender */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-2">
        {/* Trailing Days Bulan Lalu */}
        {prevDays.map((day, idx) => (
          <div
            key={`prev-${idx}`}
            className="min-h-[54px] sm:min-h-[105px] p-1.5 sm:p-2 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl opacity-50 select-none"
          >
            <span className="text-xs font-semibold text-slate-400">{day}</span>
          </div>
        ))}

        {/* Hari Aktif Bulan Ini */}
        {activeDays.map((day) => {
          const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const dayInfo = dailyData[dateStr];
          const dueBills = dailyBills[dateStr] || [];

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`min-h-[54px] sm:min-h-[105px] p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isToday
                  ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-300'
              }`}
            >
              {/* Header Tanggal */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold ${
                    isToday
                      ? 'w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-extrabold shadow-sm shadow-indigo-500/50'
                      : 'text-slate-600 group-hover:text-indigo-700'
                  }`}
                >
                  {day}
                </span>

                {/* Indikator Tagihan Jatuh Tempo */}
                {dueBills.length > 0 && (
                  <span className="flex h-2 w-2 relative" title={`${dueBills.length} Tagihan Jatuh Tempo`}>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </div>

              {/* Badges Transaksi & Tagihan */}
              <div className="space-y-1 mt-auto">
                {dayInfo && dayInfo.income > 0 && (
                  <div className="text-[8px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded-md truncate flex items-center gap-1">
                    <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0 sm:block"></span>
                    <span className="truncate">+{formatCompact(dayInfo.income)}</span>
                  </div>
                )}

                {dayInfo && dayInfo.expense > 0 && (
                  <div className="text-[8px] sm:text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1 sm:px-1.5 py-0.5 rounded-md truncate flex items-center gap-1">
                    <span className="hidden h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0 sm:block"></span>
                    <span className="truncate">-{formatCompact(dayInfo.expense)}</span>
                  </div>
                )}

                {dueBills.length > 0 && (
                  <div className="hidden text-[9px] font-medium text-amber-800 bg-amber-50 px-1 py-0.5 rounded truncate sm:flex sm:items-center sm:gap-1">
                    <Bell className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate">{dueBills[0].title}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Trailing Days Bulan Berikutnya */}
        {nextDays.map((day, idx) => (
          <div
            key={`next-${idx}`}
            className="min-h-[54px] sm:min-h-[105px] p-1.5 sm:p-2 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl opacity-50 select-none"
          >
            <span className="text-xs font-semibold text-slate-400">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
