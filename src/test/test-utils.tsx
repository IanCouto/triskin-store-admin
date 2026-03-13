import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

/**
 * Wrapper para testes que precisam de roteamento.
 * Usa as future flags do React Router v7 para evitar warnings no console.
 */
export function TestRouter({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter future={routerFuture}>
      {children}
    </BrowserRouter>
  );
}
