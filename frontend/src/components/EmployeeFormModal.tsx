'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface EmployeeFormModalProps {
  employee?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmployeeFormModal({
  employee,
  onClose,
  onSuccess,
}: EmployeeFormModalProps) {
  const isEditing = !!employee;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    areaId: '',
    subAreaId: '',
    positionId: '',
    managerId: '',
    isAreaManager: false,
  });

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        areaId: employee.areaId ? String(employee.areaId) : '',
        subAreaId: employee.subAreaId ? String(employee.subAreaId) : '',
        positionId: employee.positionId ? String(employee.positionId) : '',
        managerId: employee.managerId ? String(employee.managerId) : '',
        isAreaManager: !!employee.isAreaManager,
      });
    }
  }, [employee]);

  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const res = await api.get('/areas');
      return res.data;
    },
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const res = await api.get('/positions');
      return res.data;
    },
  });

  const { data: employees } = useQuery({
    queryKey: ['employees-for-manager-select'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data;
    },
  });

  const principalAreas = useMemo(() => {
    return (areas || []).filter((area: any) => !area.parentId);
  }, [areas]);

  const subAreas = useMemo(() => {
    if (!form.areaId) return [];
    return (areas || []).filter(
      (area: any) => area.parentId === Number(form.areaId),
    );
  }, [areas, form.areaId]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        areaId: Number(form.areaId),
        subAreaId: form.subAreaId ? Number(form.subAreaId) : null,
        positionId: Number(form.positionId),
        managerId: form.managerId ? Number(form.managerId) : null,
        isAreaManager: form.isAreaManager,
      };

      if (isEditing) {
        await api.put(`/employees/${employee.id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  const availableManagers =
    employees?.filter((emp: any) => {
      if (isEditing && emp.id === employee.id) return false;
      return true;
    }) || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (name === 'areaId') {
      setForm((prev) => ({
        ...prev,
        areaId: value,
        subAreaId: '',
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Editar empleado' : 'Nuevo empleado'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
              Nombre
            </label>
            <input
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
              Correo
            </label>
            <input
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
              Teléfono
            </label>
            <input
              name="phone"
              placeholder="Teléfono"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
              Área
            </label>
            <select
              name="areaId"
              value={form.areaId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
            >
              <option value="">Selecciona un área</option>
              {principalAreas.map((area: any) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
              Subárea
            </label>
            <select
              name="subAreaId"
              value={form.subAreaId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
              disabled={!form.areaId}
            >
              <option value="">Sin subárea</option>
              {subAreas.map((subArea: any) => (
                <option key={subArea.id} value={subArea.id}>
                  {subArea.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
              Cargo
            </label>
            <select
              name="positionId"
              value={form.positionId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
            >
              <option value="">Selecciona un cargo</option>
              {positions?.map((position: any) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
              Jefe directo
            </label>
            <select
              name="managerId"
              value={form.managerId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none text-gray-900 dark:text-white"
            >
              <option value="">Sin jefe</option>
              {availableManagers.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} {emp.position?.name ? `- ${emp.position.name}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="inline-flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="isAreaManager"
              checked={form.isAreaManager}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Es jefe de área
          </label>
        </div>

        {mutation.isError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
            No se pudo guardar el empleado. Revisa el jefe de área, jefe seleccionado o subárea.
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
              : 'Crear empleado'}
          </button>
        </div>
      </div>
    </div>
  );
}