type ProductPriority = 'low' | 'medium' | 'high';

export interface ShoppingItem {
  _id: string;
  name: string;
  description?: string;
  bought: boolean;
  priority: ProductPriority;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}



