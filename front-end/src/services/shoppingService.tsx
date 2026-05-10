import { type ShoppingItem } from '../types/shopping.types';

export const API_URL = 'http://localhost:3001/api/products';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

const parseApiResponse = async <T,>(response: Response, fallbackMessage: string): Promise<T> => {
  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success || json.data === undefined) {
    throw new Error(json.message ?? fallbackMessage);
  }

  return json.data;
};

// ==========================================
// Types & DTOs
// ==========================================

// 1. Create a new product (POST)
// We tell TS to take ShoppingItem, but omit the fields that the server generates automatically.
// (I also removed 'bought' assuming the server defaults a new product to false)
export type CreateProductDTO = Omit<ShoppingItem, '_id' | 'createdAt' | 'updatedAt' | 'bought' | 'priority'>;

// 2. Update an existing product (PATCH/PUT)
// We wrap the type in Partial to state that all fields are optional.
// This allows us to send just { bought: true } or { priority: 'high' } without triggering TS errors.
export type UpdateProductDTO = Partial<Omit<ShoppingItem, '_id' | 'createdAt' | 'updatedAt'>>;


export type CreateProductsDTO = CreateProductDTO[];


export interface CreateProductsRequestDTO {
  products: CreateProductsDTO;
}

export interface CreateProductsResponseDTO {
  createdCount: number;
  products: ShoppingItem[];
}

// ==========================================
// API Functions
// ==========================================

export const getShoppingList = async (): Promise<ShoppingItem[]> => {
  const response = await fetch(API_URL);
  return parseApiResponse<ShoppingItem[]>(response, 'Failed to fetch products');
};


export const addProducts = async (productsData: CreateProductsDTO): Promise<CreateProductsResponseDTO> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products: productsData } satisfies CreateProductsRequestDTO)
  });

  return parseApiResponse<CreateProductsResponseDTO>(response, 'Failed to add products');
};

// Here is how the update function using the Partial DTO looks:
export const updateProduct = async (id: string, updates: UpdateProductDTO): Promise<ShoppingItem> => {
  
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  return parseApiResponse<ShoppingItem>(response, 'Failed to update product');
};

export const deleteProduct = async (id: string): Promise<ShoppingItem> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  return parseApiResponse<ShoppingItem>(response, 'Failed to delete product');
  
  // const json = (await response.json()) as ApiResponse<null>;
  // if (!response.ok || !json.success) {
  //   throw new Error(json.message ?? 'Failed to delete product');
  // }
};  


