const express = require('express');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authenticate');
const {
  getRecipes,
  getRecipeById,
  getPopularRecipes,
  createRecipe,
  deleteRecipe,
  getOwnRecipes,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes,
} = require('../controllers/recipeController');

const router = express.Router();

// Set up multer for recipe image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/recipes/');
    } else if (file.fieldname === 'thumb') {
      cb(null, 'uploads/recipe_thumbs/');
    } else {
      cb(null, 'uploads/recipes/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'recipe-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

// Public routes
router.get('/', getRecipes);
router.get('/popular', getPopularRecipes);
router.get('/:recipeId', getRecipeById);

// Private routes
router.post('/', authenticate, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'thumb', maxCount: 1 }]), createRecipe);
router.delete('/:recipeId', authenticate, deleteRecipe);
router.get('/own', authenticate, getOwnRecipes);
router.post('/favorites/:recipeId', authenticate, addToFavorites);
router.delete('/favorites/:recipeId', authenticate, removeFromFavorites);
router.get('/favorites', authenticate, getFavoriteRecipes);

module.exports = router;