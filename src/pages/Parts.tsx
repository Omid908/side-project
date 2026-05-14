import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Plus, Search, Filter, MoreHorizontal, FileDown } from 'lucide-react';
import { DataTable } from '../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const partSchema = z.object({
  part_name: z.string().min(2, 'Part Name is required'),
  category: z.string().min(1, 'Category is required'),
  container_id: z.string().optional(),
  car_brand: z.string().optional(),
  car_model: z.string().optional(),
  chassis_number: z.string().optional(),
  buy_price: z.coerce.number().min(0),
  quantity: z.coerce.number().min(1)
});

type PartFormValues = z.infer<typeof partSchema>;

export function Parts() {
  const { t } = useTranslation();
  const { parts, fetchParts, addPart, containers, fetchContainers, isLoading } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PartFormValues>({
    resolver: zodResolver(partSchema) as any,
    defaultValues: {
      buy_price: 0,
      quantity: 1,
      category: 'Other'
    }
  });

  useEffect(() => {
    fetchParts();
    fetchContainers();
  }, [fetchParts, fetchContainers]);

  const onSubmit = (data: PartFormValues) => {
    addPart({
      ...data,
      container_id: data.container_id || '',
      car_brand: data.car_brand || '',
      car_model: data.car_model || '',
      chassis_number: data.chassis_number || '',
      status: 'Available'
    });
    reset();
    setIsModalOpen(false);
  };

  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      accessorKey: 'part_name',
      header: 'Part Name',
      cell: ({ row }) => <span className="font-medium">{row.original.part_name}</span>
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-500">
          {row.original.category}
        </span>
      )
    },
    {
      accessorKey: 'car_brand',
      header: 'Vehicle',
      cell: ({ row }) => <span className="text-slate-500">{row.original.car_brand} {row.original.car_model}</span>
    },
    {
      accessorKey: 'chassis_number',
      header: 'Chassis No.',
      cell: ({ row }) => <span className="font-mono text-xs text-slate-500" dir="ltr">{row.original.chassis_number || '-'}</span>
    },
    {
      accessorKey: 'container_name',
      header: 'Container',
      cell: ({ row }) => <span className="text-slate-500">{row.original.container_name || '-'}</span>
    },
    {
      accessorKey: 'buy_price',
      header: 'Price',
      cell: ({ row }) => <span className="font-mono text-end block w-full" dir="ltr">${row.original.buy_price}</span>
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => <span className="text-end block w-full">{row.original.quantity}</span>
    },
    {
      id: 'actions',
      cell: () => (
        <button className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-all ml-auto block">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )
    }
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-start">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">{t('common.parts')}</h1>
          <p className="text-sm text-slate-500 mt-1">Manage individual spare parts across all containers.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors border border-slate-300">
            <FileDown className="w-4 h-4" />
            {t('common.export')}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            {t('common.add')}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute inset-y-0 my-auto w-4 h-4 text-slate-500 mis-3" />
            <input 
              type="text" 
              placeholder="Search by part name, chassis or SKU..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-md pis-9 pie-4 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none"
            />
          </div>
          <select className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 outline-none">
            <option value="">All Categories</option>
            <option value="Engine">Engines</option>
            <option value="Gearbox">Gearboxes</option>
            <option value="Half Cut">Half Cuts</option>
            <option value="Suspension">Suspension</option>
            <option value="Body Part">Body Parts</option>
          </select>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">{t('common.loading')}</div>
        ) : (
          <DataTable columns={columns} data={parts} />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60  z-50 flex items-center justify-center animate-in fade-in duration-200" dir="auto">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-2xl shadow-sm overflow-hidden slide-in-from-bottom-8 text-start">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Part</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:hover:text-slate-900">&times;</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit as any)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Part Name</label>
                    <input {...register('part_name')} type="text" className={`w-full bg-slate-50 border ${errors.part_name ? 'border-red-500' : 'border-slate-200 focus:border-slate-900'} rounded-md px-3 py-2 text-sm outline-none`} placeholder="e.g. 1JZ-GTE Engine" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Category</label>
                    <select {...register('category')} className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-slate-900 outline-none">
                      <option value="Engine">Engine</option>
                      <option value="Half Cut">Half Cut</option>
                      <option value="Gearbox">Gearbox</option>
                      <option value="Suspension">Suspension</option>
                      <option value="Body Part">Body Part</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Car Brand</label>
                      <input {...register('car_brand')} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-slate-900 outline-none" placeholder="Toyota" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Car Model</label>
                      <input {...register('car_model')} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-slate-900 outline-none" placeholder="Supra" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Source Container</label>
                    <select {...register('container_id')} className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-slate-900 outline-none">
                      <option value="">No Container</option>
                      {containers.map((c) => (
                        <option key={c.id} value={c.id}>{c.container_id}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Chassis Number</label>
                    <input {...register('chassis_number')} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-slate-900 outline-none" placeholder="JZA80-XXXXXX" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Buy Price ($)</label>
                      <input {...register('buy_price')} type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-slate-900 outline-none" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">Quantity</label>
                      <input {...register('quantity')} type="number" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-slate-900 outline-none" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 mt-6 flex justify-end gap-3 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 rounded-md text-sm font-medium text-white transition-colors">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
