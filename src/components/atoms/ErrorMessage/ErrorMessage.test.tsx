import { render, screen } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the message', () => {
    render(<ErrorMessage message="Algo deu errado" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado');
  });

  it('has accessible role alert', () => {
    render(<ErrorMessage message="Erro" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
