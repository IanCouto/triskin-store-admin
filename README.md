# Triskin Store Admin

Aplicação front-end do desafio técnico: painel administrativo de produtos com listagem, carrinho global, edição de produto e busca com debounce.

---

## Loja em produção

A aplicação está publicada e pode ser acessada em:

**[https://triskin-store-admin-six.vercel.app/](https://triskin-store-admin-six.vercel.app/)**

Essa é a **loja ao vivo** (deploy na Vercel). Você pode testar todas as funcionalidades: listagem, adicionar ao carrinho, editar produto, busca com debounce e página do carrinho com alteração de quantidade.

---

## Loja em funcionamento (screenshots)

As imagens abaixo mostram a loja em uso e as principais ações.

### Listagem de produtos

Página inicial com produtos, preço, status (Ativo/Inativo), botões "Adicionar ao Carrinho" e "Editar", e campo de busca.

![Listagem de produtos](<img width="2559" height="1354" alt="image" src="https://github.com/user-attachments/assets/cbb37f5b-78d0-48f1-be98-983af95f4b1d" />)

### Página do carrinho (vazio)

Estado vazio do carrinho com mensagem e link para voltar aos produtos.

![Carrinho vazio](<img width="2559" height="571" alt="image" src="https://github.com/user-attachments/assets/69a86ece-c081-43ad-9f1d-c18be3c9d925" />)

### Página do carrinho (com itens)

Carrinho com itens, alteração de quantidade (input e botões −/+), remoção e totalizador.

![Carrinho com itens](<img width="2559" height="1304" alt="image" src="https://github.com/user-attachments/assets/0e6cb15b-2b22-4759-ad5d-ba1dbd10dc40" />)

### Modal de edição de produto

Formulário de edição (descrição, código, valor, unidade) com botões Cancelar e Salvar.

![Modal editar produto](<img width="2559" height="1348" alt="image" src="https://github.com/user-attachments/assets/71e8f7a1-82ec-4dac-9a31-f7e68032a742" />)

---

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
| **Deploy (extra)** | Vercel ou Netlify | **Vercel** |

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

## Deploy na Vercel

O projeto está configurado para deploy na Vercel (SPA com React Router).

### Passo a passo

1. **Acesse [vercel.com](https://vercel.com)** e faça login (GitHub recomendado).

2. **Importe o repositório**
   - Clique em **Add New…** → **Project**.
   - Conecte o GitHub e selecione o repositório `triskin-store-admin` (ou o que contiver este frontend).
   - Se o frontend estiver na raiz do repo, não altere **Root Directory**. Se estiver em uma pasta (ex.: `frontend`), defina **Root Directory** como `frontend`.

3. **Configuração do build** (a Vercel costuma detectar automaticamente)
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - O arquivo `vercel.json` na raiz já define isso e os rewrites para SPA.

4. **Variáveis de ambiente (opcional)**  
   Se quiser apontar para um backend em produção, adicione em **Settings → Environment Variables**:
   - `VITE_API_URL` = URL base da API (ex.: `https://sua-api.fly.dev` ou `https://api.seudominio.com`).  
   Deixe em branco para usar apenas o mock de produtos.

5. **Deploy**  
   Clique em **Deploy**. A cada push na branch conectada (ex.: `master`), a Vercel fará um novo deploy.

### Comportamento no deploy

- **Rotas** (`/`, `/carrinho`): o `vercel.json` redireciona todas para `index.html`, e o React Router trata no cliente.
- **Sem `VITE_API_URL`**: a aplicação usa o mock local (lista de produtos estática).
- **Com `VITE_API_URL`**: as chamadas de produtos vão para a API configurada (CORS deve permitir o domínio da Vercel).
