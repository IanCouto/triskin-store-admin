import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalValue } = useCart();

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-12"
        data-testid="cart-empty"
      >
        <p className="text-muted-foreground">Seu carrinho está vazio.</p>
        <Button asChild variant="outline">
          <Link to="/">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="cart-page">
      <ul className="space-y-4">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4"
            data-testid="cart-item"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{product.descricao}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(Number(product.valorUnitario))} × {quantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  aria-label="Diminuir quantidade"
                >
                  −
                </Button>
                <span
                  className="min-w-[2rem] text-center text-sm"
                  data-testid="cart-item-quantity"
                >
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  aria-label="Aumentar quantidade"
                >
                  +
                </Button>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeItem(product.id)}
                aria-label="Remover do carrinho"
              >
                Remover
              </Button>
            </div>
            <p className="w-full text-right font-medium sm:w-auto">
              {formatPrice(Number(product.valorUnitario) * quantity)}
            </p>
          </li>
        ))}
      </ul>
      <div
        className={cn(
          'flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between'
        )}
      >
        <p className="text-lg font-semibold">
          Total ({totalItems} {totalItems === 1 ? 'item' : 'itens'}):{' '}
          <span data-testid="cart-total">{formatPrice(totalValue)}</span>
        </p>
        <Button asChild>
          <Link to="/">Continuar comprando</Link>
        </Button>
      </div>
    </div>
  );
}
