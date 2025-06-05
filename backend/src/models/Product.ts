// backend/src/models/Product.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string; // Optional brand
  stock: number;
  imageUrl: string; // URL to the product image
  createdAt: Date;
  updatedAt: Date;
}

// Define the Product Schema
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true }, // Simple URL for now
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// Create and export the Product model
const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;