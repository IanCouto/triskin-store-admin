import { useCallback, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 500;

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function SearchInput({
  onSearch,
  placeholder = 'Buscar por nome...',
  className,
  defaultValue = '',
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      onSearch(value);
      timeoutRef.current = null;
    }, DEBOUNCE_MS);
    return flush;
  }, [value, onSearch, flush]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={cn('relative min-w-[20rem] w-full sm:min-w-[22rem]', className)}>
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9"
        aria-label="Buscar produtos"
      />
    </div>
  );
}
