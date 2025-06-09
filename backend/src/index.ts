// backend/index.js
import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';

const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173/streetworthy-wear'; // Default frontend URL for CORS

// CORS Configuration
// Allow requests only from your frontend domain
const corsOptions = {
  origin: FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Mount Routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes)

// Mount Images
app.use("/images", express.static("public/images"));

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Streetworthy E-commerce Backend API!',
    version: '1.0.0',
    status: 'Running'
  });
});

// A simple test route to ensure CORS is working
app.get('/test-cors', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'CORS test successful! You can see this from the frontend.',
    origin: req.headers.origin // This will show the origin of the request
  });
});

// Get Products API route
app.get('/api/products', (req: Request, res: Response) => {
  res.json([
    { name: "Blue Hoodie", price: 3000, image: "/images/product1.png" },
    { name: "Yellow Hoodie", price: 3000, image: "/images/product2.png" },
    { name: "White Hoodie", price: 3000, image: "/images/product3.png" },
  ]);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Backend API running at http://localhost:${PORT}`);
  console.log(`⚡️[server]: Run frontend from root to connect to: ${FRONTEND_URL}`);
});
