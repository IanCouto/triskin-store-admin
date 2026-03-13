import { api } from '@/lib/api';
import { getMockProducts, updateMockProduct } from '@/lib/mockProducts';
import type { Product, ProductUpdatePayload } from '@/types/product';

const USE_MOCK = !import.meta.env.VITE_API_URL;

export async function fetchProducts(): Promise<Product[]> {
  if (USE_MOCK) {
    return Promise.resolve(getMockProducts());
  }
  const data = await api.get<Product[]>('/produtos');
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
}

export async function updateProduct(id: string, payload: ProductUpdatePayload): Promise<Product> {
  if (USE_MOCK) {
    const updated = updateMockProduct(id, payload);
    if (!updated) throw new Error('Produto não encontrado');
    return updated;
  }
  const data = await api.patch<Product>(`/produtos/${id}`, payload);
  return normalizeProduct(data);
}

function normalizeProduct(p: Product): Product {
  return {
    ...p,
    ativo: p.ativo ?? true,
  };
}
