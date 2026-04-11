import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/products.routes.js';
import { globalErrorHandler } from './middleware/errorHandler.js';

// Initialize the Express application
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests (crucial for POST/PUT requests)
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
const MONGO_URI = 'mongodb://localhost:27017/smart_buy_list';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Using products routes
app.use('/api/products', productRoutes);

// Centralized error handling middleware must be registered after routes.
app.use(globalErrorHandler);

 
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});