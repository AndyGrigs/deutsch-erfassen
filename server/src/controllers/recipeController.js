const { Recipe } = require('../models/Recipe');
const { User } = require('../models/User');
const HttpError = require('../helpers/HttpError');
const cloudinary = require('../config/cloudinary');

const getRecipes = async (req, res, next) => {
  try {
    const { category, ingredient, area, page = 1, limit = 12 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (ingredient) {
      filter.ingredients = { $elemMatch: { id: ingredient } };
    }
    
    if (area) {
      filter.area = area;
    }
    
    const recipes = await Recipe.find(filter)
      .populate('owner', 'name email avatarURL')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Recipe.countDocuments(filter);
    
    res.json({
      status: 'success',
      code: 200,
      data: {
        recipes,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    
    const recipe = await Recipe.findById(recipeId).populate('owner', 'name email avatarURL');
    
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
    
    const recipes = await Recipe.find()
      .populate('owner', 'name email avatarURL')
      .sort({ popularity: -1 })
      .limit(Number(limit));
    
    res.json({
      status: 'success',
      code: 200,
      data: {
        recipes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createRecipe = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    
    // Upload images to Cloudinary if they exist
    let image = req.body.image;
    let thumb = req.body.thumb;
    const { video } = req.body;
    
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
      ...req.body,
      owner,
      image,
      thumb,
      video,
    });
    
    // Update user's recipe count
    await User.findByIdAndUpdate(
      owner,
      { $inc: { recipesCount: 1 } }
    );
    
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
    const { _id: userId } = req.user;
    
    const recipe = await Recipe.findOneAndDelete({
      _id: recipeId,
      owner: userId,
    });
    
    if (!recipe) {
      throw HttpError(404, 'Recipe not found or access denied');
    }
    
    // Update user's recipe count
    await User.findByIdAndUpdate(
      userId,
      { $inc: { recipesCount: -1 } }
    );
    
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
    const { _id: userId } = req.user;
    
    const recipes = await Recipe.find({ owner: userId })
      .populate('owner', 'name email avatarURL');
    
    res.json({
      status: 'success',
      code: 200,
      data: {
        recipes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addToFavorites = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { _id: userId } = req.user;
    
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw HttpError(404, 'Recipe not found');
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $addToSet: { favorites: userId } },
      { new: true }
    ).populate('owner', 'name email avatarURL');
    
    // Update user's favorite count
    await User.findByIdAndUpdate(
      userId,
      { $inc: { favoritesCount: 1 } }
    );
    
    // Update recipe popularity
    await Recipe.findByIdAndUpdate(
      recipeId,
      { $inc: { popularity: 1 } }
    );
    
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
    const { _id: userId } = req.user;
    
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw HttpError(404, 'Recipe not found');
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $pull: { favorites: userId } },
      { new: true }
    ).populate('owner', 'name email avatarURL');
    
    // Update user's favorite count
    await User.findByIdAndUpdate(
      userId,
      { $inc: { favoritesCount: -1 } }
    );
    
    // Update recipe popularity
    await Recipe.findByIdAndUpdate(
      recipeId,
      { $inc: { popularity: -1 } }
    );
    
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
    const { _id: userId } = req.user;
    
    const recipes = await Recipe.find({ favorites: userId })
      .populate('owner', 'name email avatarURL');
    
    res.json({
      status: 'success',
      code: 200,
      data: {
        recipes,
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