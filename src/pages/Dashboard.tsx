import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Box, PackageOpen, ReceiptEuro, WalletCards, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, profit: 2400 },
  { name: 'Tue', revenue: 3000, profit: 1398 },
  { name: 'Wed', revenue: 2000, profit: 9800 },
  { name: 'Thu', revenue: 2780, profit: 3908 },
  { name: 'Fri', revenue: 1890, profit: 4800 },
  { name: 'Sat', revenue: 2390, profit: 3800 },
  { name: 'Sun', revenue: 3490, profit: 4300 },
];

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { dashboardStats, fetchDashboard, isLoading } = useStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = dashboardStats?.stats || { totalContainers: 0, totalStockValue: 0, totalSales: 0, pendingBalances: 0 };
  const recentSales = dashboardStats?.recentSales || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-start">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">{t('dashboard.overview')}</h1>
        <div className="flex gap-2 text-sm">
          <span className="text-slate-500">{t('dashboard.date')}</span>
          <span className="font-medium">{new Intl.DateTimeFormat(i18n.language).format(new Date())}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('dashboard.totalStockValue'), value: new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'USD' }).format(stats.totalStockValue), icon: PackageOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: t('dashboard.totalRevenue'), value: new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'USD' }).format(stats.totalSales), icon: ReceiptEuro, color: 'text-slate-900', bg: 'bg-slate-1000/10' },
          { label: t('dashboard.outstandingDebt'), value: new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'USD' }).format(stats.pendingBalances), icon: WalletCards, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: t('dashboard.containersInTransit'), value: new Intl.NumberFormat(i18n.language).format(stats.totalContainers), icon: Box, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-md p-6 relative overflow-hidden transition-all hover:bg-slate-100/80 hover:border-slate-300">
            <div className="flex items-center justify-between z-10 relative">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{s.label}</p>
                <div className="text-2xl font-medium">{s.value}</div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg} ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
            </div>
            {/* Subtle glow effect */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 blur-3xl ${s.bg} rounded-full opacity-50`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">{t('dashboard.revenueVsProfit')}</h2>
            <select className="bg-slate-100 border-none rounded text-xs px-2 py-1 outline-none">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }} 
                  itemStyle={{ fontSize: 13 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">{t('dashboard.actionNeeded')}</h2>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1 space-y-4">
            {[
              { title: "Toyota Corolla Engine stock low", desc: "Only 2 left in Warehouse A", time: "1 hr ago" },
              { title: "Invoice #1042 overdue", desc: "$4,200 pending from Al-Amini Bros", time: "4 hrs ago" },
              { title: "Container AU-042 arrived", desc: "Awaiting customs clearance", time: "1 day ago" }
            ].map((alert, i) => (
              <div key={i} className="flex gap-4 items-start p-3 rounded-md hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-300 cursor-pointer">
                <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-slate-900 bg-slate-1000/10 hover:bg-slate-1000/20 rounded-md transition-colors">
            {t('dashboard.viewAllIssues')}
          </button>
        </div>
      </div>
    </div>
  );
}
