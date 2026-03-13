import { Link } from 'react-router-dom';
import { CartIcon } from '@/components/molecules/CartIcon';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4',
        className
      )}
    >
      <Link
        to="/"
        className="text-lg font-semibold text-foreground hover:underline"
      >
        Triskin Store Admin
      </Link>
      <CartIcon />
    </header>
  );
}
