import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/contexts/CartContext';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

function renderApp() {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('App', () => {
  it('renders header with app title', () => {
    renderApp();
    expect(screen.getByText('Triskin Store Admin')).toBeInTheDocument();
  });

  it('renders products heading on home', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: /produtos/i })).toBeInTheDocument();
  });
});
