import { z } from 'zod';
const productPrioritySchema = z.enum(['low', 'medium', 'high']);
const nameSchema = z.string().trim().min(3, 'Name must contain at least 3 characters');
const descriptionSchema = z.string().trim().max(400, 'Description is too long');
export const productInputSchema = z.object({
    name: nameSchema,
    description: descriptionSchema.optional(),
    priority: productPrioritySchema.optional()
}).strict();
export const updateProductSchema = z.object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    bought: z.boolean().optional(),
    priority: productPrioritySchema.optional()
}).strict().refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field must be provided'
});
export const createProductsSchema = z.object({
    products: z.array(productInputSchema).min(1, 'At least one product is required').max(50, 'Maximum 50 products per request')
}).strict();
//# sourceMappingURL=product.schema.js.map