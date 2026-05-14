import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, ReceiptEuro, User, Trash2, X, Printer } from 'lucide-react';

export function Sales() {
  const { parts, customers } = useStore();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [cart, setCart] = useState<{part: any, qty: number}[]>([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const subtotal = cart.reduce((acc, item) => acc + (item.part.buy_price * 1.2) * item.qty, 0); // 20% markup mockup
  
  const handleAddPart = (part: any) => {
    setCart(prev => {
      const existing = prev.find(p => p.part.id === part.id);
      if (existing) {
        return prev.map(p => p.part.id === part.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { part, qty: 1 }];
    });
  };

  const handleRemovePart = (id: string) => {
    setCart(prev => prev.filter(p => p.part.id !== id));
  };

  const filteredParts = parts.filter(p => p.part_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.car_model?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleNewSale = () => {
    setCart([]);
    setSelectedCustomer(null);
    setIsInvoiceModalOpen(false);
  };

  const { addSale } = useStore();

  const handleCompleteSale = async () => {
    if (!selectedCustomer || cart.length === 0) return;
    
    // push to global backend
    await addSale({
      customer_id: selectedCustomer.id,
      total_amount: subtotal * 1.05,
      items: cart.map(item => ({
        part_id: item.part.id,
        qty: item.qty,
        unit_price: item.part.buy_price * 1.2
      }))
    });

    setIsInvoiceModalOpen(true);
  };


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Point of Sale</h1>
          <p className="text-sm text-slate-500 mt-1">Create invoices and manage sales transactions.</p>
        </div>
        <button onClick={handleNewSale} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          New Sale
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md overflow-hidden min-h-[500px] flex flex-col">
           <div className="p-4 border-b border-slate-200 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan barcode or search part..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-3 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none shadow-inner"
                  autoFocus
                />
              </div>
           </div>
           
           <div className="flex-1 overflow-auto p-4 bg-slate-50">
             {filteredParts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                    <ReceiptEuro className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-center">Search for a part to add to the cart.</p>
                </div>
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredParts.map(part => (
                    <div 
                      key={part.id} 
                      onClick={() => handleAddPart(part)}
                      className="bg-white border text-start border-slate-200 p-4 rounded-md cursor-pointer hover:border-slate-900 hover:shadow-sm transition-all active:scale-95 flex flex-col"
                    >
                      <span className="text-xs text-slate-500 mb-1">{part.category}</span>
                      <span className="font-medium text-slate-900 mb-2 truncate">{part.part_name}</span>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-mono text-slate-900">${(part.buy_price * 1.2).toFixed(2)}</span>
                        <span className="text-xs text-slate-400">Qty: {part.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
             )}
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md overflow-hidden p-6 flex flex-col h-[500px]">
          <h2 className="text-lg font-medium mb-4 border-b border-slate-200 pb-2">Sale Summary</h2>
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4 flex flex-col flex-1 overflow-hidden">
               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Customer</label>
                  <button 
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-md p-3 hover:border-slate-300 transition-colors text-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{selectedCustomer ? selectedCustomer.name : 'Select Customer'}</span>
                        {selectedCustomer && <span className="text-xs text-slate-500">{selectedCustomer.phone}</span>}
                      </div>
                    </div>
                  </button>
               </div>
               
               <div className="flex-1 mt-4 border border-slate-100 rounded-md p-3 overflow-y-auto space-y-3 bg-slate-50">
                 {cart.length === 0 ? (
                   <p className="text-sm text-slate-400 text-center py-8">Cart is empty</p>
                 ) : (
                   cart.map(item => (
                     <div key={item.part.id} className="flex justify-between items-start gap-2 bg-white p-2 rounded border border-slate-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{item.part.part_name}</p>
                          <p className="text-xs text-slate-500">{item.qty} x ${(item.part.buy_price * 1.2).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono">${((item.part.buy_price * 1.2) * item.qty).toFixed(2)}</span>
                          <button onClick={() => handleRemovePart(item.part.id)} className="text-rose-400 hover:text-rose-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4 space-y-3 mt-4 shrink-0">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <button 
                disabled={cart.length === 0 || !selectedCustomer} 
                onClick={handleCompleteSale}
                className="w-full py-3 mt-4 bg-slate-800 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-sm w-full max-w-md overflow-hidden flex flex-col">
             <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-medium">Select Customer</h2>
                <button onClick={() => setIsCustomerModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:bg-slate-100"><X className="w-5 h-5"/></button>
             </div>
             <div className="p-4 bg-slate-50 border-b border-slate-100">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input type="text" placeholder="Search customers..." className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 rounded-md outline-none focus:border-slate-900" />
               </div>
             </div>
             <div className="overflow-y-auto max-h-60">
                {customers.length === 0 && <div className="p-4 text-center text-sm text-slate-500">No customers found. Add one in the Customers page.</div>}
                {customers.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => { setSelectedCustomer(c); setIsCustomerModalOpen(false); }}
                    className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition"
                  >
                     <div>
                       <p className="font-medium text-sm text-slate-900">{c.name}</p>
                       <p className="text-xs text-slate-500">{c.phone}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Invoice Modal for Printing */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4">
          {/* Actions above the invoice */}
          <div className="absolute top-4 right-4 flex gap-4 no-print">
            <button onClick={() => window.print()} className="bg-white hover:bg-slate-100 text-slate-900 shadow-sm border border-slate-200 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button onClick={handleNewSale} className="bg-white hover:bg-slate-100 text-slate-900 shadow-sm border border-slate-200 px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              Close & New Sale
            </button>
          </div>
          
          <div className="bg-white rounded-sm shadow-sm w-full max-w-2xl overflow-y-auto max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:max-w-none print-only-container">
            <div className="p-8 md:p-12" id="invoice">
              <div className="flex justify-between items-start border-b border-zinc-200 pb-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-6 h-6 font-bold text-white text-xs bg-slate-900 rounded-sm">AP</div>
                    <span className="font-bold tracking-tight text-slate-900">AutoParts ERP</span>
                  </div>
                  <p className="text-sm text-zinc-500">123 Industrial Area, Dubai</p>
                  <p className="text-sm text-zinc-500">TRN: 100234567890003</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-mono text-zinc-900 mb-1">INVOICE</h2>
                  <p className="text-xs font-mono text-zinc-500">#INV-2023-{Math.floor(Math.random() * 10000)}</p>
                  <p className="text-xs font-mono text-zinc-500">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">Billed To</h3>
                <p className="font-medium text-zinc-900">{selectedCustomer?.name}</p>
                <p className="text-sm text-zinc-600 font-mono">{selectedCustomer?.phone}</p>
              </div>

              <table className="w-full mb-8 text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left">
                    <th className="pb-3 text-xs uppercase tracking-wider text-zinc-500 font-medium w-full">Description</th>
                    <th className="pb-3 text-xs uppercase tracking-wider text-zinc-500 font-medium text-center px-4">Qty</th>
                    <th className="pb-3 text-xs uppercase tracking-wider text-zinc-500 font-medium text-right px-4">Price</th>
                    <th className="pb-3 text-xs uppercase tracking-wider text-zinc-500 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 text-zinc-900">{item.part.part_name} <br/><span className="text-xs font-mono text-zinc-400">{item.part.car_brand} • {item.part.part_number}</span></td>
                      <td className="py-3 text-center text-zinc-600 font-mono">{item.qty}</td>
                      <td className="py-3 text-right text-zinc-600 font-mono">${(item.part.buy_price * 1.2).toFixed(2)}</td>
                      <td className="py-3 text-right text-zinc-900 font-mono">${((item.part.buy_price * 1.2) * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end border-t border-zinc-200 pt-8">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-mono text-zinc-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">VAT (5%)</span>
                    <span className="font-mono text-zinc-900">${(subtotal * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium border-t border-zinc-200 pt-3">
                    <span className="text-zinc-900">Total</span>
                    <span className="font-mono text-zinc-900">${(subtotal * 1.05).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center text-xs text-zinc-400 border-t border-zinc-200 pt-8">
                Thank you for your business. Terms & conditions apply.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
