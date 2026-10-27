import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TrendChart({ transactions }) {
  // Kelompokkan data berdasarkan Bulan-Tahun (6 bulan terakhir)
  const monthlyMap = {};

  transactions.forEach((t) => {
    const [year, month] = t.date.split('-');
    const key = `${year}-${month}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = { income: 0, expense: 0, label: `${month}/${year.slice(2)}` };
    }
    if (t.type === 'income') {
      monthlyMap[key].income += Number(t.amount);
    } else {
      monthlyMap[key].expense += Number(t.amount);
    }
  });

  const sortedKeys = Object.keys(monthlyMap).sort().slice(-6);
  const labels = sortedKeys.map((k) => monthlyMap[k].label);
  const incomeData = sortedKeys.map((k) => monthlyMap[k].income);
  const expenseData = sortedKeys.map((k) => monthlyMap[k].expense);

  const data = {
    labels: labels.length ? labels : ['Bulan Ini'],
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData.length ? incomeData : [0],
        backgroundColor: 'rgba(79, 70, 229, 0.9)',
        borderRadius: 8,
        barPercentage: 0.6,
      },
      {
        label: 'Pengeluaran',
        data: expenseData.length ? expenseData : [0],
        backgroundColor: 'rgba(165, 180, 252, 0.95)',
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += 'Rp ' + Number(context.parsed.y).toLocaleString('id-ID');
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.18)' },
        ticks: {
          color: '#64748b',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
          callback: (value) => {
            if (value >= 1000000) return value / 1000000 + 'jt';
            return value;
          },
        },
      },
    },
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-base font-extrabold text-slate-900">Tren keuangan</h4>
          <p className="text-xs text-slate-500">Pemasukan dan pengeluaran 6 bulan terakhir</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-md bg-indigo-600"></span> Masuk
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <span className="w-2.5 h-2.5 rounded-md bg-indigo-200"></span> Keluar
          </div>
        </div>
      </div>
      <div className="h-64 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
