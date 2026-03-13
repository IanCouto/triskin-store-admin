import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalValue } = useCart();
  const [quantityDraft, setQuantityDraft] = useState<Record<string, string>>({});

  const commitQuantity = useCallback(
    (productId: string, value: string) => {
      const parsed = parseInt(value, 10);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        updateQuantity(productId, parsed);
      }
      setQuantityDraft((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    },
    [updateQuantity]
  );

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center"
          data-testid="cart-empty"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" aria-hidden />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Carrinho vazio</h2>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Você ainda não adicionou nenhum produto. Navegue pela loja e adicione itens ao carrinho.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              Ver produtos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8" data-testid="cart-page">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Meu carrinho</h1>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Lista de itens */}
        <ul className="space-y-3">
          {items.map(({ product, quantity }) => {
            const lineTotal = Number(product.valorUnitario) * quantity;
            return (
              <li
                key={product.id}
                className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-6"
                data-testid="cart-item"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{product.descricao}</h3>
                  {product.codigo && (
                    <p className="mt-0.5 text-xs text-muted-foreground">Cód: {product.codigo}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatPrice(Number(product.valorUnitario))} <span className="text-border">·</span> unidade
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                  <div className="flex items-center rounded-lg border bg-background">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-r-none hover:bg-muted"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min={0}
                      aria-label="Quantidade"
                      className="h-9 w-14 shrink-0 border-0 border-x bg-transparent px-1 text-center text-sm tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      value={quantityDraft[product.id] ?? quantity}
                      onChange={(e) =>
                        setQuantityDraft((prev) => ({ ...prev, [product.id]: e.target.value }))
                      }
                      onBlur={() =>
                        commitQuantity(product.id, quantityDraft[product.id] ?? String(quantity))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                      }}
                      data-testid="cart-item-quantity"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-l-none hover:bg-muted"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="w-full text-right text-lg font-semibold sm:w-auto sm:min-w-[6rem] sm:text-right">
                    {formatPrice(lineTotal)}
                  </p>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeItem(product.id)}
                    aria-label="Remover do carrinho"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Resumo do pedido */}
        <aside className="lg:block">
          <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Resumo do pedido</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal ({totalItems} itens)</dt>
                <dd className="font-medium">{formatPrice(totalValue)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t pt-4" role="group" aria-label="Total geral">
              <span className="text-base font-semibold">Total</span>
              <span className="text-xl font-bold" data-testid="cart-total">
                {formatPrice(totalValue)}
              </span>
            </div>
            <Button asChild className="mt-6 w-full gap-2" size="lg">
              <Link to="/">
                Continuar comprando
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
