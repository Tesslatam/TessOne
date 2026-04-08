'use client';

import { useEffect } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/auth.store';
import UserAvatar from './UserAvatar';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'Buenos días';
  if (hour >= 12 && hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
      } catch (error) {
        console.error('No se pudo cargar el usuario logueado');
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser]);

  return (
    <header className="w-full bg-white/90 dark:bg-[#10172a]/95 backdrop-blur border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {getGreeting()}
          {user?.name ? `, ${user.name}` : ''}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Panel administrativo de {user?.company?.name || 'TessOne'}
        </p>
      </div>

      <a
        href="/account"
        className="flex items-center justify-center rounded-full hover:scale-105 transition"
        title={user?.name || 'Mi cuenta'}
      >
        <UserAvatar
          name={user?.name || 'U'}
          photoUrl={user?.profilePhoto || null}
          size="sm"
        />
      </a>
    </header>
  );
}