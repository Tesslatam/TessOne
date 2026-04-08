'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import UserAvatar from '../../../components/UserAvatar';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
      } catch (error) {
        console.error('No se pudo cargar la cuenta');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) {
    return <div>Cargando información de la cuenta...</div>;
  }

  if (!user) {
    return (
      <div className="bg-red-100 text-red-700 border border-red-300 rounded-xl px-4 py-3">
        No se pudo cargar la información del usuario.
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Mi cuenta</h1>

      <div className="bg-white dark:bg-[#151b2f] rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar
            name={user.name}
            photoUrl={user.profilePhoto || null}
            size="lg"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              {user.employee?.position?.name || user.role?.name || 'Sin puesto'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Correo</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Empresa</p>
            <p className="font-medium">{user.company?.name || 'Sin empresa'}</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Puesto</p>
            <p className="font-medium">
              {user.employee?.position?.name || user.role?.name || 'Sin puesto'}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 dark:bg-[#10172a] p-4 text-sm text-gray-600 dark:text-gray-300">
          En el siguiente bloque podemos agregar carga real de foto de perfil.
        </div>
      </div>
    </div>
  );
}