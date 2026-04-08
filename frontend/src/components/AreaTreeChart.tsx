'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Building2, Users } from 'lucide-react';

function AreaTreeNode({ node }: { node: any }) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center relative">
      <div className="min-w-[200px] rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-4 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-300 mb-2">
          <Building2 size={16} />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Área
          </span>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white">{node.name}</h3>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 px-3 py-1 text-xs font-semibold">
          <Users size={13} />
          <span>{node.employees?.length || 0} trabajadores</span>
        </div>
      </div>

      {hasChildren && (
        <div className="flex flex-col items-center w-full">
          <div className="w-px h-8 bg-gray-300 dark:bg-white/10" />

          <div className="relative w-full flex justify-center">
            <div
              className="absolute top-0 h-px bg-gray-300 dark:bg-white/10"
              style={{
                width: `${Math.max((node.children.length - 1) * 260, 0)}px`,
              }}
            />

            <div className="flex justify-center gap-16 pt-8">
              {node.children.map((child: any) => (
                <div key={child.id} className="flex flex-col items-center relative">
                  <div className="absolute top-0 -translate-y-8 w-px h-8 bg-gray-300 dark:bg-white/10" />
                  <AreaTreeNode node={child} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AreaTreeChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['areas-tree'],
    queryFn: async () => {
      const res = await api.get('/areas/tree');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] p-8 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">Cargando árbol de áreas...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-white dark:bg-[#151b2f] p-10 text-center text-gray-500 dark:text-gray-400">
        No hay áreas configuradas para mostrar el árbol.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-8 overflow-x-auto">
      <div className="min-w-max flex flex-col items-center gap-16">
        {data.map((root: any) => (
          <AreaTreeNode key={root.id} node={root} />
        ))}
      </div>
    </div>
  );
}
