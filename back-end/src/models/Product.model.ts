import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  bought: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    trim: true
  },
  bought: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

const Product = model<IProduct>('Product', productSchema);
export default Product;