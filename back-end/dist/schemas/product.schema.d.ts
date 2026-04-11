import { z } from 'zod';
export declare const productInputSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
}, z.core.$strict>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    bought: z.ZodOptional<z.ZodBoolean>;
    priority: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
}, z.core.$strict>;
export declare const createProductsSchema: z.ZodObject<{
    products: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type CreateProductsInput = z.infer<typeof createProductsSchema>;
//# sourceMappingURL=product.schema.d.ts.map