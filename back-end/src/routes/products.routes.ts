import { Router } from 'express';
import {
  createProducts,
  deleteProductById,
  getAllProducts,
  toggleBought
} from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createProductsSchema,
  updateProductSchema
} from '../schemas/product.schema.js';


const router = Router();

router.post('/', validate(createProductsSchema), createProducts);

router.get('/', getAllProducts);

router.delete('/:id', deleteProductById);

router.patch('/:id', validate(updateProductSchema), toggleBought);

export default router;