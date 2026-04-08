'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Building2, Briefcase, Users, UserRound } from 'lucide-react';

export default function AreaView() {
  const [selectedArea, setSelectedArea] = useState('');

  const { data: employees = [], isLoading: loadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data;
    },
  });

  const { data: areas = [], isLoading: loadingAreas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const res = await api.get('/areas');
      return res.data;
    },
  });

  const principalAreas = useMemo(
    () => areas.filter((area: any) => !area.parentId),
    [areas],
  );

  const selectedAreaData = useMemo(
    () => areas.find((area: any) => String(area.id) === selectedArea),
    [areas, selectedArea],
  );

  const areaEmployees = useMemo(() => {
    if (!selectedArea) return [];
    return employees.filter((employee: any) => String(employee.areaId) === selectedArea);
  }, [employees, selectedArea]);

  const subAreas = useMemo(() => {
    if (!selectedArea) return [];
    return areas.filter((area: any) => String(area.parentId) === selectedArea);
  }, [areas, selectedArea]);

  const responsible = useMemo(() => {
    return (
      areaEmployees.find(
        (employee: any) => employee.isAreaManager && !employee.subAreaId,
      ) || null
    );
  }, [areaEmployees]);

  const totalLeaders = useMemo(() => {
    return areaEmployees.filter((employee: any) => employee.isAreaManager).length;
  }, [areaEmployees]);

  const getSubAreaEmployees = (subAreaId: number) => {
    return employees.filter((employee: any) => employee.subAreaId === subAreaId);
  };

  if (loadingEmployees || loadingAreas) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] p-8 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">Cargando vista de área...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vista de área
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Consulta el detalle operativo de una sola área.
          </p>
        </div>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
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

      {!selectedArea && (
        <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-white dark:bg-[#151b2f] p-10 text-center text-gray-500 dark:text-gray-400">
          Selecciona un área para ver su detalle.
        </div>
      )}

      {selectedArea && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-blue-600 text-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Building2 size={20} />
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-90">Área</p>
                  <p className="font-bold text-lg">
                    {selectedAreaData?.name || 'No disponible'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-purple-600 text-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <UserRound size={20} />
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-90">
                    Responsable
                  </p>
                  <p className="font-bold text-lg">
                    {responsible?.name || 'No asignado'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-green-600 text-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Users size={20} />
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-90">
                    Empleados
                  </p>
                  <p className="font-bold text-lg">{areaEmployees.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-orange-600 text-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Briefcase size={20} />
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-90">
                    Subáreas / Líderes
                  </p>
                  <p className="font-bold text-lg">
                    {subAreas.length} / {totalLeaders}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Subáreas
            </h3>

            {subAreas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-6 text-center text-gray-500 dark:text-gray-400">
                Esta área no tiene subáreas registradas.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {subAreas.map((subArea: any) => {
                  const employeesInSubArea = getSubAreaEmployees(subArea.id);
                  const leader =
                    employeesInSubArea.find((employee: any) => employee.isAreaManager) ||
                    null;

                  return (
                    <div
                      key={subArea.id}
                      className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#10172a] p-5"
                    >
                      <div className="mb-3">
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Subárea
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                          {subArea.name}
                        </h4>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Líder:</span>{' '}
                          {leader?.name || 'No asignado'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Empleados:</span>{' '}
                          {employeesInSubArea.length}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Equipo del área
            </h3>

            <div className="overflow-auto rounded-2xl border border-gray-200 dark:border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-[#10172a]">
                  <tr>
                    <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                      Nombre
                    </th>
                    <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                      Cargo
                    </th>
                    <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                      Subárea
                    </th>
                    <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                      Rol
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {areaEmployees.map((employee: any) => {
                    const subArea = areas.find(
                      (area: any) => area.id === employee.subAreaId,
                    );

                    return (
                      <tr
                        key={employee.id}
                        className="border-t border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <td className="p-3 text-gray-900 dark:text-white">
                          {employee.name}
                        </td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">
                          {employee.position?.name || 'Sin cargo'}
                        </td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">
                          {subArea?.name || '-'}
                        </td>
                        <td className="p-3">
                          {employee.isAreaManager ? (
                            <span className="inline-flex rounded-full bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300 px-2.5 py-1 text-xs font-semibold">
                              Líder
                            </span>
                          ) : (
                            <span className="text-gray-700 dark:text-gray-300">
                              Empleado
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {areaEmployees.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-6 text-center text-gray-500 dark:text-gray-400"
                      >
                        No hay empleados en esta área.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}