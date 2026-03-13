import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { beforeEach, afterEach, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onSearch with debounced value (500ms)', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByLabelText(/buscar produtos/i);
    fireEvent.change(input, { target: { value: 'produto' } });
    expect(onSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(onSearch).toHaveBeenCalledWith('produto');
  });

  it('renders with placeholder', () => {
    render(<SearchInput onSearch={() => {}} placeholder="Digite..." />);
    expect(screen.getByPlaceholderText('Digite...')).toBeInTheDocument();
  });
});
