'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardCard from '../../../components/DashboardCard';
import { api } from '../../../services/api';

export default function DashboardPage() {
  const {
    data: summary,
    isLoading: loadingSummary,
    error: errorSummary,
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await api.get('/dashboard/summary');
      return res.data;
    },
  });

  const {
    data: topProducts,
    isLoading: loadingTopProducts,
  } = useQuery({
    queryKey: ['dashboard-top-products'],
    queryFn: async () => {
      const res = await api.get('/dashboard/top-products');
      return res.data;
    },
  });

  const {
    data: lowStock,
    isLoading: loadingLowStock,
  } = useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: async () => {
      const res = await api.get('/dashboard/low-stock');
      return res.data;
    },
  });

  const {
    data: recentInvoices,
    isLoading: loadingRecentInvoices,
  } = useQuery({
    queryKey: ['dashboard-recent-invoices'],
    queryFn: async () => {
      const res = await api.get('/dashboard/recent-invoices');
      return res.data;
    },
  });

  if (loadingSummary) {
    return (
      <div className="text-gray-700 dark:text-gray-300 text-lg">
        Cargando dashboard...
      </div>
    );
  }

  if (errorSummary) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
        No se pudo cargar el dashboard.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Resumen general del sistema TessOne
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <DashboardCard
          title="Ingresos del mes"
          value={`$${Number(summary?.monthlyRevenue || 0).toFixed(2)}`}
        />
        <DashboardCard
          title="Facturas registradas"
          value={summary?.totalInvoices || 0}
        />
        <DashboardCard
          title="Clientes registrados"
          value={summary?.totalClients || 0}
        />
        <DashboardCard
          title="Productos activos"
          value={summary?.totalProducts || 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Productos más vendidos
          </h2>

          {loadingTopProducts ? (
            <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
          ) : !topProducts || topProducts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product: any) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Vendidos: {product.totalSold}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    ${Number(product.totalRevenue).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Productos con stock bajo
          </h2>

          {loadingLowStock ? (
            <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
          ) : !lowStock || lowStock.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No hay productos con stock bajo.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Precio: ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Stock: {product.stock}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-5 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Últimas facturas
        </h2>

        {loadingRecentInvoices ? (
          <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
        ) : !recentInvoices || recentInvoices.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No hay facturas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-sm">
                  <th className="py-3">Código</th>
                  <th className="py-3">Cliente</th>
                  <th className="py-3">Empleado</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice: any) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-100 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <td className="py-3">{invoice.code}</td>
                    <td className="py-3">{invoice.client?.name}</td>
                    <td className="py-3">{invoice.employee?.name}</td>
                    <td className="py-3">{invoice.status?.name}</td>
                    <td className="py-3">${Number(invoice.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}