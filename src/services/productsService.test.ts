import { describe, it, expect } from 'vitest';
import { fetchProducts, updateProduct } from './productsService';

describe('productsService', () => {
  it('fetchProducts returns mock products when VITE_API_URL is not set', async () => {
    const products = await fetchProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('descricao');
    expect(products[0]).toHaveProperty('valorUnitario');
    expect(products[0].ativo ?? true).toBe(true);
  });

  it('updateProduct updates mock product and returns it', async () => {
    const products = await fetchProducts();
    const first = products[0];
    const updated = await updateProduct(first.id, { descricao: 'Novo nome' });
    expect(updated.descricao).toBe('Novo nome');
    expect(updated.id).toBe(first.id);
  });

  it('updateProduct throws when product id not found', async () => {
    await expect(updateProduct('id-inexistente', { descricao: 'X' })).rejects.toThrow(
      'Produto não encontrado'
    );
  });
});
