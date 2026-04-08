'use client';

import { useState } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';

export default function LoginPage() {
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const token = response.data.access_token;

      localStorage.setItem('token', token);
      setToken(token);

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141427] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1E1E2F] text-white rounded-2xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">TessOne</h1>
          <p className="text-gray-300 mt-2">Inicia sesión para continuar</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-300">Correo</label>
            <input
              type="email"
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
              placeholder="correo@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 font-medium disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </div>
    </div>
  );
}