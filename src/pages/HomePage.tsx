import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, updateProduct } from '@/services/productsService';
import type { Product } from '@/types/product';
import { ProductList } from '@/components/organisms/ProductList';
import { EditProductModal } from '@/components/organisms/EditProductModal';
import { SearchInput } from '@/components/molecules/SearchInput';

export function HomePage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(async (id: string, payload: Parameters<typeof updateProduct>[1]) => {
    return updateProduct(id, payload);
  }, []);

  const handleSaved = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setEditingProduct(null);
    setModalOpen(false);
  }, [queryClient]);

  return (
    <main className="container mx-auto space-y-6 px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <SearchInput
          onSearch={setSearchQuery}
          placeholder="Buscar por nome do produto..."
        />
      </div>
      <ProductList
        products={products}
        loading={isLoading}
        error={error instanceof Error ? error.message : null}
        searchQuery={searchQuery}
        onEditProduct={handleEdit}
      />
      <EditProductModal
        product={editingProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        onSaved={handleSaved}
      />
    </main>
  );
}
