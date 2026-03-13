import { describe, it, expect } from 'vitest';
import { getMockProducts, updateMockProduct, MOCK_PRODUCTS } from './mockProducts';

describe('mockProducts', () => {
  it('getMockProducts returns array of products', () => {
    const products = getMockProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(MOCK_PRODUCTS.length);
  });

  it('updateMockProduct returns null when id not found', () => {
    expect(updateMockProduct('id-inexistente', { descricao: 'X' })).toBeNull();
  });

  it('updateMockProduct updates and returns product when found', () => {
    const first = getMockProducts()[0];
    const updated = updateMockProduct(first.id, { descricao: 'Atualizado' });
    expect(updated).not.toBeNull();
    expect(updated!.descricao).toBe('Atualizado');
  });
});
