import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ERPState {
  containers: any[];
  parts: any[];
  customers: any[];
  sales: any[];
  dashboardStats: any;
  isLoading: boolean;
  error: string | null;
  fetchContainers: () => Promise<void>;
  fetchParts: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  addContainer: (data: any) => Promise<void>;
  addPart: (data: any) => Promise<void>;
  addCustomer: (data: any) => Promise<void>;
  addSale: (data: any) => Promise<void>;
}

export const useStore = create<ERPState>()(
  persist(
    (set, get) => ({
      containers: [],
      parts: [],
      customers: [],
      sales: [],
      dashboardStats: {
        totalInventoryValue: 0,
        monthlySales: 0,
        activeContainers: 0,
        lowStockItems: 0
      },
      isLoading: false,
      error: null,

      fetchContainers: async () => {},
      fetchParts: async () => {},
      fetchCustomers: async () => {},
      
      fetchDashboard: async () => {
        // Compute dashboard stats dynamically based on local data
        const { parts, containers, sales, customers } = get();
        const totalStockValue = parts.reduce((acc, p) => acc + (Number(p.buy_price) * Number(p.quantity)), 0);
        const totalSales = sales.reduce((acc, sale) => acc + sale.total_amount, 0);
        const totalContainers = containers.filter(c => c.status !== 'unloaded').length;
        const pendingBalances = customers.reduce((acc, c) => acc + (Number(c.pending_debt) || 0), 0);
        
        set({
          dashboardStats: {
            stats: {
              totalStockValue,
              totalSales,
              totalContainers,
              pendingBalances
            },
            recentSales: sales.slice(0, 5)
          }
        });
      },

      addContainer: async (data: any) => {
        const id = crypto.randomUUID();
        set((state) => ({ containers: [{ ...data, id }, ...state.containers] }));
        get().fetchDashboard();
      },

      addPart: async (data: any) => {
        const id = crypto.randomUUID();
        set((state) => ({ parts: [{ ...data, id }, ...state.parts] }));
        get().fetchDashboard();
      },

      addCustomer: async (data: any) => {
        const id = crypto.randomUUID();
        set((state) => ({ customers: [{ ...data, id }, ...state.customers] }));
      },

      addSale: async (data: any) => {
        const id = crypto.randomUUID();
        set((state) => {
          // Update part quantities
          const newParts = state.parts.map(p => {
            const saleItem = data.items.find((item: any) => item.part_id === p.id);
            if (saleItem) {
              return { ...p, quantity: Math.max(0, p.quantity - saleItem.qty) };
            }
            return p;
          });
          
          return {
            sales: [{ ...data, id, date: new Date().toISOString() }, ...state.sales],
            parts: newParts
          };
        });
        get().fetchDashboard();
      }
    }),
    {
      name: 'erp-storage',
    }
  )
);

