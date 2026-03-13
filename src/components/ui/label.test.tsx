import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  it('renders label with text and associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="test-id">Nome do campo</Label>
        <input id="test-id" />
      </>
    );
    const label = screen.getByText('Nome do campo');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-id');
  });
});
