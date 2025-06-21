import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  quantity: number;
  category: string;
}

export interface TicketItem {
  id: string;
  matchId: string;
  matchTitle: string;
  date: string;
  time: string;
  ticketType: string;
  price: number;
  quantity: number;
  seats?: string[];
}

export interface MembershipItem {
  id: string;
  type: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
}

interface CartStore {
  items: CartItem[];
  tickets: TicketItem[];
  membership: MembershipItem | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addTicket: (ticket: Omit<TicketItem, 'id'>) => void;
  removeTicket: (id: string) => void;
  clearTickets: () => void;
  setMembership: (membership: MembershipItem) => void;
  clearMembership: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTicketsTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tickets: [],
      membership: null,
      
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === newItem.id && item.size === newItem.size
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id && item.size === newItem.size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
          };
        }),
      
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.id !== id)
            : state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
        })),
      
      clearCart: () => set({ items: [] }),
      
      addTicket: (newTicket) =>
        set((state) => ({
          tickets: [...state.tickets, { ...newTicket, id: Date.now().toString() }],
        })),
      
      removeTicket: (id) =>
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.id !== id),
        })),
      
      clearTickets: () => set({ tickets: [] }),
      
      setMembership: (membership) => set({ membership }),
      
      clearMembership: () => set({ membership: null }),
      
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTicketsTotalPrice: () => {
        const state = get();
        return state.tickets.reduce((total, ticket) => total + ticket.price * ticket.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);