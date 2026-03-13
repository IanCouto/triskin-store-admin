import { useState } from 'react';
import type { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/atoms/Loader';
import { cn } from '@/lib/utils';

interface ProductItemProps {
  product: Product;
  onEdit?: (product: Product) => void;
  className?: string;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
}

export function ProductItem({ product, onEdit, className }: ProductItemProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const isActive = product.ativo !== false;

  const handleAddToCart = async () => {
    if (!isActive) return;
    setAdding(true);
    try {
      addItem(product);
      await new Promise((r) => setTimeout(r, 400));
    } finally {
      setAdding(false);
    }
  };

  return (
    <article
      className={cn(
        'flex flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md',
        !isActive && 'opacity-75',
        className
      )}
      data-testid="product-item"
    >
      <div className="mb-2 flex flex-1 flex-col gap-1">
        <h3 className="font-medium leading-tight">{product.descricao}</h3>
        <p className="text-lg font-semibold text-primary">
          {formatPrice(product.valorUnitario)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isActive ? 'success' : 'secondary'}>
            {isActive ? 'Ativo' : 'Inativo'}
          </Badge>
          {product.codigo && (
            <span className="text-xs text-muted-foreground">
              Cód: {product.codigo}
            </span>
          )}
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={!isActive || adding}
          className="min-w-[140px]"
          data-testid="add-to-cart"
        >
          {adding ? (
            <Loader size="sm" className="border-primary-foreground border-t-transparent" />
          ) : (
            'Adicionar ao Carrinho'
          )}
        </Button>
        {onEdit && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            disabled={adding}
          >
            Editar
          </Button>
        )}
      </div>
    </article>
  );
}
