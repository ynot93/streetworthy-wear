import mongoose, { Document, Schema } from 'mongoose';

// Item structure within an order (frozen at time of order)
export interface IOrderItem {
  name: string;
  quantity: number;
  imageUrl: string;
  price: number; // Price at the time of order
  product: mongoose.Types.ObjectId; // Reference to the Product model
}

// Payment Result structure
export interface IPaymentResult {
  id: string; // Transaction ID
  status: string; // e.g., 'completed', 'paid', 'pending'
  update_time: string;
  email_address?: string;
}

// Shipping Address structure (can be separate if needed)
export interface IOrderShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Main Order document interface
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId; // Reference to User who placed the order
  orderItems: IOrderItem[];
  shippingAddress: IOrderShippingAddress;
  paymentMethod: string; // e.g., 'PayPal', 'Stripe', 'CashOnDelivery'
  paymentResult?: IPaymentResult; // Details after payment (e.g., from PayPal)
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Schema for individual items within an order
const OrderItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product', // Reference to the Product model
  },
});

// Schema for the main Order
const OrderSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    orderItems: [OrderItemSchema], // Array of order items
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: { // Details from payment gateway
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;