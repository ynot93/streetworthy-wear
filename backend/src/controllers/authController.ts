// backend/src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { CustomRequest } from '../middleware/authMiddleware'; // We'll create this next
import asyncHandler from '../middleware/asyncHandler'; // We'll create this next

// Helper function to send JWT token in a cookie
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + (process.env.JWT_EXPIRES_IN_MS ? parseInt(process.env.JWT_EXPIRES_IN_MS) : 1000 * 60 * 60 * 24)), // 1 day by default
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production' // Only send cookie over HTTPS in production
  };

  res
    .status(statusCode)
    .cookie('token', token, options) // Set token as a cookie
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
};

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role, // Allow setting role during registration for testing, but often handled by admin later
  });

  sendTokenResponse(user, 201, res);
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter an email and password' });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password'); // Explicitly select password

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Log user out / clear cookie
 * @route   GET /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});


/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  // User ID is attached to req.user by the protect middleware
  const user = await User.findById(req.user?.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});