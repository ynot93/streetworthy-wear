// backend/index.js
import express, { Request, Response } from "express";
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));


// Sample API route
app.get('/api/products', (req: Request, res: Response) => {
  res.json([
    { name: "Blue Hoodie", price: 3000, image: "/images/product1.png" },
    { name: "Yellow Hoodie", price: 3000, image: "/images/product2.png" },
    { name: "White Hoodie", price: 3000, image: "/images/product3.png" },
  ]);
});

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
});
