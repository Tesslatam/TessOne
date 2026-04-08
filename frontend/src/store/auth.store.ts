import { create } from 'zustand';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  companyId: number;
  roleId: number;
  role?: {
    id: number;
    name: string;
  };
  company?: {
    id: number;
    name: string;
  };
  employee?: {
    id: number;
    position?: {
      id: number;
      name: string;
    };
    area?: {
      id: number;
      name: string;
    };
  };
  profilePhoto?: string | null;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  loadTokenFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  user: null,

  setToken: (token) =>
    set({
      token,
      isAuthenticated: !!token,
    }),

  setUser: (user) =>
    set({
      user,
    }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }

    set({
      token: null,
      isAuthenticated: false,
      user: null,
    });
  },

  loadTokenFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      set({
        token,
        isAuthenticated: !!token,
      });
    }
  },
}));
