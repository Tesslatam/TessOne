'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Save, X } from 'lucide-react';
import { api } from '../services/api';

interface AreaHierarchyConfigProps {
  onClose: () => void;
}

export default function AreaHierarchyConfig({
  onClose,
}: AreaHierarchyConfigProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['areas-hierarchy'],
    queryFn: async () => {
      const res = await api.get('/areas');
      return res.data;
    },
  });

  const [localAreas, setLocalAreas] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setLocalAreas(data);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await api.post('/areas/reorder', {
        items: localAreas.map((area, index) => ({
          id: area.id,
          hierarchyOrder: index + 1,
        })),
      });

      await api.post('/areas/parents', {
        items: localAreas.map((area) => ({
          id: area.id,
          parentId: area.parentId ? Number(area.parentId) : null,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['areas-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['areas-tree'] });
      onClose();
    },
  });

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...localAreas];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setLocalAreas(updated);
  };

  const moveDown = (index: number) => {
    if (index === localAreas.length - 1) return;
    const updated = [...localAreas];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setLocalAreas(updated);
  };

  const updateParent = (id: number, parentId: string) => {
    setLocalAreas((prev) =>
      prev.map((area) =>
        area.id === id
          ? {
              ...area,
              parentId: parentId ? Number(parentId) : null,
            }
          : area,
      ),
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-xl p-6">
          <p className="text-gray-500 dark:text-gray-400">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#151b2f]/95 backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configuración de jerarquía
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Define el orden y el área padre de cada departamento
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 w-10 h-10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5 flex justify-end">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium transition disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saveMutation.isPending ? 'Guardando...' : 'Guardar jerarquía'}</span>
            </button>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#10172a]">
                  <th className="px-6 py-4 w-20">Orden</th>
                  <th className="px-6 py-4">Área</th>
                  <th className="px-6 py-4">Depende de</th>
                  <th className="px-6 py-4 w-[180px] text-center">Trabajadores</th>
                  <th className="px-6 py-4 w-[160px] text-center">Mover</th>
                </tr>
              </thead>

              <tbody>
                {localAreas.map((area, index) => (
                  <tr
                    key={area.id}
                    className="border-b border-gray-100 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {area.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {area.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={area.parentId || ''}
                        onChange={(e) => updateParent(area.id, e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
                      >
                        <option value="">Sin área padre</option>
                        {localAreas
                          .filter((candidate) => candidate.id !== area.id)
                          .map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>
                              {candidate.name}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                        {area?._count?.employees || 0}{' '}
                        {(area?._count?.employees || 0) === 1
                          ? 'trabajador'
                          : 'trabajadores'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 w-9 h-9 disabled:opacity-30"
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === localAreas.length - 1}
                          className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 w-9 h-9 disabled:opacity-30"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {saveMutation.isError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
              No se pudo guardar la jerarquía.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
