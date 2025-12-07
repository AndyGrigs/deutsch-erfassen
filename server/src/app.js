const app = require('./server');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/deutsch_erfassen';

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Database connection successful');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error.message);
    process.exit(1);
  });