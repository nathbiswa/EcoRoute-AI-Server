const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ReviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const SpecificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  images: [String],
  price: Number,
  date: Date,
  rating: Number,
  location: String,
  specifications: [SpecificationSchema],
  reviews: [ReviewSchema]
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const dummyData = [
  {
    title: "Eco-Friendly Cargo Ship Route",
    description: "An optimized autonomous shipping route that reduces carbon emissions by up to 20% compared to traditional pathways.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed74514f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8ed74514f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578330756778-d1a1b18d227c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    price: 4999,
    date: new Date(),
    rating: 4.8,
    location: "Pacific Ocean",
    specifications: [
      { key: "Vessel Type", value: "Panamax Cargo" },
      { key: "Fuel Source", value: "Bio-LNG Blend" },
      { key: "Carbon Reduction", value: "22%" },
      { key: "Duration", value: "14 Days" }
    ],
    reviews: [
      { user: "Sarah L.", rating: 5, comment: "Incredible efficiency and clear reporting on carbon savings." },
      { user: "Michael T.", rating: 4, comment: "Very good route optimization, though slight delay at port." }
    ]
  },
  {
    title: "Green AI Logistics Hub",
    description: "Cloud-based AI processing hub that intelligently groups and schedules container shipments to minimize idle wait times.",
    image: "https://images.unsplash.com/photo-1565891741441-64926e441838?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1565891741441-64926e441838?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    price: 12500,
    date: new Date(),
    rating: 4.9,
    location: "Rotterdam Port",
    specifications: [
      { key: "Data Processing", value: "1M+ routes/sec" },
      { key: "Uptime", value: "99.99%" },
      { key: "Integration", value: "REST API & GraphQL" }
    ],
    reviews: [
      { user: "Logistics Pro", rating: 5, comment: "Transformed our scheduling completely." }
    ]
  },
  {
    title: "Sustainable Freight Agent",
    description: "A subscription to our autonomous predictive model that adapts your global supply chain in real-time to avoid environmental hazards.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    price: 890,
    date: new Date(),
    rating: 4.7,
    location: "Global",
    specifications: [
      { key: "Access", value: "Annual Subscription" },
      { key: "Users", value: "Up to 50" },
      { key: "Support", value: "24/7 Priority" }
    ],
    reviews: []
  },
  {
    title: "Solar-Powered Tracking Beacons",
    description: "Zero-emission IoT devices attached to containers that provide real-time updates and feed data directly to our LLMs.",
    image: "https://images.unsplash.com/photo-1580977218683-9bc77dc76a59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580977218683-9bc77dc76a59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    price: 150,
    date: new Date(),
    rating: 4.6,
    location: "Singapore Port",
    specifications: [
      { key: "Battery Life", value: "Unlimited (Solar)" },
      { key: "Connectivity", value: "5G & Satellite" },
      { key: "Weight", value: "1.2 lbs" }
    ],
    reviews: [
      { user: "Tech Shipper", rating: 4, comment: "Great trackers, but occasionally lose signal in extreme weather." },
      { user: "EcoCorp", rating: 5, comment: "Love the solar capability. Zero maintenance." }
    ]
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
    console.log("Successfully inserted rich dummy products!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
