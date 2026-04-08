'use client';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ThemeToggle from '../../components/ThemeToggle';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useThemeStore } from '../../store/theme.store';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useState(false);

  const loadTokenFromStorage = useAuthStore((state) => state.loadTokenFromStorage);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadTheme = useThemeStore((state) => state.loadTheme);

  useEffect(() => {
    loadTheme();
    loadTokenFromStorage();
    setChecked(true);
  }, [loadTokenFromStorage, loadTheme]);

  useEffect(() => {
    if (checked && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [checked, isAuthenticated]);

  if (!checked || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b1020] flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-[#0b1020] transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 text-gray-800 dark:text-white transition-colors">
          {children}
        </main>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}