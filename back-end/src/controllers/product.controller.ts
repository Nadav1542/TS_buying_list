import { type Request, type Response } from 'express';
import { type Prisma } from '@prisma/client';
import prisma from '../utils/prisma.js';
import {
  type CreateProductsInput,
  type UpdateProductInput
} from '../schemas/product.schema.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';


export const createProducts = catchAsync(async (req: Request, res: Response) => {
  const { products } = req.body as CreateProductsInput;
  const list = await getListFromToken(req);

  const createdProducts = await prisma.$transaction(
    products.map((product) => prisma.product.create({
      data: buildCreateData(product, list.id)
    }))
  );

  return res.status(201).json({
    success: true,
    data: {
      createdCount: createdProducts.length,
      products: createdProducts.map(toApiProduct)
    }
  });
});

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const list = await getListFromToken(req);
  const products = await prisma.product.findMany({
    where: { listId: list.id },
    orderBy: { createdAt: 'asc' }
  });

  return res.status(200).json({
    success: true,
    data: products.map(toApiProduct)
  });
});

export const deleteProductById = catchAsync(async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const list = await getListFromToken(req);
  const existingProduct = await prisma.product.findFirst({
    where: { id, listId: list.id }
  });

  if (!existingProduct) {
    throw new AppError('Product not found', 404);
  }

  const deletedProduct = await prisma.product.delete({
    where: { id: existingProduct.id }
  });

  return res.status(200).json({
    success: true,
    data: toApiProduct(deletedProduct),
    message: 'Product deleted successfully'
  });
});

export const updateProductById = catchAsync(async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const cleanData = req.body as UpdateProductInput;
  const list = await getListFromToken(req);
  const existingProduct = await prisma.product.findFirst({
    where: { id, listId: list.id }
  });

  if (!existingProduct) {
    throw new AppError('Product not found', 404);
  }

  const updatedProduct = await prisma.product.update({
    where: { id: existingProduct.id },
    data: buildUpdateData(cleanData)
  });

  return res.status(200).json({
    success: true,
    data: toApiProduct(updatedProduct)
  });
});

const getIdParam = (req: Request) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new AppError('Invalid product id', 400);
  }

  return id;
};

const getListFromToken = async (req: Request) => {
  const token = req.listToken;

  if (!token) {
    throw new AppError('Missing list token', 400);
  }

  const list = await prisma.list.findUnique({
    where: { token }
  });

  if (!list) {
    throw new AppError('List not found', 404);
  }

  return list;
};

const toApiProduct = (product: {
  id: string;
  name: string;
  bought: boolean;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  _id: product.id,
  name: product.name,
  bought: product.bought,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt
});

const buildCreateData = (
  product: CreateProductsInput['products'][number],
  listId: string
): Prisma.ProductUncheckedCreateInput => {
  const data: Prisma.ProductUncheckedCreateInput = {
    name: product.name,
    listId
  };

  return data;
};

const buildUpdateData = (
  input: UpdateProductInput
): Prisma.ProductUpdateInput => {
  const data: Prisma.ProductUpdateInput = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.bought !== undefined) {
    data.bought = input.bought;
  }

  return data;
};