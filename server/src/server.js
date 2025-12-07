const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const areaRoutes = require('./routes/areas');
const ingredientRoutes = require('./routes/ingredients');
const testimonialRoutes = require('./routes/testimonials');
const recipeRoutes = require('./routes/recipes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/recipes', recipeRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not Found'
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    message: message
  });
});

module.exports = app;