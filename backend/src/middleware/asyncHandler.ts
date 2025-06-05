// backend/src/middleware/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

// Wrapper for async route handlers to catch errors
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;