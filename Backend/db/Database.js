if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({
      path: './config/.env',
    });
  }
  
  const mongoose = require('mongoose');
  
  const connectDatabase = () => {
    mongoose
      .connect(process.env.DB_URL)
      .then((data) => {
        console.log(
          `Database is connected Successfully: ${data.connection.host}`
        );
      })
      .catch((err) => {
      console.error(`Database connection failed: ${err.message}`);
      process.exit(1);
    });
  };
  
  module.exports = connectDatabase;