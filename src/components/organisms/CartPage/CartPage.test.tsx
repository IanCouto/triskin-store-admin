import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { CartPage } from './CartPage';
import type { Product } from '@/types/product';

const mockProduct: Product = {
  id: 'p1',
  descricao: 'Produto Teste',
  codigo: 'COD1',
  valorUnitario: 10,
  unidade: 'UN',
  ncm: null,
  cst: null,
  cfop: null,
  ativo: true,
};

function renderCartPage() {
  return render(
    <BrowserRouter>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </BrowserRouter>
  );
}

function CartPageWithItem({ product, quantity }: { product: Product; quantity: number }) {
  const { addItem } = useCart();
  useEffect(() => {
    addItem(product, quantity);
  }, [addItem, product, quantity]);
  return <CartPage />;
}

function renderCartPageWithItem(product = mockProduct, quantity = 2) {
  return render(
    <BrowserRouter>
      <CartProvider>
        <CartPageWithItem product={product} quantity={quantity} />
      </CartProvider>
    </BrowserRouter>
  );
}

describe('CartPage', () => {
  it('shows empty state when cart is empty', () => {
    renderCartPage();
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(screen.getByText(/carrinho vazio/i)).toBeInTheDocument();
  });

  it('shows cart with items when cart has products', () => {
    renderCartPageWithItem();
    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    expect(screen.getByText('Meu carrinho')).toBeInTheDocument();
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByTestId('cart-page')).toHaveTextContent('2 itens');
    const quantityInput = screen.getByTestId('cart-item-quantity');
    expect(quantityInput).toHaveValue(2);
    expect(screen.getByTestId('cart-total')).toHaveTextContent('R$ 20,00');
  });

  it('updates quantity when typing in input and blur', async () => {
    renderCartPageWithItem();
    const quantityInput = screen.getByTestId('cart-item-quantity');
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '5');
    fireEvent.blur(quantityInput);
    expect(quantityInput).toHaveValue(5);
    expect(screen.getByTestId('cart-total')).toHaveTextContent('R$ 50,00');
  });

  it('decreases quantity with minus button', async () => {
    renderCartPageWithItem(undefined, 3);
    const minusButton = screen.getByLabelText(/diminuir quantidade/i);
    await userEvent.click(minusButton);
    expect(screen.getByTestId('cart-item-quantity')).toHaveValue(2);
  });

  it('increases quantity with plus button', async () => {
    renderCartPageWithItem(undefined, 1);
    const plusButton = screen.getByLabelText(/aumentar quantidade/i);
    await userEvent.click(plusButton);
    expect(screen.getByTestId('cart-item-quantity')).toHaveValue(2);
  });

  it('removes item when clicking remove', async () => {
    renderCartPageWithItem();
    const removeButton = screen.getByLabelText(/remover do carrinho/i);
    await userEvent.click(removeButton);
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  it('shows singular "item" when quantity is 1', () => {
    renderCartPageWithItem(undefined, 1);
    expect(screen.getByTestId('cart-page')).toHaveTextContent('1 item');
  });
});
