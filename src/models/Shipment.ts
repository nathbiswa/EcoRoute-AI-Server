import { Schema, model } from 'mongoose';

const ShipmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  origin: String,
  destination: String,
  weight: Number,
  category: String, // e.g., Perishable, Industrial
  carbonScore: Number,
  aiSuggestions: [String],
  status: { type: String, enum: ['Pending', 'Optimized', 'Delivered'], default: 'Pending' }
}, { timestamps: true });

export const Shipment = model('Shipment', ShipmentSchema);