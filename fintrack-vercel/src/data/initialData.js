export const initialCategories = [
  { id: 1, name: 'Gaji & Pendapatan', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { id: 2, name: 'Side Project / Freelance', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { id: 3, name: 'Investasi & Dividen', type: 'income', icon: 'TrendingUp', color: '#3b82f6' },
  { id: 4, name: 'Makanan & Minuman', type: 'expense', icon: 'Utensils', color: '#f43f5e' },
  { id: 5, name: 'Transportasi & Bensin', type: 'expense', icon: 'Car', color: '#fb923c' },
  { id: 6, name: 'Tagihan & Utilitas', type: 'expense', icon: 'Zap', color: '#eab308' },
  { id: 7, name: 'Belanja Kebutuhan', type: 'expense', icon: 'ShoppingBag', color: '#a855f7' },
  { id: 8, name: 'Hiburan & Liburan', type: 'expense', icon: 'Film', color: '#ec4899' },
];

const legacyDemoTransactions = [
  { id: 1, category_id: 1, type: 'income', amount: 15000000, date: '2026-10-01', description: 'Gaji Bulanan PT Tech Nusantara' },
  { id: 2, category_id: 4, type: 'expense', amount: 85000, date: '2026-10-02', description: 'Makan Siang Resto Padang' },
  { id: 3, category_id: 5, type: 'expense', amount: 250000, date: '2026-10-03', description: 'Isi Bensin Pertamax Turbo' },
  { id: 4, category_id: 6, type: 'expense', amount: 450000, date: '2026-10-05', description: 'Bayar Listrik PLN' },
  { id: 5, category_id: 7, type: 'expense', amount: 780000, date: '2026-10-08', description: 'Belanja Bulanan Supermarket' },
  { id: 6, category_id: 2, type: 'income', amount: 3500000, date: '2026-10-10', description: 'Pembayaran Desain UI/UX Web' },
  { id: 7, category_id: 4, type: 'expense', amount: 120000, date: '2026-10-12', description: 'Kopi & Snack Meeting Client' },
  { id: 8, category_id: 8, type: 'expense', amount: 300000, date: '2026-10-15', description: 'Nonton Bioskop & Dinner' },
  { id: 9, category_id: 4, type: 'expense', amount: 95000, date: '2026-10-18', description: 'Makan Malam Sushi' },
  { id: 10, category_id: 3, type: 'income', amount: 850000, date: '2026-10-20', description: 'Dividen Reksadana' },
  { id: 11, category_id: 5, type: 'expense', amount: 150000, date: '2026-10-22', description: 'Tarif Tol & Parkir' },
  { id: 12, category_id: 4, type: 'expense', amount: 65000, date: '2026-10-25', description: 'Sarapan & Makan Siang' },
  { id: 13, category_id: 7, type: 'expense', amount: 320000, date: '2026-10-26', description: 'Beli Kebutuhan Rumah Tangga' },
  { id: 14, category_id: 6, type: 'expense', amount: 350000, date: '2026-10-28', description: 'Langganan Internet Fiber Optik' },
];

const legacyDemoBudgets = [
  { id: 1, category_id: 4, amount_limit: 3000000 }, // Makanan
  { id: 2, category_id: 5, amount_limit: 1200000 }, // Transport
  { id: 3, category_id: 6, amount_limit: 1500000 }, // Tagihan
  { id: 4, category_id: 7, amount_limit: 2000000 }, // Belanja
  { id: 5, category_id: 8, amount_limit: 1000000 }, // Hiburan
];

const legacyDemoBills = [
  { id: 1, category_id: 6, title: 'Tagihan Wi-Fi Indihome', amount: 350000, due_date: '2026-10-28', status: 'unpaid' },
  { id: 2, category_id: 6, title: 'Cicilan Laptop Kantor', amount: 1250000, due_date: '2026-10-30', status: 'unpaid' },
  { id: 3, category_id: 6, title: 'BPJS Kesehatan', amount: 150000, due_date: '2026-10-10', status: 'paid' },
];

export const initialTransactions = [];
export const initialBudgets = [];
export const initialBills = [];

export function removeLegacyDemoRecords(records, legacyRecords, ignoredKeys = []) {
  return records.filter((record) => !legacyRecords.some((legacyRecord) =>
    Object.entries(legacyRecord)
      .filter(([key]) => !ignoredKeys.includes(key))
      .every(([key, value]) => record[key] === value)
  ));
}

export function removeLegacyDemoTransactions(transactions) {
  return removeLegacyDemoRecords(transactions, legacyDemoTransactions);
}

export function removeLegacyDemoBudgets(budgets) {
  return removeLegacyDemoRecords(budgets, legacyDemoBudgets);
}

export function removeLegacyDemoBills(bills) {
  return removeLegacyDemoRecords(bills, legacyDemoBills, ['status']);
}

export function formatRupiah(amount) {
  return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
}
