import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

describe('Loader', () => {
  it('renders with default size', () => {
    render(<Loader />);
    const loader = screen.getByRole('status', { name: /carregando/i });
    expect(loader).toBeInTheDocument();
  });

  it('applies size class when size is sm', () => {
    render(<Loader size="sm" />);
    const loader = screen.getByRole('status', { name: /carregando/i });
    expect(loader).toHaveClass('h-5', 'w-5');
  });

  it('applies size class when size is lg', () => {
    render(<Loader size="lg" />);
    const loader = screen.getByRole('status', { name: /carregando/i });
    expect(loader).toHaveClass('h-12', 'w-12');
  });
});
