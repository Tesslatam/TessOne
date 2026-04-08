'use client';

import { Pencil, Trash2 } from 'lucide-react';

interface SimpleCatalogTableProps {
  items: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  onViewEmployees?: (item: any) => void;
  onClickName?: (item: any) => void;
  viewButtonLabel?: string;
  showAreaHierarchyInfo?: boolean;
}

function EmployeeCountBadge({ count = 0 }: { count?: number }) {
  const isZero = count === 0;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isZero
          ? 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
          : 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300'
      }`}
    >
      {count} {count === 1 ? 'trabajador' : 'trabajadores'}
    </span>
  );
}

function AreaTypeBadge({ item }: { item: any }) {
  const isSubarea = !!item.parentId;

  if (isSubarea) {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
          Subárea
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Depende de {item.parent?.name || 'área principal'}
        </span>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300">
      Principal
    </span>
  );
}

export default function SimpleCatalogTable({
  items,
  loading,
  onEdit,
  onDelete,
  onClickName,
  showAreaHierarchyInfo = false,
}: SimpleCatalogTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
        <p className="text-gray-500 dark:text-gray-400">
          No hay registros disponibles.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#10172a]">
              <th className="px-6 py-4 w-20">ID</th>
              <th className="px-6 py-4">Nombre</th>
              {showAreaHierarchyInfo && (
                <th className="px-6 py-4 w-[220px]">Tipo</th>
              )}
              <th className="px-6 py-4 w-[180px]">Trabajadores</th>
              <th className="px-6 py-4 w-[130px] text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const count = item?._count?.employees || 0;
              const isSubarea = !!item.parentId;

              return (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50/70 dark:hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 font-medium">{item.id}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {isSubarea && showAreaHierarchyInfo && (
                        <span className="text-purple-600 dark:text-purple-300 font-semibold">
                          ↳
                        </span>
                      )}

                      {onClickName ? (
                        <button
                          onClick={() => onClickName(item)}
                          className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition text-left"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                      )}
                    </div>
                  </td>

                  {showAreaHierarchyInfo && (
                    <td className="px-6 py-4">
                      <AreaTypeBadge item={item} />
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <EmployeeCountBadge count={count} />
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center justify-center rounded-lg border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 w-8 h-8 transition"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => onDelete(item.id)}
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-300 w-8 h-8 transition"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {items.map((item) => {
          const count = item?._count?.employees || 0;
          const isSubarea = !!item.parentId;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-5"
            >
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.id}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
                <div className="flex items-center gap-2">
                  {isSubarea && showAreaHierarchyInfo && (
                    <span className="text-purple-600 dark:text-purple-300 font-semibold">
                      ↳
                    </span>
                  )}

                  {onClickName ? (
                    <button
                      onClick={() => onClickName(item)}
                      className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition text-left"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                  )}
                </div>
              </div>

              {showAreaHierarchyInfo && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Tipo
                  </p>
                  <AreaTypeBadge item={item} />
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Trabajadores
                </p>
                <EmployeeCountBadge count={count} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 transition"
                >
                  <Pencil size={16} />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white py-2.5 transition"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}