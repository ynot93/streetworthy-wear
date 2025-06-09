import mongoose, { Document, Schema } from 'mongoose';

// Interface for a single item in the cart
export interface ICartItem {
  product: mongoose.Types.ObjectId; // Reference to the Product model
  name: string; // Store product name for easier display/reference
  imageUrl: string; // Store image URL for easier display
  quantity: number;
  price: number; // Price at the time of adding to cart
}

// Interface for the Cart document
export interface ICart extends Document {
  user: mongoose.Types.ObjectId; // Reference to the User model
  items: ICartItem[];
  totalPrice: number; // Calculated total price of all items in the cart
  createdAt: Date;
  updatedAt: Date;
}

// Schema for a single item
const CartItemSchema: Schema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less than 1.'],
  },
  price: {
    type: Number,
    required: true,
  },
}, { _id: false }); // Do not generate _id for subdocuments (cart items)

// Schema for the Cart
const CartSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // A user can only have one cart
    },
    items: [CartItemSchema], // Array of cart items
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate total price before saving
CartSchema.pre<ICart>('save', function (next) {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  next();
});

const Cart = mongoose.model<ICart>('Cart', CartSchema);

export default Cart;