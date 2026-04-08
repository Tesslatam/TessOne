'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '../services/api';
import SimpleCatalogModal from './SimpleCatalogModal';

interface AreaChildrenModalProps {
  area: any;
  onClose: () => void;
}

export default function AreaChildrenModal({
  area,
  onClose,
}: AreaChildrenModalProps) {
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [editingSubarea, setEditingSubarea] = useState<any>(null);
  const [creatingSubarea, setCreatingSubarea] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['area-children', area.id],
    queryFn: async () => {
      const res = await api.get('/areas');
      return res.data.filter((item: any) => item.parentId === area.id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/areas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['area-children', area.id] });
      queryClient.invalidateQueries({ queryKey: ['areas-tree'] });
    },
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#151b2f]/95 backdrop-blur">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Subáreas de {area.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gestiona las subáreas relacionadas con esta área
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
                onClick={() => {
                  setCreatingSubarea(true);
                  setEditingSubarea(null);
                  setOpenForm(true);
                }}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium transition"
              >
                <Plus size={16} />
                <span>Nueva subárea</span>
              </button>
            </div>

            {isLoading ? (
              <p className="text-gray-500 dark:text-gray-400">Cargando subáreas...</p>
            ) : !data || data.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-6 text-center text-gray-500 dark:text-gray-400">
                Esta área no tiene subáreas registradas.
              </div>
            ) : (
              <div className="rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#10172a] text-sm text-gray-600 dark:text-gray-300">
                      <th className="px-6 py-4 w-24">ID</th>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4 w-[160px] text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((subarea: any) => (
                      <tr
                        key={subarea.id}
                        className="border-b border-gray-100 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200"
                      >
                        <td className="px-6 py-4">{subarea.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {subarea.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setCreatingSubarea(false);
                                setEditingSubarea(subarea);
                                setOpenForm(true);
                              }}
                              className="inline-flex items-center justify-center rounded-lg border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 w-9 h-9"
                              title="Editar subárea"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    '¿Seguro que deseas eliminar esta subárea?',
                                  )
                                ) {
                                  deleteMutation.mutate(subarea.id);
                                }
                              }}
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-300 w-9 h-9"
                              title="Eliminar subárea"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {openForm && (
        <SimpleCatalogModal
          title="subárea"
          item={editingSubarea}
          endpoint="/areas"
          api={api}
          initialParentId={creatingSubarea ? area.id : null}
          onClose={() => {
            setOpenForm(false);
            setEditingSubarea(null);
            setCreatingSubarea(false);
          }}
          onSuccess={() => {
            setOpenForm(false);
            setEditingSubarea(null);
            setCreatingSubarea(false);
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            queryClient.invalidateQueries({ queryKey: ['area-children', area.id] });
            queryClient.invalidateQueries({ queryKey: ['areas-tree'] });
          }}
        />
      )}
    </>
  );
}