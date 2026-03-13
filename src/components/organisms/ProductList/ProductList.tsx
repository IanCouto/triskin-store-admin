import { useMemo } from 'react';
import type { Product } from '@/types/product';
import { ProductItem } from '@/components/organisms/ProductItem';
import { Loader } from '@/components/atoms/Loader';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { cn } from '@/lib/utils';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  searchQuery?: string;
  onEditProduct?: (product: Product) => void;
  className?: string;
}

export function ProductList({
  products,
  loading = false,
  error = null,
  searchQuery = '',
  onEditProduct,
  className,
}: ProductListProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => p.descricao.toLowerCase().includes(q));
  }, [products, searchQuery]);

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn(
          'flex min-h-[200px] items-center justify-center',
          className
        )}
        role="status"
        aria-label="Carregando produtos"
      >
        <Loader size="lg" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <p
        className={cn(
          'py-8 text-center text-muted-foreground',
          className
        )}
        role="status"
      >
        {searchQuery
          ? 'Nenhum produto encontrado para essa busca.'
          : 'Nenhum produto cadastrado.'}
      </p>
    );
  }

  return (
    <ul
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
      data-testid="product-list"
    >
      {filtered.map((product) => (
        <li key={product.id}>
          <ProductItem
            product={product}
            onEdit={onEditProduct}
          />
        </li>
      ))}
    </ul>
  );
}
