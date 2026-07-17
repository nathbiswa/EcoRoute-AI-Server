import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, price, date, location, image } = req.body;
        
        // Basic validation
        if (!title || !description || !price || !location || !image) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const newProduct = new Product({
            title,
            description,
            price: Number(price),
            date: date ? new Date(date) : new Date(),
            location,
            image,
            rating: 5, // Default rating for new products
            images: [image], // By default main image is also in gallery
            reviews: [],
            specifications: []
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error: any) {
        console.error("Error creating product:", error);
        // Surface Mongoose validation errors clearly
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e: any) => e.message);
            res.status(400).json({ error: `Validation failed: ${messages.join(', ')}` });
            return;
        }
        res.status(500).json({ error: "Failed to create product" });
    }
};

// @desc    Fetch all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { search, location, minPrice, maxPrice, sort, page = '1', limit = '12' } = req.query;
        
        let query: any = {};
        
        if (search) {
            query.title = { $regex: search as string, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location as string, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        let sortOption: any = {};
        if (sort === 'price_asc') sortOption.price = 1;
        else if (sort === 'price_desc') sortOption.price = -1;
        else if (sort === 'rating_desc') sortOption.rating = -1;
        else if (sort === 'newest') sortOption.date = -1;
        else sortOption.date = -1; // Default
        
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;
        
        const products = await Product.find(query).sort(sortOption).skip(skip).limit(limitNum);
        const total = await Product.countDocuments(query);
        
        res.json({
            products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ error: "Failed to fetch product details" });
    }
};
