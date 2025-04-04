const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const ErrorHandler = require('./middleware/error');
const product = require('./controller/product');
const path = require('path');
const cookieParser = require("cookie-parser");


const app = express();

// Built-in middleware for parsing JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));


// Configure CORS to allow requests from React frontend
app.use(cors({
    origin: 'http://localhost:3000', // Update this if your frontend is hosted elsewhere
    credentials: true, // Enable if you need to send cookies or authentication headers
  }));


// Import Routes
const userRoutes = require("./controller/user");
const productRoutes = require('./controller/product');
const orders = require('./controller/orders');

// Route Handling
app.use("/api/v2/user",user);
app.use("/api/v2/product", product);
app.use("/api/v2/orders", orders); // In milestone_26


// Serve static files for uploads and products
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // In milestone_26
app.use('/products' ,express.static(path.join(__dirname, 'products')));

// Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;