import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { createProductPublic, getProducts, getProductById, deleteProduct } from '../controllers/productController';

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private

router.post('/', createProductPublic);

// @route   GET /api/products
// @desc    Get all products (with filtering/sorting)
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   DELETE /api/products/:id
// @desc    Delete a single product by ID
// @access  Public
router.delete('/:id', deleteProduct);

export default router;
