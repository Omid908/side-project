import React from 'react';
import { Check, Clock, Truck, Package, Ship, Building2 } from 'lucide-react';

const statuses = [
  { id: 'origin', label: 'At Origin', icon: Building2 },
  { id: 'transit', label: 'In Transit', icon: Ship },
  { id: 'customs', label: 'Customs', icon: Clock },
  { id: 'warehouse', label: 'At Warehouse', icon: Truck },
  { id: 'processed', label: 'Processed', icon: Package },
];

export function ContainerStatusTracker({ currentStatus, vertical = false }: { currentStatus: string, vertical?: boolean }) {
  // Simple matching logic
  let currentIndex = 0;
  if (currentStatus === 'In Transit') currentIndex = 1;
  if (currentStatus === 'Customs') currentIndex = 2;
  if (currentStatus === 'At Warehouse') currentIndex = 3;
  if (currentStatus === 'Processed') currentIndex = 4;

  return (
    <div className={`flex ${vertical ? 'flex-col space-y-4' : 'items-center justify-between w-full'} font-sans`}>
      {statuses.map((step, idx) => {
        const isComplete = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isPending = idx > currentIndex;

        return (
          <div key={step.id} className={`flex ${vertical ? 'items-start gap-3' : 'flex-col items-center flex-1 relative'}`}>
            {/* Horizontal connecting line */}
            {!vertical && idx < statuses.length - 1 && (
              <div className="absolute top-4 left-1/2 w-full h-[2px] -z-10">
                <div className={`h-full ${isComplete ? 'bg-slate-800' : 'bg-slate-100'}`} style={{ width: '100%', left: '50%', position: 'absolute' }} />
              </div>
            )}
            
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 bg-slate-50 z-10
              ${isComplete ? 'border-slate-900 text-slate-900' : isCurrent ? 'border-blue-500 border-dashed text-slate-900' : 'border-slate-200 text-slate-600'}
            `}>
              {isComplete ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
            </div>
            
            <div className={`${vertical ? 'mt-1' : 'mt-2 text-center'}`}>
              <p className={`text-xs font-medium ${isComplete || isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                {step.label}
              </p>
              {vertical && isCurrent && <p className="text-xs text-slate-900 mt-1">Current Status</p>}
            </div>
            
             {/* Vertical connecting line */}
             {vertical && idx < statuses.length - 1 && (
              <div className={`w-[2px] h-6 mis-4 mt-2 ${isComplete ? 'bg-slate-800' : 'bg-slate-100'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
