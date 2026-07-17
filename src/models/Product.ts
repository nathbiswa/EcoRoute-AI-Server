import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  date: Date;
  rating: number;
  location: string;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  rating: { type: Number, required: true, default: 0 },
  location: { type: String, required: true },
}, { timestamps: true });

// Check if model already exists to avoid recompilation errors in some environments
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
