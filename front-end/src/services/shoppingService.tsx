import { type ShoppingItem } from '../types/shopping.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
export const API_URL = `${BASE_URL}/api/products`;
const LISTS_URL = `${BASE_URL}/api/lists`;
const LIST_TOKEN_KEY = 'shopping_list_token';

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

export const getListToken = () => window.localStorage.getItem(LIST_TOKEN_KEY);

export const setListToken = (token: string) => {
  window.localStorage.setItem(LIST_TOKEN_KEY, token);
};

const ensureListToken = async (): Promise<string> => {
  const existing = getListToken();
  if (existing) return existing;

  const response = await fetch(LISTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await parseApiResponse<{ token: string }>(response, 'Failed to create list');
  setListToken(data.token);
  return data.token;
};

const withListHeaders = async () => ({
  'Content-Type': 'application/json',
  'X-List-Token': await ensureListToken()
});

// ==========================================
// Types & DTOs
// ==========================================

// 1. Create a new product (POST)
// We tell TS to take ShoppingItem, but omit the fields that the server generates automatically.
// (I also removed 'bought' assuming the server defaults a new product to false)
export type CreateProductDTO = Omit<ShoppingItem, '_id' | 'createdAt' | 'updatedAt' | 'bought'>;

// 2. Update an existing product (PATCH/PUT)
// We wrap the type in Partial to state that all fields are optional.
// This allows us to send just { bought: true } without triggering TS errors.
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
  const response = await fetch(API_URL, {
    headers: {
      'X-List-Token': await ensureListToken()
    }
  });
  return parseApiResponse<ShoppingItem[]>(response, 'Failed to fetch products');
};


export const addProducts = async (productsData: CreateProductsDTO): Promise<CreateProductsResponseDTO> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: await withListHeaders(),
    body: JSON.stringify({ products: productsData } satisfies CreateProductsRequestDTO)
  });

  return parseApiResponse<CreateProductsResponseDTO>(response, 'Failed to add products');
};

// Here is how the update function using the Partial DTO looks:
export const updateProduct = async (id: string, updates: UpdateProductDTO): Promise<ShoppingItem> => {
  
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: await withListHeaders(),
    body: JSON.stringify(updates)
  });

  return parseApiResponse<ShoppingItem>(response, 'Failed to update product');
};

export const deleteProduct = async (id: string): Promise<ShoppingItem> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'X-List-Token': await ensureListToken()
    }
  });

  return parseApiResponse<ShoppingItem>(response, 'Failed to delete product');
  
  // const json = (await response.json()) as ApiResponse<null>;
  // if (!response.ok || !json.success) {
  //   throw new Error(json.message ?? 'Failed to delete product');
  // }
};  


