import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { CartProvider } from '@/contexts/CartContext';
import { ProductItem } from './ProductItem';
import type { Product } from '@/types/product';

const product: Product = {
  id: '1',
  descricao: 'Produto Teste',
  codigo: 'PT',
  valorUnitario: 15.5,
  unidade: 'UN',
  ncm: null,
  cst: null,
  cfop: null,
  ativo: true,
};

function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe('ProductItem', () => {
  it('renders product name, price and status', () => {
    renderWithCart(<ProductItem product={product} />);
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*15,50/)).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('shows Inativo when ativo is false', () => {
    renderWithCart(<ProductItem product={{ ...product, ativo: false }} />);
    expect(screen.getByText('Inativo')).toBeInTheDocument();
  });

  it('calls onEdit when Editar is clicked', async () => {
    const onEdit = vi.fn();
    renderWithCart(<ProductItem product={product} onEdit={onEdit} />);
    await userEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(product);
  });

  it('has Add to Cart button', () => {
    renderWithCart(<ProductItem product={product} />);
    expect(screen.getByTestId('add-to-cart')).toHaveTextContent('Adicionar ao Carrinho');
  });

  it('adds to cart and shows loading state while adding', async () => {
    renderWithCart(<ProductItem product={product} />);
    const addBtn = screen.getByTestId('add-to-cart');
    await userEvent.click(addBtn);
    expect(addBtn).toBeDisabled();
    await waitFor(() => {
      expect(addBtn).not.toBeDisabled();
    }, { timeout: 1000 });
    expect(addBtn).toHaveTextContent('Adicionar ao Carrinho');
  });

  it('disables Add to Cart when product is inactive', () => {
    renderWithCart(<ProductItem product={{ ...product, ativo: false }} />);
    expect(screen.getByTestId('add-to-cart')).toBeDisabled();
  });
});
