import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Receipt } from 'lucide-react';
import { DataTable } from '../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

const MOCK_EXPENSES = [
  { id: '1', date: '2023-11-20', category: 'Rent', description: 'Warehouse Rent - Nov', amount: 3500 },
  { id: '2', date: '2023-11-22', category: 'Utilities', description: 'Electricity & Water', amount: 450 },
  { id: '3', date: '2023-11-25', category: 'Logistics', description: 'Container Transport', amount: 1200 },
];

export function Expenses() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="text-sm">{row.original.date}</span>
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
          {row.original.category}
        </span>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.description}</span>
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <span className="font-mono text-slate-700" dir="ltr">${Number(row.original.amount || 0).toLocaleString()}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">Manage operational costs and overheads.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute inset-y-0 my-auto w-4 h-4 text-slate-500 mis-3" />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-md pis-9 pie-4 py-2 text-sm focus:border-slate-900 transition-all outline-none"
            />
          </div>
        </div>
        
        <DataTable columns={columns} data={MOCK_EXPENSES} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-sm w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-medium">Add Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:bg-slate-100">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Date</label>
                <input type="date" className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900" />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Category</label>
                <select className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900">
                  <option>Rent</option>
                  <option>Utilities</option>
                  <option>Logistics</option>
                  <option>Payroll</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Amount ($)</label>
                <input type="number" step="0.01" className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Description</label>
                <input type="text" className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900" placeholder="Brief details about the expense" />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
