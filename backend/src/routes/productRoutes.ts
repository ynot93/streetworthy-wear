import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticated, authorize } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes (anyone can view products)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes (only authenticated admins can create, update, delete products)
// For createProduct and updateProduct, use upload.single('image') to handle a single file upload
// 'image' is the field name that will contain the file
router.post('/', authenticated, authorize('admin'), upload.single('image'), createProduct);
router.put('/:id', authenticated, authorize('admin'), upload.single('image'), updateProduct);
router.delete('/:id', authenticated, authorize('admin'), deleteProduct);

export default router;