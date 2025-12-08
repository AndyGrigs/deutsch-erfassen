const { Recipe } = require('../models/Recipe');
const { User } = require('../models/User');
const HttpError = require('../helpers/HttpError');
const cloudinary = require('../config/cloudinary');

const getRecipes = async (req, res, next) => {
  try {
    const { category, ingredient, area, page = 1, limit = 12 } = req.query;

    // Call the updated method in the Recipe model with all filters
    const result = await Recipe.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      area,
      ingredient
    });

    res.json({
      status: 'success',
      code: 200,
      data: {
        recipes: result.data,
        total: result.total,
        page: result.page,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      throw HttpError(404, 'Recipe not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        recipe,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPopularRecipes = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const popularRecipes = await Recipe.getPopularRecipes(parseInt(limit));

    res.json({
      status: 'success',
      code: 200,
      data: {
        recipes: popularRecipes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createRecipe = async (req, res, next) => {
  try {
    const { id: owner_id } = req.user;

    // Upload images to Cloudinary if they exist
    let image = req.body.image;
    let thumb = req.body.thumb;
    const { video, title, description, category, area, instructions, time, ingredients } = req.body;

    if (req.files) {
      const imageFile = req.files.find(file => file.fieldname === 'image');
      const thumbFile = req.files.find(file => file.fieldname === 'thumb');

      if (imageFile) {
        const imageResult = await cloudinary.uploader.upload(imageFile.path, {
          folder: 'recipes',
        });
        image = imageResult.secure_url;
      }

      if (thumbFile) {
        const thumbResult = await cloudinary.uploader.upload(thumbFile.path, {
          folder: 'recipe_thumbs',
        });
        thumb = thumbResult.secure_url;
      }
    }

    const recipe = await Recipe.create({
      title,
      description,
      category,
      area,
      instructions,
      time: parseInt(time),
      image,
      thumb,
      video,
      owner: owner_id,
      ingredients: ingredients || [],
    });

    // Update user's recipe count
    await User.updateRecipesCount(owner_id, 1);

    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        recipe,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { id: userId } = req.user;

    // Check if the user owns the recipe before deleting
    const recipe = await Recipe.findById(recipeId);
    if (!recipe || recipe.owner_id !== userId) {
      throw HttpError(404, 'Recipe not found or access denied');
    }

    await Recipe.deleteById(recipeId);

    // Update user's recipe count
    await User.updateRecipesCount(userId, -1);

    res.json({
      status: 'success',
      code: 200,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getOwnRecipes = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const result = await Recipe.findByOwner(userId);

    res.json({
      status: 'success',
      code: 200,
      data: {
        recipes: result.data,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addToFavorites = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { id: userId } = req.user;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw HttpError(404, 'Recipe not found');
    }

    // Add to favorites using the Recipe model method
    await Recipe.addToFavorites(recipeId, userId);

    // Get the updated recipe
    const updatedRecipe = await Recipe.findById(recipeId);

    res.json({
      status: 'success',
      code: 200,
      data: {
        recipe: updatedRecipe,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeFromFavorites = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { id: userId } = req.user;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw HttpError(404, 'Recipe not found');
    }

    // Remove from favorites using the Recipe model method
    await Recipe.removeFromFavorites(recipeId, userId);

    // Get the updated recipe
    const updatedRecipe = await Recipe.findById(recipeId);

    res.json({
      status: 'success',
      code: 200,
      data: {
        recipe: updatedRecipe,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFavoriteRecipes = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { page = 1, limit = 12 } = req.query;

    const result = await Recipe.getFavoriteRecipes(userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      status: 'success',
      code: 200,
      data: {
        recipes: result.data,
        total: result.total,
        page: result.page,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  getPopularRecipes,
  createRecipe,
  deleteRecipe,
  getOwnRecipes,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes,
};