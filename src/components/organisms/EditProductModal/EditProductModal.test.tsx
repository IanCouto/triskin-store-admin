import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { EditProductModal } from './EditProductModal';
import type { Product } from '@/types/product';

const mockProduct: Product = {
  id: 'p1',
  descricao: 'Produto Original',
  codigo: 'COD1',
  valorUnitario: 15,
  unidade: 'UN',
  ncm: null,
  cst: null,
  cfop: null,
  ativo: true,
};

describe('EditProductModal', () => {
  it('returns null when product is null', () => {
    const { container } = render(
      <EditProductModal
        product={null}
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog with product data when open', () => {
    render(
      <EditProductModal
        product={mockProduct}
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog', { name: /editar produto/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('Produto Original');
    expect(screen.getByLabelText(/código/i)).toHaveValue('COD1');
    expect(screen.getByLabelText(/valor unitário/i)).toHaveValue(15);
  });

  it('calls onSave and onSaved on submit', async () => {
    const onSave = vi.fn().mockResolvedValue({ ...mockProduct, descricao: 'Atualizado' });
    const onSaved = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <EditProductModal
        product={mockProduct}
        open={true}
        onOpenChange={onOpenChange}
        onSave={onSave}
        onSaved={onSaved}
      />
    );
    await userEvent.clear(screen.getByLabelText(/descrição/i));
    await userEvent.type(screen.getByLabelText(/descrição/i), 'Novo Nome');
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(onSave).toHaveBeenCalledWith(mockProduct.id, expect.objectContaining({ descricao: 'Novo Nome' }));
    await waitFor(() => {
      expect(onSaved).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('shows error when onSave throws', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Falha na rede'));
    render(
      <EditProductModal
        product={mockProduct}
        open={true}
        onOpenChange={vi.fn()}
        onSave={onSave}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Falha na rede');
  });

  it('shows generic error when onSave throws non-Error', async () => {
    const onSave = vi.fn().mockRejectedValue('unknown');
    render(
      <EditProductModal
        product={mockProduct}
        open={true}
        onOpenChange={vi.fn()}
        onSave={onSave}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Erro ao salvar');
  });
});
