// ecommerce-backend/src/controllers/orderController.ts
import { Request, Response, NextFunction } from 'express';
import Order, { IOrderItem, IOrderShippingAddress, IPaymentResult } from '../models/Order';
import Product from '../models/Product';
import Cart from '../models/Cart'; // To clear cart after order
import asyncHandler from '../middleware/asyncHandler';
import { CustomRequest } from '../middleware/authMiddleware';
import { Types } from 'mongoose';

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
export const addOrderItems = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const {
    orderItems: clientOrderItems, // These are the items from the client's cart
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  if (!clientOrderItems || clientOrderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  // Validate products and update stock
  const orderItems: IOrderItem[] = [];
  for (const item of clientOrderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found: ${item.name || item.product}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}. Available: ${product.stock}, Desired: ${item.quantity}` });
    }

    orderItems.push({
      product: product._id as Types.ObjectId,
      name: product.name,
      imageUrl: product.imageUrl,
      quantity: item.quantity,
      price: product.price, // Use actual product price to prevent manipulation
    });

    // Decrease product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const order = new Order({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Clear the user's cart after creating the order
  await Cart.deleteOne({ user: userId });

  res.status(201).json({ success: true, data: createdOrder });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const isAdmin = req.user?.role === 'admin';

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  const order = await Order.findById(req.params.id).populate('user', 'username email');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Allow owner or admin to view the order
  if (order.user._id.toString() !== userId.toString() && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
  }

  res.status(200).json({ success: true, data: order });
});

/**
 * @desc    Update order to paid (simulated payment)
 * @route   PUT /api/v1/orders/:id/pay
 * @access  Private
 */
export const updateOrderToPaid = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { id, status, update_time, email_address } = req.body; // Simulated payment result

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Ensure only the order owner can mark it as paid
  if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this order' });
  }

  if (order.isPaid) {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: id || 'simulated_id', // Use provided id or a simulated one
    status: status || 'COMPLETED',
    update_time: update_time || new Date().toISOString(),
    email_address: email_address || req.user?.email || 'simulated@example.com',
  };
  order.orderStatus = 'Processing'; // Update status to Processing after payment

  const updatedOrder = await order.save();

  res.status(200).json({ success: true, data: updatedOrder });
});

/**
 * @desc    Update order to delivered
 * @route   PUT /api/v1/orders/:id/deliver
 * @access  Private/Admin
 */
export const updateOrderToDelivered = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.isDelivered) {
      return res.status(400).json({ success: false, message: 'Order is already delivered' });
  }

  if (!order.isPaid) {
      return res.status(400).json({ success: false, message: 'Order must be paid before it can be delivered' });
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  order.orderStatus = 'Delivered'; // Update status

  const updatedOrder = await order.save();

  res.status(200).json({ success: true, data: updatedOrder });
});

/**
 * @desc    Get all orders for a logged in user
 * @route   GET /api/v1/orders/myorders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: orders.length, data: orders });
});

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/v1/orders
 * @access  Private/Admin
 */
export const getOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.find({})
    .populate('user', 'id username email') // Populate user details
    .sort({ createdAt: -1 }); // Sort by most recent

  res.status(200).json({ success: true, count: orders.length, data: orders });
});