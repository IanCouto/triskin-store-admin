import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { TestRouter } from '@/test/test-utils';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { CartIcon } from './CartIcon';
import type { Product } from '@/types/product';

const mockProduct: Product = {
  id: 'p1',
  descricao: 'Produto',
  codigo: null,
  valorUnitario: 10,
  unidade: 'UN',
  ncm: null,
  cst: null,
  cfop: null,
  ativo: true,
};

function CartIconWithItem({ product, quantity }: { product: Product; quantity: number }) {
  const { addItem } = useCart();
  useEffect(() => {
    addItem(product, quantity);
  }, [addItem, product, quantity]);
  return <CartIcon />;
}

function renderCartIcon() {
  return render(
    <TestRouter>
      <CartProvider>
        <CartIcon />
      </CartProvider>
    </TestRouter>
  );
}

function renderCartIconWithItems(product = mockProduct, quantity = 2) {
  return render(
    <TestRouter>
      <CartProvider>
        <CartIconWithItem product={product} quantity={quantity} />
      </CartProvider>
    </TestRouter>
  );
}

describe('CartIcon', () => {
  it('shows link to cart without badge when empty', () => {
    renderCartIcon();
    expect(screen.getByRole('link', { name: /carrinho com 0 itens/i })).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows badge with item count when cart has items', () => {
    renderCartIconWithItems(undefined, 3);
    expect(screen.getByRole('link', { name: /carrinho com 3 itens/i })).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows 99+ in badge when more than 99 items', () => {
    renderCartIconWithItems(undefined, 100);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});
