import { type Request, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import Product from '../models/Product.model.js';
import {
  type CreateProductsInput,
  type UpdateProductInput
} from '../schemas/product.schema.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';


export const createProducts = catchAsync(async (req: Request, res: Response) => {
  
    const  {products}  = req.body as CreateProductsInput;

    const createdProducts = await Product.insertMany(products);

    if (!createdProducts) {
        throw new AppError('Product not found', 404);
    }

    return res.status(201).json({
      success: true,
      data: {
        createdCount: createdProducts.length,
        products: createdProducts
      }
    });
 
});


export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  
    const products = await Product.find();
    
    if (!products) {
        throw new AppError('no Products were Found', 404)
    }
    
    return res.status(200).json({ success: true, data: products });
  
});


export const deleteProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError('Invalid product id', 400);
  }

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    throw new AppError('Product not found', 404);
  }

  return res.status(200).json({
    success: true,
    data: deletedProduct,
    message: 'Product deleted successfully'
  });
});


export const toggleBought = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new AppError('Invalid product id', 400);
  }

  const cleanData = req.body as UpdateProductInput;

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    cleanData,
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedProduct) {
    throw new AppError('Product not found', 404);
  }

  return res.status(200).json({
    success: true,
    data: updatedProduct
  });
});