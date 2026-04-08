'use client';

import { useState } from 'react';
import AreasPage from '../areas/page';
import PositionsPage from '../positions/page';
import EmployeesPage from '../employees/page';
import OrganizationChart from '../../../components/OrganizationChart';
import AreaView from '../../../components/AreaView';
import AreaHierarchyConfig from '../../../components/AreaHierarchyConfig';
import PrimaryActionButton from '../../../components/PrimaryActionButton';
import { Settings2 } from 'lucide-react';

export default function OrganizationPage() {
  const [tab, setTab] = useState<
    'employees' | 'areas' | 'positions' | 'area_view' | 'chart'
  >('employees');
  const [openHierarchyConfig, setOpenHierarchyConfig] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Organización
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona la estructura organizacional de la empresa
          </p>
        </div>

        {tab === 'chart' && (
          <PrimaryActionButton
            onClick={() => setOpenHierarchyConfig(true)}
            icon={<Settings2 size={18} />}
          >
            Configurar jerarquía
          </PrimaryActionButton>
        )}
      </div>

      <div className="mb-6 inline-flex flex-wrap rounded-2xl bg-white dark:bg-[#151b2f] border border-gray-200 dark:border-white/10 p-1 shadow-sm gap-1">
        <button
          onClick={() => setTab('employees')}
          className={`px-5 py-2.5 rounded-xl font-medium transition ${
            tab === 'employees'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          Empleados
        </button>

        <button
          onClick={() => setTab('areas')}
          className={`px-5 py-2.5 rounded-xl font-medium transition ${
            tab === 'areas'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          Áreas
        </button>

        <button
          onClick={() => setTab('positions')}
          className={`px-5 py-2.5 rounded-xl font-medium transition ${
            tab === 'positions'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          Cargos
        </button>

        <button
          onClick={() => setTab('area_view')}
          className={`px-5 py-2.5 rounded-xl font-medium transition ${
            tab === 'area_view'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          Vista de área
        </button>

        <button
          onClick={() => setTab('chart')}
          className={`px-5 py-2.5 rounded-xl font-medium transition ${
            tab === 'chart'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          Organigrama
        </button>
      </div>

      <div>
        {tab === 'employees' && <EmployeesPage embedded />}
        {tab === 'areas' && <AreasPage embedded />}
        {tab === 'positions' && <PositionsPage embedded />}
        {tab === 'area_view' && <AreaView />}
        {tab === 'chart' && <OrganizationChart />}
      </div>

      {openHierarchyConfig && (
        <AreaHierarchyConfig onClose={() => setOpenHierarchyConfig(false)} />
      )}
    </div>
  );
}