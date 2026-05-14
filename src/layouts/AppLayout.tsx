import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Box, PackageOpen, Users, ReceiptEuro, WalletCards, Settings, Search, Globe, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store';

const getNavItems = (t: any) => [
  { text: t('common.dashboard'), icon: LayoutDashboard, path: '/' },
  { text: t('common.containers'), icon: Box, path: '/containers' },
  { text: t('common.parts'), icon: PackageOpen, path: '/parts' },
  { text: t('common.sales'), icon: ReceiptEuro, path: '/sales' },
  { text: t('common.customers'), icon: Users, path: '/customers' },
  { text: t('common.expenses'), icon: WalletCards, path: '/expenses' },
];

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { parts, containers, fetchContainers, fetchParts, fetchCustomers, fetchDashboard } = useStore();
  const navItems = getNavItems(t);

  useEffect(() => {
    fetchContainers();
    fetchParts();
    fetchCustomers();
    fetchDashboard();
  }, [fetchContainers, fetchParts, fetchCustomers, fetchDashboard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = [
    ...parts.filter(p => ((p.part_name || "") + (p.chassis_number || "") + (p.barcode_sku || "")).toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ ...p, type: 'Part' })),
    ...containers.filter(c => (c.container_id || "").toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ ...c, type: 'Container' }))
  ].slice(0, 8);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 text-slate-900">
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/50 " onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-64 pt-6 pb-4 px-4 bg-white border-e border-slate-200 z-50 animate-in slide-in-from-left-full rtl:slide-in-from-right-full">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 font-medium text-white rounded-md shadow bg-slate-800 shadow-blue-600/50">AP</div>
                <span className="text-lg font-medium tracking-tight text-slate-900">AutoParts ERP</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-md text-slate-500 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )
                  }
                >
                  <item.icon className="w-4 h-4 rtl:-scale-x-100" />
                  {item.text}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto">
              <NavLink 
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center w-full gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )
                }
              >
                <Settings className="w-4 h-4" />
                {t('common.settings')}
              </NavLink>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 pt-6 pb-4 px-4 bg-white border-e border-slate-200">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 font-medium text-white rounded-md shadow bg-slate-800 shadow-blue-600/50">AP</div>
          <span className="text-lg font-medium tracking-tight text-slate-900">AutoParts ERP</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )
              }
            >
              <item.icon className="w-4 h-4 rtl:-scale-x-100" />
              {item.text}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <NavLink
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center w-full gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )
            }
          >
            <Settings className="w-4 h-4" />
            {t('common.settings')}
          </NavLink>
        </div>
      </aside>

      <main className="flex flex-col flex-1 overflow-hidden relative">
        <header className="flex items-center justify-between px-4 md:px-8 bg-white border-b h-16 border-slate-200  z-10 sticky top-0">
          <div className="flex items-center flex-1 gap-3 md:gap-4 max-w-2xl">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 md:hidden rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center flex-1 md:w-full md:min-w-64 gap-3 px-3 md:px-4 py-2 text-sm transition-colors bg-slate-100 border-none text-slate-500 hover:bg-slate-200 rounded-md outline-none cursor-text"
            >
              <Search className="w-4 h-4 rtl:-scale-x-100" />
              <span className="flex-1 text-start">{t('common.search')}</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 font-sans text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-300">
                <span className="text-sm">⌘</span>K
              </kbd>
            </button>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={toggleLanguage} className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 px-2 md:px-3 py-1.5 rounded-md border border-slate-200 transition">
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{i18n.language === 'ar' ? 'English' : 'عربي'}</span>
              <span className="sm:hidden">{i18n.language === 'ar' ? 'EN' : 'ع'}</span>
            </button>
            <div className="w-7 h-7 md:w-8 md:h-8 border rounded-full bg-slate-100 box-content border-slate-200 shrink-0"></div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* Cmd+K Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60  animate-in fade-in duration-200" onClick={() => setIsSearchOpen(false)}>
          <div className="w-full max-w-2xl overflow-hidden shadow-sm bg-white border-slate-300 border rounded-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center px-4 py-4 border-b border-slate-200 relative group">
              <Search className="w-5 h-5 text-slate-900 me-3 animate-pulse rtl:-scale-x-100" />
              <input 
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-xl font-medium bg-transparent border-none text-slate-900 outline-none placeholder:text-slate-500 placeholder:font-normal"
                placeholder={t('common.search')}
              />
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 rounded border border-slate-300">ESC</kbd>
            </div>
            
            <div className="p-2 overflow-y-auto max-h-[60vh]">
              {searchQuery.length > 0 && searchResults.length === 0 ? (
                <div className="px-4 py-12 text-center text-slate-500">
                  <PackageOpen className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((res: any, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(res.type === 'Container' ? '/containers' : '/parts');
                      }}
                      className="flex items-center justify-between w-full p-3 text-start transition-colors rounded-md group hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-slate-50 border border-slate-200 group-hover:bg-white group-focus:bg-white shadow-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                          {res.type === 'Container' ? <Box className="w-4 h-4" /> : <PackageOpen className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-slate-900 transition-colors">{res.type === 'Container' ? res.container_id : res.part_name}</p>
                          <p className="text-xs text-slate-500">{res.type} {res.chassis_number ? `• Chassis: ${res.chassis_number}` : ''}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center gap-1">
                        Jump to <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mis-1 text-[10px]">↵</span>
                      </span>
                    </button>
                  ))}
                  {searchQuery.length === 0 && (
                    <div className="px-4 py-6 text-sm text-center text-slate-500">
                      I'm ready. Type anything to search across your operations instantly.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
