import { Response, NextFunction } from 'express';
import Cart, { ICartItem } from '../models/Cart';
import Product from '../models/Product';
import asyncHandler from '../middleware/asyncHandler';
import { CustomRequest } from '../middleware/authMiddleware';
import { Types } from 'mongoose';

/**
 * @desc    Get user's cart
 * @route   GET /api/v1/cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price imageUrl stock');

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found for this user' });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * @desc    Add item to cart or update quantity if exists
 * @route   POST /api/v1/cart/add
 * @access  Private
 */
export const addItemToCart = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
  }

  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    // Cart exists for user
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Product already in cart, update quantity
      const existingItem = cart.items[itemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ success: false, message: `Adding ${quantity} units would exceed stock. Total desired: ${newQuantity}, Available: ${product.stock}` });
      }
      existingItem.quantity = newQuantity;
    } else {
      // Product not in cart, add new item
      const newItem: ICartItem = {
        product: product._id as Types.ObjectId,
        name: product.name,
        imageUrl: product.imageUrl,
        quantity: quantity,
        price: product.price,
      };
      cart.items.push(newItem);
    }
    cart = await cart.save();
  } else {
    // No cart for user, create new one
    const newItem: ICartItem = {
      product: product._id as Types.ObjectId,
      name: product.name,
      imageUrl: product.imageUrl,
      quantity: quantity,
      price: product.price,
    };
    cart = await Cart.create({
      user: userId,
      items: [newItem],
    });
  }

  // Re-populate to send full product details in response
  cart = await cart.populate('items.product', 'name price imageUrl stock');

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * @desc    Update quantity of an item in cart
 * @route   PUT /api/v1/cart/update/:productId
 * @access  Private
 */
export const updateCartItemQuantity = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  if (quantity === undefined || quantity < 0) {
    return res.status(400).json({ success: false, message: 'Quantity must be a non-negative number.' });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found for this user' });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    const itemToUpdate = cart.items[itemIndex];
    const product = await Product.findById(productId);

    if (!product) {
      // This should ideally not happen if product was added correctly, but good to check
      return res.status(404).json({ success: false, message: 'Product linked to cart item not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Desired quantity (${quantity}) exceeds stock for ${product.name}. Available: ${product.stock}` });
    }

    if (quantity === 0) {
      // If quantity is 0, remove the item
      cart.items.splice(itemIndex, 1);
    } else {
      // Otherwise, update quantity
      itemToUpdate.quantity = quantity;
    }

    cart = await cart.save();
    // Re-populate to send full product details in response
    cart = await cart.populate('items.product', 'name price imageUrl stock');
    res.status(200).json({ success: true, data: cart });

  } else {
    res.status(404).json({ success: false, message: 'Item not found in cart' });
  }
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/v1/cart/remove/:productId
 * @access  Private
 */
export const removeItemFromCart = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found for this user' });
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(item => item.product.toString() !== productId);

  if (cart.items.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  cart = await cart.save();
  // Re-populate to send full product details in response
  cart = await cart.populate('items.product', 'name price imageUrl stock');

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Item removed from cart',
  });
});

/**
 * @desc    Clear user's cart
 * @route   DELETE /api/v1/cart/clear
 * @access  Private
 */
export const clearCart = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user ID' });
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found for this user' });
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart cleared successfully',
  });
});