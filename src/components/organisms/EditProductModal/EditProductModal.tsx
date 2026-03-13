import { useState, useCallback } from 'react';
import type { Product, ProductUpdatePayload } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/atoms/Loader';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';

interface EditProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, payload: ProductUpdatePayload) => Promise<Product>;
  onSaved?: (product: Product) => void;
}

const initialForm = (p: Product | null): ProductUpdatePayload => ({
  descricao: p?.descricao ?? '',
  codigo: p?.codigo ?? undefined,
  valorUnitario: p != null ? Number(p.valorUnitario) : 0,
  unidade: p?.unidade ?? 'UN',
  ncm: p?.ncm ?? undefined,
  cst: p?.cst ?? undefined,
  cfop: p?.cfop ?? undefined,
});

export function EditProductModal({
  product,
  open,
  onOpenChange,
  onSave,
  onSaved,
}: EditProductModalProps) {
  const [form, setForm] = useState<ProductUpdatePayload>(() =>
    initialForm(product)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setForm(initialForm(product));
    setError(null);
  }, [product]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) reset();
      onOpenChange(next);
    },
    [onOpenChange, reset]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!product) return;
      setError(null);
      setSubmitting(true);
      try {
        const updated = await onSave(product.id, form);
        onSaved?.(updated);
        handleOpenChange(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.'
        );
      } finally {
        setSubmitting(false);
      }
    },
    [product, form, onSave, onSaved, handleOpenChange]
  );

  const update = (field: keyof ProductUpdatePayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showClose={!submitting}>
        <DialogHeader>
          <DialogTitle>Editar produto</DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para editar descrição, código, valor e unidade do produto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage message={error} />}
          <div className="space-y-2">
            <Label htmlFor="edit-descricao">Descrição</Label>
            <Input
              id="edit-descricao"
              value={form.descricao ?? ''}
              onChange={(e) => update('descricao', e.target.value)}
              required
              maxLength={255}
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-codigo">Código</Label>
            <Input
              id="edit-codigo"
              value={form.codigo ?? ''}
              onChange={(e) => update('codigo', e.target.value)}
              maxLength={20}
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-valor">Valor unitário (R$)</Label>
            <Input
              id="edit-valor"
              type="number"
              step="0.01"
              min={0}
              value={form.valorUnitario ?? ''}
              onChange={(e) =>
                update('valorUnitario', e.target.value ? Number(e.target.value) : 0)
              }
              required
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-unidade">Unidade</Label>
            <Input
              id="edit-unidade"
              value={form.unidade ?? 'UN'}
              onChange={(e) => update('unidade', e.target.value)}
              maxLength={10}
              disabled={submitting}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting} aria-busy={submitting}>
              {submitting ? (
                <>
                  <Loader size="sm" className="border-primary-foreground border-t-transparent" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
