import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className }: CartIconProps) {
  const { totalItems } = useCart();

  return (
    <Link
      to="/carrinho"
      className={cn(
        'relative inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      aria-label={`Carrinho com ${totalItems} itens`}
    >
      <ShoppingCart className="h-6 w-6" aria-hidden />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 min-w-5 px-1.5 text-xs"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </Link>
  );
}
