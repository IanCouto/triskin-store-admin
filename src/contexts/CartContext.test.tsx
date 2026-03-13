import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import type { Product } from '@/types/product';

const mockProduct: Product = {
  id: '1',
  descricao: 'Produto Teste',
  codigo: 'PT001',
  valorUnitario: 10,
  unidade: 'UN',
  ncm: null,
  cst: null,
  cfop: null,
  ativo: true,
};

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext', () => {
  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalValue).toBe(0);
  });

  it('addItem adds product and increments quantity if same product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalValue).toBe(10);

    act(() => {
      result.current.addItem(mockProduct, 2);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
  });

  it('removeItem removes product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.removeItem(mockProduct.id));
    expect(result.current.items).toHaveLength(0);
  });

  it('updateQuantity updates and removes when 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(mockProduct, 2));
    act(() => result.current.updateQuantity(mockProduct.id, 5));
    expect(result.current.items[0].quantity).toBe(5);
    act(() => result.current.updateQuantity(mockProduct.id, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it('clearCart empties cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
  });
});
