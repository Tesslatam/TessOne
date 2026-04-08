'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

interface SimpleCatalogModalProps {
  title?: string;
  item?: any;
  endpoint: string;
  onClose: () => void;
  onSuccess: () => void;
  api: any;
  initialParentId?: number | null;
}

export default function SimpleCatalogModal({
  title = 'registro',
  item,
  endpoint,
  onClose,
  onSuccess,
  api,
  initialParentId = null,
}: SimpleCatalogModalProps) {
  const safeTitle = title || 'registro';
  const isEditing = !!item?.id;
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isAreaModal = endpoint === '/areas';

  const { data: areas } = useQuery({
    queryKey: ['areas-for-parent-select', endpoint],
    queryFn: async () => {
      if (!isAreaModal) return [];
      const res = await api.get('/areas');
      return res.data;
    },
    enabled: isAreaModal,
  });

  useEffect(() => {
    setName(item?.name || '');
    setParentId(
      item?.parentId
        ? String(item.parentId)
        : initialParentId
        ? String(initialParentId)
        : '',
    );
    setErrorMessage('');
  }, [item, initialParentId]);

  const mutation = useMutation({
    mutationFn: async () => {
      setErrorMessage('');

      if (!name.trim()) {
        throw new Error('El nombre es obligatorio');
      }

      const payload: any = {
        name: name.trim(),
      };

      if (isAreaModal) {
        payload.parentId = parentId ? Number(parentId) : null;
      }

      if (isEditing) {
        await api.put(`${endpoint}/${item.id}`, payload);
      } else {
        await api.post(endpoint, payload);
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo guardar.';

      setErrorMessage(
        Array.isArray(backendMessage)
          ? backendMessage.join(', ')
          : backendMessage,
      );
    },
  });

  const availableParents =
    areas?.filter((area: any) => {
      if (!isEditing) return true;
      return area.id !== item.id;
    }) || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? `Editar ${safeTitle}` : `Nuevo ${safeTitle}`}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Nombre
            </label>

            <input
              type="text"
              placeholder={`Ingresa el nombre del ${safeTitle}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
            />
          </div>

          {isAreaModal && (
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                Área padre
              </label>

              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
              >
                <option value="">Sin área padre (área principal)</option>
                {availableParents.map((area: any) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200"
          >
            Cancelar
          </button>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium disabled:opacity-50"
          >
            {mutation.isPending
              ? 'Guardando...'
              : isEditing
              ? 'Actualizar'
              : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
