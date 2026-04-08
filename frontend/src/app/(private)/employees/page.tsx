'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { api } from '../../../services/api';
import EmployeeModal from '../../../components/EmployeeModal';
import PrimaryActionButton from '../../../components/PrimaryActionButton';

export default function EmployeesPage({ embedded = false }: { embedded?: boolean }) {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data;
    },
  });

  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const res = await api.get('/areas');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    return employees.filter((employee: any) => {
      const matchesSearch =
        !term ||
        employee.name?.toLowerCase().includes(term) ||
        employee.email?.toLowerCase().includes(term) ||
        employee.code?.toLowerCase().includes(term) ||
        employee.boss?.name?.toLowerCase().includes(term);

      const matchesArea =
        !selectedArea || String(employee.areaId) === selectedArea;

      return matchesSearch && matchesArea;
    });
  }, [employees, search, selectedArea]);

  const handleCreate = () => {
    setEditingEmployee(null);
    setOpenModal(true);
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este empleado?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      {!embedded && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Empleados
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gestión del personal de la organización
            </p>
          </div>
        </div>
      )}


<div className="mb-6 flex justify-end">
  <PrimaryActionButton onClick={handleCreate} icon={<Plus size={18} />}>
    Nuevo empleado
  </PrimaryActionButton>
</div>

      <div className="mb-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, correo, código o jefe"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] pl-11 pr-4 py-3 outline-none text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
          >
            <option value="">Todas las áreas</option>
            {areas
              .filter((area: any) => !area.parentId)
              .map((area: any) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-gray-500 dark:text-gray-400">Cargando...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-6 text-gray-500 dark:text-gray-400">
            No hay empleados para mostrar.
          </div>
        ) : (
          <>
            <div className="hidden xl:block overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#10172a]">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subárea
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Jefe
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rol jerárquico
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee: any) => (
                    <tr
                      key={employee.id}
                      className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {employee.code || '-'}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {employee.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {employee.area?.name || '-'}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {employee.subArea?.name || '-'}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {employee.position?.name || 'Sin cargo'}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {employee.boss?.name || 'Sin jefe'}
                      </td>

                      <td className="px-6 py-4">
                        {employee.isAreaManager ? (
                          <span className="inline-flex rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 px-2.5 py-1 text-xs font-semibold">
                            Jefe de área
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 px-2.5 py-1 text-xs font-medium">
                            Colaborador
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-2 text-sm transition"
                          >
                            <Pencil size={15} />
                            Editar
                          </button>

                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-300 px-3 py-2 text-sm transition"
                          >
                            <Trash2 size={15} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 xl:hidden">
              {filteredEmployees.map((employee: any) => (
                <div
                  key={employee.id}
                  className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#10172a] p-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Código</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {employee.code || '-'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {employee.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Área</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {employee.area?.name || '-'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Subárea</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {employee.subArea?.name || '-'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cargo</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {employee.position?.name || 'Sin cargo'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Jefe</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {employee.boss?.name || 'Sin jefe'}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Rol jerárquico
                      </p>
                      {employee.isAreaManager ? (
                        <span className="inline-flex rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 px-2.5 py-1 text-xs font-semibold">
                          Jefe de área
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 px-2.5 py-1 text-xs font-medium">
                          Colaborador
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-2 text-sm transition"
                    >
                      <Pencil size={15} />
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-300 px-3 py-2 text-sm transition"
                    >
                      <Trash2 size={15} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {openModal && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => {
            setOpenModal(false);
            setEditingEmployee(null);
          }}
          onSuccess={() => {
            setOpenModal(false);
            setEditingEmployee(null);
            queryClient.invalidateQueries({ queryKey: ['employees'] });
          }}
        />
      )}
    </div>
  );
}