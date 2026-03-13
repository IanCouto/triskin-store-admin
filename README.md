# Triskin Store Admin

Aplicação front-end do desafio técnico: painel administrativo de produtos com listagem, carrinho global, edição de produto e busca com debounce.

## Escolhas do desafio

Sempre que o desafio oferece alternativas, abaixo está a opção utilizada neste projeto:

| Item | Opções do desafio | Escolha utilizada |
|------|-------------------|-------------------|
| **API / dados da listagem** | MockAPI, JSON Server, etc. | Mock local (`src/lib/mockProducts.ts`) quando não há backend; API real (Nest) quando `VITE_API_URL` está definido. |
| **Estado global do carrinho** | Zustand, Context API, Jotai ou Redux | **Context API** |
| **Formulário de edição** | Modal ou rota separada | **Modal** (`EditProductModal`) |
| **Componente de edição** | EditProductModal ou EditPage | **EditProductModal** |
| **Estilização (stack)** | Styled Components, Tailwind ou CSS Modules | **Tailwind CSS** |
| **Requisições HTTP (stack)** | Axios ou Fetch | **Fetch** |
| **Gerenciador de estado (stack)** | Context, Zustand, Redux, Jotai | **Context API** |
| **Data fetching (extra)** | React Query ou SWR | **React Query** (TanStack Query) |
| **Testes (extra)** | Vitest/Jest + RTL | **Vitest** + **React Testing Library** |
| **Design system (extra)** | Radix ou Shadcn | **Shadcn** (estilo, com primitivos Radix) |
| **Deploy (extra)** | Vercel ou Netlify | **Não implementado** |

## Tecnologias e bibliotecas

- **React 18** + Hooks + TypeScript
- **Vite** – build e dev server
- **Tailwind CSS** – estilização
- **shadcn-style UI** – componentes (Radix Dialog, Slot, CVA, tailwind-merge, clsx)
- **React Router DOM** – rotas (/ e /carrinho)
- **React Query (TanStack Query)** – fetching e cache de produtos (menos `useEffect`, revalidação)
- **Context API** – estado global do carrinho
- **Vitest** + **React Testing Library** – testes unitários e de componentes

## Estrutura e boas práticas

- **Modelo atômico** de componentização:
  - **Atoms:** `Loader`, `ErrorMessage`
  - **Molecules:** `SearchInput`, `CartIcon`
  - **Organisms:** `ProductList`, `ProductItem`, `EditProductModal`, `CartPage`
  - **Layout:** `Header`
- Componentes reutilizáveis em `src/components/ui` (Button, Input, Badge, Dialog, Label).
- Tipos em `src/types`, serviços em `src/services`, contexto em `src/contexts`.
- API configurável: sem `VITE_API_URL` usa mock; com `VITE_API_URL` (ex.: `/api`) usa o backend.

## Como executar

```bash
# Instalar dependências
npm install

# Desenvolvimento (mock de produtos)
npm run dev

# Build de produção
npm run build

# Testes
npm test
# ou uma vez
npm run test:run

# Cobertura
npm run test:coverage
```

### Usando com o backend

Com o backend Nest rodando (ex.: porta 3000), crie um `.env` no frontend:

```env
VITE_API_URL=/api
```

O `vite.config.ts` está configurado para fazer proxy de `/api` para `http://localhost:3000`, então as chamadas a `/api/produtos` e `/api/produtos/:id` (PATCH) vão para o backend.

## Estratégias de otimização e estado global

### Estado global (carrinho)

- **Context API** com `useState` para os itens do carrinho.
- Ações estáveis com `useCallback`: `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
- Valores derivados em `useMemo`: `totalItems`, `totalValue`, para evitar recálculos e re-renders desnecessários.
- Provider único em `main.tsx`, usado por `CartIcon`, `ProductItem` e `CartPage`.

### Otimização de dados e efeitos

- **React Query** para listagem de produtos: cache, loading e erro centralizados, sem `useEffect` manual para fetch.
- Invalidação da query `products` após salvar no modal de edição, para refletir dados atualizados.
- **Debounce de 500 ms** no `SearchInput` para filtrar por nome, reduzindo processamento e re-renders durante a digitação.
- Filtro da lista por `searchQuery` feito com `useMemo` a partir de `products` e `searchQuery`.
- Botões de envio e “Adicionar ao Carrinho” desabilitados durante loading, com feedback visual (loader), evitando múltiplos cliques.

### UX e feedback

- Loaders globais e por componente (lista, botão de adicionar, submit do modal).
- Mensagens de erro com `ErrorMessage` (role `alert`).
- Estados vazios claros (carrinho vazio, nenhum produto, nenhum resultado de busca).

## Funcionalidades implementadas

1. **Listagem de produtos** – da API (mock ou backend), com nome, preço, status (Ativo/Inativo) e botão “Adicionar ao Carrinho”.
2. **Carrinho (estado global)** – adição com incremento de quantidade, ícone na header com badge, página `/carrinho` com lista, alteração de quantidade, remoção e totalizador.
3. **Edição de produto** – modal a partir da listagem, salvamento com feedback e desabilitação do botão durante envio; lista atualizada após sucesso (React Query).
4. **Busca com debounce** – campo de busca com 500 ms de debounce, filtrando por nome.
5. **UX responsiva** – loaders, feedback de erro e estados vazios; layout adaptável (grid de produtos, header, página do carrinho).

## Componentes obrigatórios

- `ProductList`, `ProductItem`
- `EditProductModal`
- `SearchInput`
- `CartIcon`, `CartPage`
- `Loader`, `ErrorMessage`

Todos implementados e reutilizados conforme o modelo atômico acima.
