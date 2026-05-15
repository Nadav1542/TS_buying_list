import { Router } from 'express';
import {
  createProducts,
  deleteProductById,
  getAllProducts,
  updateProductById
} from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.js';
import { requireListToken } from '../middleware/requireListToken.js';
import {
  createProductsSchema,
  updateProductSchema
} from '../schemas/product.schema.js';


const router = Router();

router.post('/', requireListToken, validate(createProductsSchema), createProducts);

router.get('/', requireListToken, getAllProducts);

router.delete('/:id', requireListToken, deleteProductById);

router.patch('/:id', requireListToken, validate(updateProductSchema), updateProductById);

export default router;