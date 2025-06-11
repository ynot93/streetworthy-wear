// ecommerce-backend/src/routes/orderRoutes.ts
import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} from '../controllers/orderController';
import { authenticated, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Routes for customers
router.route('/').post(authenticated, addOrderItems); // Create new order
router.route('/myorders').get(authenticated, getMyOrders); // Get logged-in user's orders
router.route('/:id').get(authenticated, getOrderById); // Get specific order by ID
router.route('/:id/pay').put(authenticated, updateOrderToPaid); // Mark order as paid

// Admin routes
router.route('/').get(authenticated, authorize('admin'), getOrders); // Get all orders (admin)
router.route('/:id/deliver').put(authenticated, authorize('admin'), updateOrderToDelivered); // Mark order as delivered (admin)

export default router;