'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface EmployeeListPreviewModalProps {
  title: string;
  endpoint: string;
  onClose: () => void;
}

export default function EmployeeListPreviewModal({
  title,
  endpoint,
  onClose,
}: EmployeeListPreviewModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['employee-preview', endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Trabajadores relacionados
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400">
            Cargando trabajadores...
          </p>
        ) : !data || data.length === 0 ? (
          <div className="rounded-xl bg-gray-50 dark:bg-[#10172a] p-4 text-gray-600 dark:text-gray-300">
            No hay trabajadores registrados para este elemento.
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((employee: any) => (
              <div
                key={employee.id}
                className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-gray-50 dark:bg-[#10172a]"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Código
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {employee.code}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nombre
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {employee.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Correo
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {employee.email || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Teléfono
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {employee.phone || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Área
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {employee.area?.name || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cargo
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {employee.position?.name || '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
