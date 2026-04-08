'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { api } from '../services/api';

interface EmployeeModalProps {
  employee?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmployeeModal({
  employee,
  onClose,
  onSuccess,
}: EmployeeModalProps) {
  const isEditing = !!employee;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    areaId: '',
    subAreaId: '',
    positionId: '',
    bossId: '',
    isAreaManager: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const res = await api.get('/areas');
      return res.data;
    },
  });

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const res = await api.get('/positions');
      return res.data;
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data;
    },
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        areaId: employee.areaId ? String(employee.areaId) : '',
        subAreaId: employee.subAreaId ? String(employee.subAreaId) : '',
        positionId: employee.positionId ? String(employee.positionId) : '',
        bossId: employee.bossId ? String(employee.bossId) : '',
        isAreaManager: !!employee.isAreaManager,
      });
    }
  }, [employee]);

  const principalAreas = areas.filter((area: any) => !area.parentId);
  const subAreas = areas.filter(
    (area: any) => String(area.parentId) === String(formData.areaId),
  );

  const possibleBosses = employees.filter((item: any) => {
    if (employee && item.id === employee.id) return false;
    if (!formData.areaId) return true;
    return String(item.areaId) === String(formData.areaId);
  });

  const handleChange = (
    field: string,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === 'areaId') {
        next.subAreaId = '';
        next.bossId = '';
      }

      return next;
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.name.trim()) {
        setError('El nombre es obligatorio');
        return;
      }

      if (!formData.areaId) {
        setError('Debes seleccionar un área');
        return;
      }

      if (!formData.positionId) {
        setError('Debes seleccionar un cargo');
        return;
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        areaId: Number(formData.areaId),
        subAreaId: formData.subAreaId ? Number(formData.subAreaId) : null,
        positionId: Number(formData.positionId),
        bossId: formData.bossId ? Number(formData.bossId) : null,
        isAreaManager: formData.isAreaManager,
      };

      if (isEditing) {
        await api.put(`/employees/${employee.id}`, payload);
      } else {
        await api.post('/employees', payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'No se pudo guardar el empleado',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar empleado' : 'Nuevo empleado'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Completa la información del empleado
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none"
              placeholder="Nombre del empleado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Correo
            </label>
            <input
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none"
              placeholder="correo@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Teléfono
            </label>
            <input
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none"
              placeholder="0999999999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Área
            </label>
            <select
              value={formData.areaId}
              onChange={(e) => handleChange('areaId', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none"
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
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Subárea
            </label>
            <select
              value={formData.subAreaId}
              onChange={(e) => handleChange('subAreaId', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none"
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
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Cargo
            </label>
            <select
              value={formData.positionId}
              onChange={(e) => handleChange('positionId', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none"
            >
              <option value="">Selecciona un cargo</option>
              {positions.map((position: any) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Jefe
            </label>
            <select
              value={formData.bossId}
              onChange={(e) => handleChange('bossId', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#10172a] px-4 py-3 outline-none"
            >
              <option value="">Sin jefe</option>
              {possibleBosses.map((boss: any) => (
                <option key={boss.id} value={boss.id}>
                  {boss.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAreaManager}
                onChange={(e) =>
                  handleChange('isAreaManager', e.target.checked)
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Marcar como jefe de área
              </span>
            </label>
          </div>

          {error && (
            <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium transition disabled:opacity-60"
          >
            {loading
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