const { supabase } = require('../config/db');

// Recipe model functions for Supabase
const Recipe = {
  // Create a new recipe
  async create(recipeData) {
    const { data, error } = await supabase
      .from('recipes')
      .insert([{
        title: recipeData.title,
        description: recipeData.description,
        category: recipeData.category,
        area: recipeData.area,
        instructions: recipeData.instructions,
        time: recipeData.time,
        image: recipeData.image,
        thumb: recipeData.thumb,
        video: recipeData.video,
        owner_id: recipeData.owner,
        ingredients: recipeData.ingredients || [] // Store as JSON
      }])
      .select('*, user:users(email, name)')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Add ingredients to the junction table
    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      const ingredientPromises = recipeData.ingredients.map(ingredient => 
        supabase
          .from('recipe_ingredients')
          .insert([{
            recipe_id: data.id,
            ingredient_id: ingredient.id,
            measure: ingredient.measure
          }])
      );
      
      await Promise.all(ingredientPromises);
    }

    return data;
  },

  // Find recipe by ID
  async findById(id) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        user:users(email, name),
        recipe_ingredients (
          ingredients (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    // Format ingredients to match the original structure
    if (data.recipe_ingredients && data.recipe_ingredients.length > 0) {
      data.ingredients = data.recipe_ingredients.map(ri => ({
        id: ri.ingredients.id,
        title: ri.ingredients.title,
        measure: ri.measure
      }));
      delete data.recipe_ingredients;
    } else {
      data.ingredients = [];
    }

    return data;
  },

  // Find all recipes with pagination
  async findAll({ page = 1, limit = 10, category = null, area = null } = {}) {
    let query = supabase
      .from('recipes')
      .select(`
        *,
        user:users(email, name),
        recipe_ingredients (
          ingredients (*)
        )
      `, { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1);

    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    if (area) {
      query = query.ilike('area', `%${area}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Format ingredients for each recipe
    const formattedData = data.map(recipe => {
      if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
        recipe.ingredients = recipe.recipe_ingredients.map(ri => ({
          id: ri.ingredients.id,
          title: ri.ingredients.title,
          measure: ri.measure
        }));
      } else {
        recipe.ingredients = [];
      }
      delete recipe.recipe_ingredients;
      return recipe;
    });

    return { data: formattedData, total: count, page, limit };
  },

  // Find recipes by owner
  async findByOwner(ownerId, { page = 1, limit = 10 } = {}) {
    const { data, error, count } = await supabase
      .from('recipes')
      .select(`
        *,
        user:users(email, name),
        recipe_ingredients (
          ingredients (*)
        )
      `, { count: 'exact' })
      .eq('owner_id', ownerId)
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Format ingredients for each recipe
    const formattedData = data.map(recipe => {
      if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
        recipe.ingredients = recipe.recipe_ingredients.map(ri => ({
          id: ri.ingredients.id,
          title: ri.ingredients.title,
          measure: ri.measure
        }));
      } else {
        recipe.ingredients = [];
      }
      delete recipe.recipe_ingredients;
      return recipe;
    });

    return { data: formattedData, total: count, page, limit };
  },

  // Update recipe by ID
  async updateById(id, updateData) {
    const { data, error } = await supabase
      .from('recipes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Delete recipe by ID
  async deleteById(id) {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Recipe deleted successfully' };
  },

  // Update recipe popularity
  async updatePopularity(id, increment = 1) {
    const recipe = await this.findById(id);
    if (!recipe) return null;
    
    const newPopularity = Math.max(0, recipe.popularity + increment);
    return await this.updateById(id, { popularity: newPopularity });
  },

  // Add recipe to user's favorites
  async addToFavorites(recipeId, userId) {
    const { error } = await supabase
      .from('recipe_favorites')
      .insert([{ recipe_id: recipeId, user_id: userId }]);

    if (error && error.code !== '23505') { // Ignore duplicate key error
      throw new Error(error.message);
    }

    // Update favorites count for the recipe owner
    const recipe = await this.findById(recipeId);
    if (recipe) {
      const user = require('./User').User;
      await user.updateFavoritesCount(recipe.owner_id, 1);
    }

    return { message: 'Recipe added to favorites' };
  },

  // Remove recipe from user's favorites
  async removeFromFavorites(recipeId, userId) {
    const { error } = await supabase
      .from('recipe_favorites')
      .delete()
      .match({ recipe_id: recipeId, user_id: userId });

    if (error) {
      throw new Error(error.message);
    }

    // Update favorites count for the recipe owner
    const recipe = await this.findById(recipeId);
    if (recipe) {
      const user = require('./User').User;
      await user.updateFavoritesCount(recipe.owner_id, -1);
    }

    return { message: 'Recipe removed from favorites' };
  },
  
  // Check if recipe is in user's favorites
  async isFavorite(recipeId, userId) {
    const { data, error } = await supabase
      .from('recipe_favorites')
      .select('id')
      .match({ recipe_id: recipeId, user_id: userId })
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw new Error(error.message);
    }

    return !!data;
  }
};

module.exports = { Recipe };