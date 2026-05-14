import React from 'react';
import { useTranslation } from 'react-i18next';

export function Settings() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">{t('common.settings')}</h1>
        <p className="text-sm text-slate-500 mt-1">Manage system preferences and configurations.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-medium text-slate-900">Application Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Currency Symbol</label>
              <select className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900">
                <option value="USD">USD ($)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
              <select className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 outline-none focus:border-slate-900">
                <option>Asia/Dubai</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Print Format</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="radio" name="printFormat" className="w-4 h-4 text-slate-900 rounded border-slate-300" defaultChecked />
                <span className="text-sm text-slate-700">A4 Standard</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="printFormat" className="w-4 h-4 text-slate-900 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Thermal Receipt (80mm)</span>
              </label>
            </div>
          </div>

        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
           <button className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900 transition">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
