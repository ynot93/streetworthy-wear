// backend/src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define Shipping Address Interface
export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Define the interface for User document
export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // Optional because it won't always be returned
  role: 'customer' | 'admin';
  shippingAddress?: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

// Define Shipping Address Schema (sub-schema)
const ShippingAddressSchema: Schema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

// Define the User Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password in query results by default
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    shippingAddress: ShippingAddressSchema,
  },
  {
    timestamps: true,
  }
);

// Mongoose pre-save hook to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next(); // Only hash if the password field is being modified
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

// Method to generate JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role }, // Include role in the token payload
    process.env.JWT_SECRET as string,
    {
      expiresIn: '2d',
    }
  );
};

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;