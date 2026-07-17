const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  date: Date,
  rating: Number,
  location: String
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const dummyData = [
  {
    title: "Eco-Friendly Cargo Ship Route",
    description: "An optimized autonomous shipping route that reduces carbon emissions by up to 20% compared to traditional pathways.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed74514f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 4999,
    date: new Date(),
    rating: 4.8,
    location: "Pacific Ocean"
  },
  {
    title: "Green AI Logistics Hub",
    description: "Cloud-based AI processing hub that intelligently groups and schedules container shipments to minimize idle wait times.",
    image: "https://images.unsplash.com/photo-1565891741441-64926e441838?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 12500,
    date: new Date(),
    rating: 4.9,
    location: "Rotterdam Port"
  },
  {
    title: "Sustainable Freight Agent",
    description: "A subscription to our autonomous predictive model that adapts your global supply chain in real-time to avoid environmental hazards.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 890,
    date: new Date(),
    rating: 4.7,
    location: "Global"
  },
  {
    title: "Solar-Powered Tracking Beacons",
    description: "Zero-emission IoT devices attached to containers that provide real-time updates and feed data directly to our LLMs.",
    image: "https://images.unsplash.com/photo-1580977218683-9bc77dc76a59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 150,
    date: new Date(),
    rating: 4.6,
    location: "Singapore Port"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Clear existing data (optional, but good for resetting)
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    // Insert new data
    await Product.insertMany(dummyData);
    console.log("Successfully inserted dummy products!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
