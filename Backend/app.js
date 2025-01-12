const express = require("express");
const app = express();


if(process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "backend/config/.env",
    });
};

app.get('/', (req, res) => {
    return res.send('Welcome to backend');
  });

module.exports = app;