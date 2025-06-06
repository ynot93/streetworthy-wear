import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/Product';
import asyncHandler from '../middleware/asyncHandler'; // For handling async errors

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, category, brand, stock, imageUrl } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    brand,
    stock,
    imageUrl,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, category, brand, stock, imageUrl } = req.body;

  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Update product fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.stock = stock !== undefined ? stock : product.stock; // Allow stock to be 0
  product.imageUrl = imageUrl || product.imageUrl;

  product = await product.save(); // Save the updated product

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  await product.deleteOne(); // Use deleteOne() on the document instance

  res.status(200).json({
    success: true,
    message: 'Product removed',
  });
});