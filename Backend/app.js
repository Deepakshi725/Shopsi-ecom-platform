const express = require("express");
const app = express();
const user = require("./controller/user");
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const cors = require('cors');
const errorHandler = require('./middleware/error');
const product = require('./controller/product');
const path = require('path');
const orders = require('./controller/order');// In milestone_26

app.use(errorHandler);


app.use(express.json()); // Built-in middleware for parsing JSON
app.use(express.urlencoded({ extended: true }));

// Use CORS middleware
app.use(cors());



// Route Handling
app.use("/api/v2/user",user);
app.use("/api/v2/product", product);
app.use("/api/v2/orders", orders); // In milestone_26


// Serve static files for uploads and products
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // In milestone_26
app.use('/products' ,express.static(path.join(__dirname, 'products')));




if(process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "backend/config/.env",
    });
};

app.get('/', (_req, res) => {
    return res.send('Welcome to backend');
  });



module.exports = app;