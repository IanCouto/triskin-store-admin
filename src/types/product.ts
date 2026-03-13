/**
 * Product type aligned with backend API (Produto entity).
 * descricao is used as display name; ativo is optional for challenge (Status Ativo/Inativo).
 */
export interface Product {
  id: string;
  descricao: string;
  codigo: string | null;
  valorUnitario: number;
  unidade: string;
  ncm: string | null;
  cst: string | null;
  cfop: string | null;
  createdAt?: string;
  updatedAt?: string;
  /** Frontend/mock: Status Ativo/Inativo for listing (default true when not present). */
  ativo?: boolean;
}

export interface ProductUpdatePayload {
  descricao?: string;
  codigo?: string;
  valorUnitario?: number;
  unidade?: string;
  ncm?: string;
  cst?: string;
  cfop?: string;
}

export type ProductStatus = 'ativo' | 'inativo';
