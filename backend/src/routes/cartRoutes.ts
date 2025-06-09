import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from '../controllers/cartController';
import { authenticated } from '../middleware/authMiddleware';

const router = express.Router();

// All cart routes require authentication
router.use(authenticated); // Applies 'authenticated' middleware to all routes below

router.get('/', getCart);
router.post('/add', addItemToCart);
router.put('/update/:productId', updateCartItemQuantity);
router.delete('/remove/:productId', removeItemFromCart);
router.delete('/clear', clearCart);

export default router;