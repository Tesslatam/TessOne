'use client';

import { Pencil, Trash2 } from 'lucide-react';

interface EmployeesTableProps {
  employees: any[];
  loading: boolean;
  onEdit: (employee: any) => void;
  onDelete: (id: number) => void;
}

export default function EmployeesTable({
  employees,
  loading,
  onEdit,
  onDelete,
}: EmployeesTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
        <p className="text-gray-500 dark:text-gray-400">Cargando empleados...</p>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
        <p className="text-gray-500 dark:text-gray-400">
          No hay empleados registrados.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden lg:block rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Área</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-gray-100 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200"
                >
                  <td className="px-6 py-4">{employee.code}</td>
                  <td className="px-6 py-4">{employee.name}</td>
                  <td className="px-6 py-4">{employee.email || '-'}</td>
                  <td className="px-6 py-4">{employee.phone || '-'}</td>
                  <td className="px-6 py-4">{employee.area?.name || '-'}</td>
                  <td className="px-6 py-4">{employee.position?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/10 text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(employee.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-5"
          >
            <div className="mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Código</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.code}</p>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Correo</p>
              <p className="text-gray-900 dark:text-white">{employee.email || '-'}</p>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
              <p className="text-gray-900 dark:text-white">{employee.phone || '-'}</p>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Área</p>
              <p className="text-gray-900 dark:text-white">{employee.area?.name || '-'}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">Cargo</p>
              <p className="text-gray-900 dark:text-white">{employee.position?.name || '-'}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(employee)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(employee.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}