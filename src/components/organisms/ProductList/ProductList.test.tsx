import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { CartProvider } from '@/contexts/CartContext';
import { ProductList } from './ProductList';
import type { Product } from '@/types/product';

function renderWithCart(ui: ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

const products: Product[] = [
  {
    id: '1',
    descricao: 'Produto A',
    codigo: 'PA',
    valorUnitario: 10,
    unidade: 'UN',
    ncm: null,
    cst: null,
    cfop: null,
    ativo: true,
  },
  {
    id: '2',
    descricao: 'Produto B',
    codigo: 'PB',
    valorUnitario: 20,
    unidade: 'UN',
    ncm: null,
    cst: null,
    cfop: null,
    ativo: false,
  },
];

describe('ProductList', () => {
  it('shows loading state', () => {
    renderWithCart(<ProductList products={[]} loading />);
    expect(screen.getByRole('status', { name: /carregando produtos/i })).toBeInTheDocument();
  });

  it('shows error message', () => {
    renderWithCart(<ProductList products={[]} error="Falha ao carregar" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao carregar');
  });

  it('renders product list', () => {
    renderWithCart(<ProductList products={products} />);
    expect(screen.getByTestId('product-list')).toBeInTheDocument();
    expect(screen.getByText('Produto A')).toBeInTheDocument();
    expect(screen.getByText('Produto B')).toBeInTheDocument();
  });

  it('filters by search query', () => {
    renderWithCart(<ProductList products={products} searchQuery="B" />);
    expect(screen.getByText('Produto B')).toBeInTheDocument();
    expect(screen.queryByText('Produto A')).not.toBeInTheDocument();
  });

  it('shows empty state when no products', () => {
    renderWithCart(<ProductList products={[]} />);
    expect(screen.getByText(/nenhum produto cadastrado/i)).toBeInTheDocument();
  });
});
