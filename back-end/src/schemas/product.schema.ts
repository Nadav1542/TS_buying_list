import { z } from 'zod';

const nameSchema = z.string().trim().min(3, 'Name must contain at least 3 characters');

export const productInputSchema = z.object({
  name: nameSchema
}).strict();

export const updateProductSchema = z.object({
  name: nameSchema.optional(),
  bought: z.boolean().optional()
}).strict().refine((payload) => Object.keys(payload).length > 0, {
  message: 'At least one field must be provided'
});

export const createProductsSchema = z.object({
  products: z.array(productInputSchema).min(1, 'At least one product is required').max(50, 'Maximum 50 products per request')
}).strict();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type CreateProductsInput = z.infer<typeof createProductsSchema>;
