import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.routes.js';
import listRoutes from './routes/lists.routes.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import prisma from './utils/prisma.js';

// Initialize the Express application
const app = express();
const PORT = 3001;

// Middleware to parse incoming JSON requests (crucial for POST/PUT requests)
app.use(cors());
app.use(express.json());

// Connect to MySQL using Prisma
prisma.$connect()
  .then(() => console.log('✅ Connected to MySQL via Prisma'))
  .catch((err: unknown) => console.error('❌ Prisma connection error:', err));

// Using products routes
app.use('/api/products', productRoutes);
app.use('/api/lists', listRoutes);

// Centralized error handling middleware must be registered after routes.
app.use(globalErrorHandler);

 
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});