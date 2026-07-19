import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import Product from './models/Product';

// Initialize configuration
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Production Vercel URL — set CLIENT_URL in server .env
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., Postman, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// ======= ROUTES =======   
import productRoutes from './routes/productRoutes';
import aiRoutes from './routes/aiRoutes';

app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);

// ======= PUBLIC TEST ROUTE (no JWT) =======
// Use this to verify MongoDB saves work. Remove after debugging.
app.post('/api/test-add', async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, price, location, image } = req.body;
        const doc = new Product({
            title: title || 'Test Item',
            description: description || 'Test description',
            price: Number(price) || 100,
            date: new Date(),
            location: location || 'Test City',
            image: image || 'https://via.placeholder.com/400',
            rating: 5,
            images: [image || 'https://via.placeholder.com/400'],
            reviews: [],
            specifications: []
        });
        const saved = await doc.save();
        console.log('✅ Test item saved:', saved._id);
        res.status(201).json({ success: true, id: saved._id, item: saved });
    } catch (error: any) {
        console.error('❌ Test save failed:', error);
        res.status(500).json({ error: error.message, details: error });
    }
});

// Basic Route for Testing
app.get('/', (req: Request, res: Response) => {
  res.send('EcoRoute AI Server is Running 🌿');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});