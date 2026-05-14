import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Plus, Search, Filter, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-react';
import { DataTable } from '../components/ui/data-table';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ContainerStatusTracker } from '../components/ui/container-status';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const containerSchema = z.object({
  container_id: z.string().min(2, 'Container ID is required'),
  origin_country: z.string().optional(),
  arrival_date: z.string().optional(),
  total_cost: z.coerce.number().min(0, 'Cost must be 0 or more')
});

type ContainerFormValues = z.infer<typeof containerSchema>;

export function Containers() {
  const { t } = useTranslation();
  const { containers, fetchContainers, addContainer, isLoading } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContainerFormValues>({
    resolver: zodResolver(containerSchema) as any,
    defaultValues: {
      total_cost: 0
    }
  });

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  const onSubmit = (data: ContainerFormValues) => {
    addContainer({
      container_id: data.container_id,
      origin_country: data.origin_country || '',
      arrival_date: data.arrival_date || '',
      status: 'In Transit',
      total_cost: data.total_cost
    });
    reset();
    setIsModalOpen(false);
  };

  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
            className="text-slate-500 hover:text-slate-900"
          >
            {row.getIsExpanded() ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />}
          </button>
        ) : null
      },
    },
    {
      accessorKey: 'container_id',
      header: 'Container ID',
      cell: ({ row }) => <span className="font-medium">{row.original.container_id}</span>
    },
    {
      accessorKey: 'origin_country',
      header: 'Origin',
      cell: ({ row }) => <span className="text-slate-500">{row.original.origin_country || '-'}</span>
    },
    {
      accessorKey: 'arrival_date',
      header: 'Arrival Date',
      cell: ({ row }) => <span className="text-slate-500">{row.original.arrival_date || '-'}</span>
    },
    {
      accessorKey: 'total_cost',
      header: 'Cost',
      cell: ({ row }) => <span className="font-mono whitespace-nowrap" dir="ltr">${row.original.total_cost}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-400/10 text-amber-500 border border-amber-400/20`}>
          {row.original.status}
        </span>
      )
    },
    {
      id: 'actions',
      cell: () => (
        <button className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-all mis-auto block">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )
    }
  ], []);

  const renderSubComponent = ({ row }: { row: Row<any> }) => {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-md mx-6 my-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.04)]">
        <h4 className="text-sm font-medium text-slate-900 mb-6">Shipment Tracker</h4>
        <div className="max-w-3xl mx-auto">
          <ContainerStatusTracker currentStatus={row.original.status} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-start">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">{t('common.containers')}</h1>
          <p className="text-sm text-slate-500 mt-1">Manage incoming and processed container shipments.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          {t('common.add')}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute inset-y-0 my-auto w-4 h-4 text-slate-500 mis-3" />
            <input 
              type="text" 
              placeholder="Filter containers..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-md pis-9 pie-4 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4 text-slate-500" />
            Status
          </button>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">{t('common.loading')}</div>
        ) : (
          <DataTable 
            columns={columns} 
            data={containers}
            getRowCanExpand={() => true}
            renderSubComponent={renderSubComponent}
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60  z-50 flex items-center justify-center animate-in fade-in duration-200" dir="auto">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md shadow-sm overflow-hidden slide-in-from-bottom-8 text-start">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-medium">Add New Container</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Container ID / Reference</label>
                <input {...register('container_id')} type="text" className={`w-full bg-slate-50 border ${errors.container_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'} rounded-md px-3 py-2 text-sm outline-none`} placeholder="e.g. AU-042" />
                {errors.container_id && <p className="text-xs text-red-500 mt-1">{errors.container_id.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Origin Country</label>
                  <input {...register('origin_country')} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-slate-900 outline-none" placeholder="e.g. Australia" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Arrival Date</label>
                  <input {...register('arrival_date')} type="date" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-slate-900 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Total Cost Estimate ($)</label>
                <input {...register('total_cost')} type="number" step="0.01" className={`w-full bg-slate-50 border ${errors.total_cost ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'} rounded-md px-3 py-2 text-sm outline-none`} placeholder="0.00" />
                {errors.total_cost && <p className="text-xs text-red-500 mt-1">{errors.total_cost.message}</p>}
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
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
