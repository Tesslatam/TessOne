'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';
import SimpleCatalogTable from '../../../components/SimpleCatalogTable';
import SimpleCatalogModal from '../../../components/SimpleCatalogModal';
import PrimaryActionButton from '../../../components/PrimaryActionButton';
import { Plus } from 'lucide-react';

export default function PositionsPage({ embedded = false }: { embedded?: boolean }) {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const res = await api.get('/positions');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/positions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });

  const handleCreate = () => {
    setEditingItem(null);
    setOpenModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setOpenModal(true);
  };

  return (
    <div>
      {!embedded && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cargos</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gestión de cargos de la organización
            </p>
          </div>
        </div>
      )}


<div className="mb-5 flex justify-end">
  <PrimaryActionButton onClick={handleCreate} icon={<Plus size={18} />}>
    Nuevo cargo
  </PrimaryActionButton>
</div>

      <SimpleCatalogTable
        items={data || []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => {
          if (window.confirm('¿Seguro que deseas eliminar este cargo?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      {openModal && (
        <SimpleCatalogModal
          title="cargo"
          item={editingItem}
          endpoint="/positions"
          api={api}
          onClose={() => {
            setOpenModal(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setOpenModal(false);
            setEditingItem(null);
            queryClient.invalidateQueries({ queryKey: ['positions'] });
          }}
        />
      )}
    </div>
  );
}