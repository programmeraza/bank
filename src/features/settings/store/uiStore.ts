import { create } from 'zustand';

export interface SystemNotification {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  isRead: boolean;
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  language: 'ru' | 'uz' | 'en';
  notifications: SystemNotification[];
  isNotificationOpen: boolean;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'ru' | 'uz' | 'en') => void;
  setNotificationOpen: (isOpen: boolean) => void;
  addNotification: (message: string, type?: 'info' | 'warning' | 'error') => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'light',
  language: 'ru',
  isNotificationOpen: false,
  notifications: [
    { id: '1', timestamp: '14:30', message: 'По договору CTR-5014 зафиксирована просрочка 14 дней.', type: 'error', isRead: false },
    { id: '2', timestamp: '11:15', message: 'Заявка APP-1025 успешно согласована риск-менеджером.', type: 'info', isRead: false },
    { id: '3', timestamp: '09:05', message: 'Начата плановая проверка резервов по МСФО-9.', type: 'warning', isRead: false },
  ],

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemDark ? 'dark' : 'light');
      } else {
        root.classList.add('light');
      }
    }
    set({ theme });
  },

  setLanguage: (language) => set({ language }),
  
  setNotificationOpen: (isOpen) => set({ isNotificationOpen: isOpen }),

  addNotification: (message, type = 'info') => {
    const newNotify: SystemNotification = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      message,
      type,
      isRead: false,
    };
    set((state) => ({ notifications: [newNotify, ...state.notifications] }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),
}));