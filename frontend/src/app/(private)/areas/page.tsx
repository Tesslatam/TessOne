'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';
import SimpleCatalogTable from '../../../components/SimpleCatalogTable';
import SimpleCatalogModal from '../../../components/SimpleCatalogModal';
import AreaChildrenModal from '../../../components/AreaChildrenModal';
     import PrimaryActionButton from '../../../components/PrimaryActionButton';
import { Plus } from 'lucide-react';

export default function AreasPage({ embedded = false }: { embedded?: boolean }) {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedAreaForChildren, setSelectedAreaForChildren] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const res = await api.get('/areas');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/areas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['areas-tree'] });
    },
  });

  const orderedAreas = useMemo(() => {
    if (!data) return [];

    const principalAreas = data
      .filter((item: any) => !item.parentId)
      .sort((a: any, b: any) => (a.hierarchyOrder || 9999) - (b.hierarchyOrder || 9999));

    const subareas = data
      .filter((item: any) => !!item.parentId)
      .sort((a: any, b: any) => {
        if ((a.parent?.name || '') !== (b.parent?.name || '')) {
          return (a.parent?.name || '').localeCompare(b.parent?.name || '');
        }
        return a.name.localeCompare(b.name);
      });

    return [...principalAreas, ...subareas];
  }, [data]);

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Áreas</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gestión de áreas o departamentos
            </p>
          </div>
        </div>
      )}



<div className="mb-5 flex justify-end">
  <PrimaryActionButton onClick={handleCreate} icon={<Plus size={18} />}>
    Nueva área
  </PrimaryActionButton>
</div>

      <SimpleCatalogTable
        items={orderedAreas}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => {
          if (window.confirm('¿Seguro que deseas eliminar esta área?')) {
            deleteMutation.mutate(id);
          }
        }}
        onClickName={(item) => setSelectedAreaForChildren(item)}
        showAreaHierarchyInfo
      />

      {openModal && (
        <SimpleCatalogModal
          title="área"
          item={editingItem}
          endpoint="/areas"
          api={api}
          onClose={() => {
            setOpenModal(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setOpenModal(false);
            setEditingItem(null);
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            queryClient.invalidateQueries({ queryKey: ['areas-tree'] });
          }}
        />
      )}

      {selectedAreaForChildren && (
        <AreaChildrenModal
          area={selectedAreaForChildren}
          onClose={() => setSelectedAreaForChildren(null)}
        />
      )}
    </div>
  );
}