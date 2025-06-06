// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import asyncHandler from './asyncHandler';

// Extend the Request interface to include the user property
export interface CustomRequest extends Request {
  user?: IUser; // Add optional user property
}

/**
 * @desc    Protect routes - ensures user is logged in
 */
export const authenticated = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check if token is in headers (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // You might also check for a cookie if you send it that way
  else if (req.cookies.token) { // Assuming 'cookie-parser' will be used later if we decide to manage cookies more extensively
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };

    // Find user by ID and attach to request object
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with this ID' });
    }

    req.user = user; // Attach the user document to the request

    next();
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
});

/**
 * @desc    Authorize users by roles
 * @param   roles - An array of roles that are allowed to access the route
 */
export const authorize = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role ${req.user?.role || 'unknown'} is not authorized to access this route`,
      });
    }
    next();
  };
};