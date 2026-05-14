import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Plus, Search, Filter, Phone, Mail, MapPin, Receipt, WalletCards, History, User } from 'lucide-react';
import { DataTable } from '../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

const MOCK_DEBT_TIMELINE = [
  { id: 't1', date: '2023-10-15', amount: 4200, invoice: 'INV-1042', status: 'overdue', customer: 'Al-Amini Bros' },
  { id: 't2', date: '2023-11-01', amount: 5000, invoice: 'INV-1055', status: 'pending', customer: 'Kabul Auto Parts' },
  { id: 't3', date: '2023-11-10', amount: 10500, invoice: 'INV-1061', status: 'pending', customer: 'Kabul Auto Parts' },
  { id: 't4', date: '2023-09-20', amount: -2000, invoice: 'PAY-892', status: 'paid', customer: 'Dubai Motors LLC' }, // payment
];

// semantic colors: profit (emerald), loss (rose), pending debt (amber), info (indigo)

export function Customers() {
  const { t } = useTranslation();
  const { customers, fetchCustomers, addCustomer } = useStore();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCustomer(formData);
    setIsCustomerModalOpen(false);
    setFormData({ name: '', phone: '', address: '', notes: '' });
  };
  
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => <span className="font-medium text-slate-900">{row.original.name}</span>
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="flex flex-col text-xs text-slate-500">
          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> <span dir="ltr">{row.original.phone}</span></span>
          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {row.original.email}</span>
        </div>
      )
    },
    {
      accessorKey: 'total_purchases',
      header: 'Total Volume',
      cell: ({ row }) => <span className="font-mono text-emerald-400" dir="ltr">${Number(row.original.total_purchases || 0).toLocaleString()}</span>
    },
    {
      accessorKey: 'pending_debt',
      header: 'Outstanding Debt',
      cell: ({ row }) => (
        <span className={`font-mono ${row.original.pending_debt > 0 ? 'text-amber-400' : 'text-slate-500'}`} dir="ltr">
          ${Number(row.original.pending_debt || 0).toLocaleString()}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const isOverdue = row.original.status === 'Overdue';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
            ${isOverdue ? 'bg-rose-400/10 text-rose-400 border border-rose-400/20' : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'}`}>
            {row.original.status}
          </span>
        )
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-start">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">{t('common.customers')}</h1>
          <p className="text-sm text-slate-500 mt-1">Manage client profiles, transaction volumes, and ledgers.</p>
        </div>
        <button onClick={() => setIsCustomerModalOpen(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          {t('common.add')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 flex gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute inset-y-0 my-auto w-4 h-4 text-slate-500 mis-3" />
                <input 
                  type="text" 
                  placeholder="Search customers..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-md pis-9 pie-4 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none"
                />
              </div>
            </div>
            
            <DataTable columns={columns} data={customers} />
          </div>
        </div>

        {/* Semantic Ledger Activity Component */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden p-6 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Ledger Activity</h2>
            <History className="w-4 h-4 text-slate-500" />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {MOCK_DEBT_TIMELINE.map((evt) => {
              const isPayment = evt.amount < 0;
              const isOverdue = evt.status === 'overdue';
              
              const iconColor = isPayment ? 'text-emerald-500 bg-emerald-50' 
                             : isOverdue ? 'text-rose-500 bg-rose-50' 
                             : 'text-amber-500 bg-amber-50';
                             
              const Icon = isPayment ? Receipt : WalletCards;

              return (
                <div key={evt.id} className="flex items-center justify-between p-3 rounded-md border border-slate-100 hover:border-slate-200 bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-md shrink-0 ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-slate-900">{evt.customer}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{evt.date}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-xs font-mono text-slate-500">{evt.invoice}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-mono font-medium ${isPayment ? 'text-emerald-600' : isOverdue ? 'text-rose-600' : 'text-amber-600'}`} dir="ltr">
                    {isPayment ? '+' : '-'}${Math.abs(evt.amount).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-sm w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-medium">Add New Customer</h2>
              <button onClick={() => setIsCustomerModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:bg-slate-100">&times;</button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Company / Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900" 
                  placeholder="e.g. Al-Amini Bros" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900" 
                  placeholder="+971 50 123 4567" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Address</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900" 
                  placeholder="Dubai, UAE" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900" 
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
