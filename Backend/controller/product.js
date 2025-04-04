const express = require('express');
const mongoose = require('mongoose');
const Product = require('../model/product');
const User = require('../model/user');
const router = express.Router();
const { pupload } = require("../multer");
const path = require('path');
const { isAuthenticatedUser } = require('../middleware/auth');

const validateProductData = (data) => {
    const errors = [];

    if (!data.name) errors.push('Product name is required');
    if (!data.description) errors.push('Product description is required');
    if (!data.category) errors.push('Product category is required');
    if (!data.price || isNaN(data.price) || data.price <= 0) errors.push('Valid product price is required');
    if (!data.stock || isNaN(data.stock) || data.stock < 0) errors.push('Valid product stock is required');
    if (!data.email) errors.push('Email is required');

    return errors;
};

// 1) Create a product
router.post('/create-product',isAuthenticatedUser, pupload.array('images', 10), async (req, res) => {

    const { name, description, category, tags, price, stock, email } = req.body;
    const images = req.files.map((file) => {
        return `/products/${file.filename}`;
    });

    const validationErrors = validateProductData({ name, description, category, price, stock, email });
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    if (images.length === 0) {
        return res.status(400).json({ error: 'At least one image is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email does not exist in the users database' });
        }

        const newProduct = new Product({
            name,
            description,
            category,
            tags,
            price,
            stock,
            email,
            images,
        });

        await newProduct.save();

        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Could not create product.' });
    }
});

//2) Route: Get all products
router.get('/get-products',isAuthenticatedUser, async (req, res) => {
    try {
        const products = await Product.find();
        const productsWithFullImageUrl = products.map(product => {
            if (product.images && product.images.length > 0) {
                product.images = product.images.map(imagePath => {
                    // Image URLs are already prefixed with /products
                    return imagePath.replace(/\\/g, '/')
                });
            }
            return product;
        });
        res.status(200).json({ products: productsWithFullImageUrl });
        
       // res.status(200).json({ products: products });
    } catch (err) {
        console.error(' Server error:', err);
        res.status(500).json({ error: 'Server error. Could not fetch products.' });
    }
});

// 3) Get my products
router.get('/my-products',isAuthenticatedUser, async (req, res) => {
    const { email } = req.query;
    try {
        const products = await Product.find({ email });
        const productsWithFullImageUrl = products.map(product => {
            if (product.images && product.images.length > 0) {
                product.images = product.images.map(imagePath => {
                    return imagePath.replace(/\\/g, '/')
                });
            }
            return product;
        });
        res.status(200).json({ products: productsWithFullImageUrl });
        // const productsWithFullImageUrl = products.map(product => {
        //     if (product.images && product.images.length > 0) {
        //         product.images = product.images.map((image) => `${image}`);
        //         // product.images = product.images.map((file) => {
        //         //     return `/products/${file.filename}`;
        //        // });
        //     }
        //     return product;
        // });
       // res.status(200).json({ products: products });
    } catch (err) {
        console.error(' Server error:', err);
        res.status(500).json({ error: 'Server error. Could not fetch products.' });
    }
}
);

// 4) Get product by ID
router.get('/product/:id',isAuthenticatedUser, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.status(200).json({ product });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error. Could not fetch product.' });
    }
});

// 5) Update product
router.put('/update-product/:id',isAuthenticatedUser, pupload.array('images', 10), async (req, res) => {
    const { id } = req.params;
    const { name, description, category, tags, price, stock, email } = req.body;

    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        let updatedImages = existingProduct.images;
        if (req.files || req.files.length > 0) {
            updatedImages = req.files.map((file) => {
                return `/products/${path.basename(file.path)}`;
            });
        }

        const validationErrors = validateProductData({
            name,
            description,
            category,
            price,
            stock,
            email,
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        existingProduct.name = name;
        existingProduct.description = description;
        existingProduct.category = category;
        existingProduct.tags = tags;
        existingProduct.price = price;
        existingProduct.stock = stock;
        existingProduct.email = email;
        existingProduct.images = updatedImages;

        await existingProduct.save();

        res.status(200).json({
            message: '✅ Product updated successfully',
            product: existingProduct,
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error. Could not update product.' });
    }
});

// 6) Delete product
router.delete('/delete-product/:id',isAuthenticatedUser, async (req, res) => {
    const { id } = req.params;

    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        await existingProduct.deleteOne();
        res.status(200).json({ message: '✅ Product deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error. Could not delete product.' });
    }
});

// 7) Add to cart
router.post('/cart',isAuthenticatedUser, async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const email = userId;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            //Uses Mongoose to verify whether productId is a valid MongoDB ObjectId.
            return res.status(400).json({ message: 'Invalid productId' });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(productId);
        //Searches for the product by its productId using findById.
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cartItemIndex = user.cart.findIndex(
            //user.cart is assumed to be an array of objects, where each object represents a cart item.
            //The .findIndex() method checks if a product with the given productId already exists in the user's cart.

            (item) => item.productId.toString() === productId
            //item.productId.toString() === productId converts productId to a string for a proper comparison.
        );


        if (cartItemIndex > -1) {
            user.cart[cartItemIndex].quantity += quantity;
            // If the product already exists in the cart (cartItemIndex > -1), its quantity is increased.
        } else {
            user.cart.push({ productId, quantity });
            //If the product is not in the cart, a new cart item { productId, quantity } is added.
        }


        await user.save();
        //Saves the modified user document (with the updated cart) back to the database.

        res.status(200).json({
            message: 'Cart updated successfully',
            cart: user.cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 8) Get cart details
// GET cart details endpoint
router.get('/cartproducts',isAuthenticatedUser, async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email query parameter is required' });
        }
        const user = await User.findOne({ email }).populate({
            path: 'cart.productId',
            model: 'Product'
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart: user.cart
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// 9) Update cart quantity
router.put('/cartproduct/quantity',isAuthenticatedUser, async (req, res) => {
    const { email, productId, quantity } = req.body;
    console.log("Updating cart product quantity");

    if (!email || !productId || quantity === undefined) {
        return res.status(400).json({ error: 'Email, productId, and quantity are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cartProduct = user.cart.find(item => item.productId.toString() === productId);
        if (!cartProduct) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        cartProduct.quantity = quantity;
        await user.save();

        res.status(200).json({
            message: 'Cart product quantity updated successfully',
            cart: user.cart
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;