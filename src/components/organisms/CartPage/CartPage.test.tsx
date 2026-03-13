import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import { CartPage } from './CartPage';

function renderCartPage() {
  return render(
    <BrowserRouter>
      <CartProvider>
        <CartPage />
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
});
