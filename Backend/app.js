const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const ErrorHandler = require('./middleware/error');
const path = require('path');
const cookieParser = require("cookie-parser");
const fs = require('fs');

const app = express();

app.use(cookieParser()); 

// Create upload directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const productsDir = path.join(__dirname, 'products');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

// Built-in middleware for parsing JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Configure CORS to allow requests from React frontend
app.use(cors({
    origin: 'https://ecom-code-along.vercel.app',
    credentials: true 
  }));

// Serve static files BEFORE route handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products', express.static(path.join(__dirname, 'products')));

// Import Routes
const user = require('./controller/user');
const product = require('./controller/product');
const orders = require('./controller/order');

// Route Handling
app.use("/api/v2/user", user);
app.use("/api/v2/product", product);
app.use("/api/v2/orders", orders);

// Add a route to check if the server is running
app.get('/api/v2/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;