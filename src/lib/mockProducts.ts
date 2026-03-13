import type { Product } from '@/types/product';

/**
 * Mock products for when backend is not available (e.g. VITE_API_URL not set).
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    descricao: 'Produto A - Exemplo',
    codigo: 'PA001',
    valorUnitario: 10.5,
    unidade: 'UN',
    ncm: '12345678',
    cst: '00',
    cfop: '5102',
    ativo: true,
  },
  {
    id: 'mock-2',
    descricao: 'Produto B - Exemplo',
    codigo: 'PB002',
    valorUnitario: 25.0,
    unidade: 'UN',
    ncm: '87654321',
    cst: '00',
    cfop: '5102',
    ativo: true,
  },
  {
    id: 'mock-3',
    descricao: 'Produto C - Inativo',
    codigo: 'PC003',
    valorUnitario: 100.0,
    unidade: 'PC',
    ncm: '11111111',
    cst: '00',
    cfop: '5102',
    ativo: false,
  },
];

let mockStore = [...MOCK_PRODUCTS];

export function getMockProducts(): Product[] {
  return [...mockStore];
}

export function updateMockProduct(id: string, payload: Partial<Product>): Product | null {
  const index = mockStore.findIndex((p) => p.id === id);
  if (index === -1) return null;
  mockStore[index] = { ...mockStore[index], ...payload };
  return mockStore[index];
}
