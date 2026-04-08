'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/theme.store';

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-[#151b2f] hover:bg-gray-50 dark:hover:bg-[#1d2540] transition shadow-lg"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
}