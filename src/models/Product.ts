import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  user: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  date: Date;
  rating: number;
  location: string;
  specifications?: ISpecification[];
  reviews?: IReview[];
}

const ReviewSchema = new Schema<IReview>({
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const SpecificationSchema = new Schema<ISpecification>({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  date: { type: Date, required: false, default: Date.now },
  rating: { type: Number, required: true, default: 0 },
  location: { type: String, required: true },
  specifications: [SpecificationSchema],
  reviews: [ReviewSchema]
}, { timestamps: true });

// Check if model already exists to avoid recompilation errors in some environments
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
