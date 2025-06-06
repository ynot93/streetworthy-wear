import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticated, authorize } from '../middleware/authMiddleware'; // Import auth middleware

const router = express.Router();

// Public routes (anyone can view products)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes (only authenticated admins can create, update, delete products)
router.post('/', authenticated, authorize('admin'), createProduct);
router.put('/:id', authenticated, authorize('admin'), updateProduct);
router.delete('/:id', authenticated, authorize('admin'), deleteProduct);

export default router;