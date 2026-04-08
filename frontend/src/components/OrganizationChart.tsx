'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import dagre from '@dagrejs/dagre';
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps,
  Position,
  Handle,
  useReactFlow,
} from '@xyflow/react';
import { api } from '../services/api';
import { LocateFixed, Move, Users } from 'lucide-react';

type RootAreaData = {
  label: string;
  subtitle?: string;
  countLabel?: string;
  responsible?: {
    name: string;
    position?: string;
  } | null;
};

type SubAreaData = {
  label: string;
  workers: Array<{
    id: number | string;
    name: string;
    position?: string;
    isLeader?: boolean;
  }>;
};

const NODE_SIZES = {
  rootArea: { width: 260, height: 170 },
  subArea: { width: 250, height: 220 },
};

function PersonBadge({ name }: { name: string }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
      {initial}
    </div>
  );
}

function RootAreaNodeCard({ data }: NodeProps<Node<RootAreaData>>) {
  return (
    <div className="w-[260px] rounded-2xl border border-blue-200 dark:border-blue-500/20 bg-white dark:bg-[#151b2f] shadow-sm overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
      />

      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider opacity-90">
              Área principal
            </p>
            <h3 className="text-base font-bold leading-tight">{data.label}</h3>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider opacity-90">
              Subáreas
            </p>
            <p className="font-bold text-sm">{data.countLabel || '0'}</p>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {data.subtitle && (
          <span className="inline-flex rounded-full bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300 px-2.5 py-1 text-[10px] font-semibold">
            {data.subtitle}
          </span>
        )}

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Responsable
          </p>

          {data.responsible ? (
            <div className="flex items-start gap-2 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 px-3 py-3">
              <PersonBadge name={data.responsible.name} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {data.responsible.name}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 truncate">
                  {data.responsible.position || 'Sin cargo'}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
              No hay responsable asignado.
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
      />
    </div>
  );
}

function SubAreaNodeCard({ data }: NodeProps<Node<SubAreaData>>) {
  const workers = data.workers || [];

  return (
    <div className="w-[250px] rounded-2xl border border-green-200 dark:border-green-500/20 bg-white dark:bg-[#151b2f] shadow-sm overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white"
      />

      <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider opacity-90">
              Subárea
            </p>
            <h3 className="text-base font-bold leading-tight">{data.label}</h3>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider opacity-90">
              Trab.
            </p>
            <p className="font-bold text-sm">{workers.length}</p>
          </div>
        </div>
      </div>

      <div className="p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          Trabajadores
        </p>

        {workers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
            No hay trabajadores en esta subárea.
          </div>
        ) : (
          <div className="grid gap-2">
            {workers.map((employee) => (
              <div
                key={employee.id}
                className="flex items-start gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2"
              >
                <PersonBadge name={employee.name} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {employee.name}
                    </p>

                    {employee.isLeader && (
                      <span className="inline-flex rounded-full bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300 px-2 py-0.5 text-[10px] font-semibold">
                        Líder
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-purple-600 dark:text-purple-300 truncate">
                    {employee.position || 'Sin cargo'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  rootArea: RootAreaNodeCard,
  subArea: SubAreaNodeCard,
};

function runDagreLayout(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',
    ranksep: 120,
    nodesep: 80,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    const size =
      NODE_SIZES[node.type as keyof typeof NODE_SIZES] || NODE_SIZES.subArea;

    g.setNode(node.id, {
      width: size.width,
      height: size.height,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const laidOutNodes = nodes.map((node) => {
    const size =
      NODE_SIZES[node.type as keyof typeof NODE_SIZES] || NODE_SIZES.subArea;
    const pos = g.node(node.id);

    return {
      ...node,
      position: {
        x: pos.x - size.width / 2,
        y: pos.y - size.height / 2,
      },
    };
  });

  return { nodes: laidOutNodes, edges };
}

function ChartCanvas({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow();

  useEffect(() => {
    const t = setTimeout(() => {
      fitView({ padding: 0.25, duration: 350 });
    }, 80);
    return () => clearTimeout(t);
  }, [nodes, edges, fitView]);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => zoomOut({ duration: 200 })}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <Move size={16} />
          <span>Alejar</span>
        </button>

        <button
          onClick={() => zoomIn({ duration: 200 })}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <Users size={16} />
          <span>Acercar</span>
        </button>

        <button
          onClick={() => fitView({ padding: 0.25, duration: 250 })}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <LocateFixed size={16} />
          <span>Centrar</span>
        </button>

        <button
          onClick={() => {
            setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 250 });
            setTimeout(() => fitView({ padding: 0.25, duration: 250 }), 260);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <Move size={16} />
          <span>Reset</span>
        </button>
      </div>

      <div
        className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#10172a] w-full overflow-hidden"
        style={{ height: 580 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          minZoom={0.5}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
          }}
        >
          <Background gap={20} size={1} />
          <MiniMap pannable zoomable />
          <Controls showInteractive={false} />
          <Panel position="top-left">
            <div className="text-xs text-gray-500 bg-white/90 dark:bg-[#151b2f]/90 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2">
              Azul: áreas principales · Verde: subáreas
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

function InnerOrganizationChart() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['organization-chart-employees'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data;
    },
  });

  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const res = await api.get('/areas');
      return res.data;
    },
  });

  const areaTree = useMemo(() => {
    if (!areas || !employees) return [];

    const areaMap: Record<number, any> = {};

    areas.forEach((area: any) => {
      const areaEmployees = employees.filter(
        (employee: any) => employee.areaId === area.id,
      );
      const subAreaEmployees = employees.filter(
        (employee: any) => employee.subAreaId === area.id,
      );

      areaMap[area.id] = {
        ...area,
        children: [],
        employees: area.parentId
          ? subAreaEmployees
          : areaEmployees.filter((employee: any) => !employee.subAreaId),
      };
    });

    const roots: any[] = [];

    areas.forEach((area: any) => {
      if (area.parentId && areaMap[area.parentId]) {
        areaMap[area.parentId].children.push(areaMap[area.id]);
      } else {
        roots.push(areaMap[area.id]);
      }
    });

    const sortTree = (nodes: any[]) => {
      nodes.sort(
        (a, b) => (a.hierarchyOrder || 9999) - (b.hierarchyOrder || 9999),
      );
      nodes.forEach((node) => sortTree(node.children));
    };

    sortTree(roots);

    return roots;
  }, [areas, employees]);

  const flowData = useMemo(() => {
    const builtNodes: Node[] = [];
    const builtEdges: Edge[] = [];

    areaTree.forEach((root: any, index: number) => {
      const rootId = `area-root-${root.id}`;
      const responsible = root.employees?.find(
        (employee: any) => employee.isAreaManager,
      );

      builtNodes.push({
        id: rootId,
        type: 'rootArea',
        position: { x: 0, y: 0 },
        data: {
          label: root.name,
          subtitle: index === 0 ? 'Mayor rango' : undefined,
          countLabel: String(root.children?.length || 0),
          responsible: responsible
            ? {
                name: responsible.name,
                position: responsible.position?.name || 'Sin cargo',
              }
            : null,
        },
      });

      root.children?.forEach((child: any) => {
        const childId = `subarea-${child.id}`;

        builtNodes.push({
          id: childId,
          type: 'subArea',
          position: { x: 0, y: 0 },
          data: {
            label: child.name,
            workers: (child.employees || []).map((employee: any) => ({
              id: employee.id,
              name: employee.name,
              position: employee.position?.name || 'Sin cargo',
              isLeader: !!employee.isAreaManager,
            })),
          },
        });

        builtEdges.push({
          id: `edge-${rootId}-${childId}`,
          source: rootId,
          target: childId,
          type: 'smoothstep',
          style: {
            stroke: '#22c55e',
            strokeWidth: 3,
          },
        });
      });
    });

    for (let i = 0; i < areaTree.length - 1; i += 1) {
      const currentId = `area-root-${areaTree[i].id}`;
      const nextId = `area-root-${areaTree[i + 1].id}`;

      builtEdges.push({
        id: `rank-${currentId}-${nextId}`,
        source: currentId,
        target: nextId,
        type: 'smoothstep',
        style: {
          stroke: '#3b82f6',
          strokeWidth: 3,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#3b82f6',
        },
      });
    }

    return runDagreLayout(builtNodes, builtEdges);
  }, [areaTree]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] p-8 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">Cargando organigrama...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Organigrama visual
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visualiza el árbol jerárquico real de áreas y subáreas.
          </p>
        </div>
      </div>

      {flowData.nodes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-white dark:bg-[#151b2f] p-10 text-center text-gray-500 dark:text-gray-400">
          No hay datos suficientes para mostrar el organigrama.
        </div>
      ) : (
        <ChartCanvas nodes={flowData.nodes} edges={flowData.edges} />
      )}
    </div>
  );
}

export default function OrganizationChart() {
  return (
    <ReactFlowProvider>
      <InnerOrganizationChart />
    </ReactFlowProvider>
  );
}