// seed.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Transform MongoDB data to PostgreSQL format
function transformData(items, type = 'default') {
  return items.map(item => {
    const transformed = { ...item };

    // Remove MongoDB _id
    if (item._id) {
      delete transformed._id;
    }

    // Convert nested $oid references to plain strings
    Object.keys(transformed).forEach(key => {
      if (transformed[key] && transformed[key].$oid) {
        transformed[key] = transformed[key].$oid;
      }
    });

    // Type-specific transformations
    if (type === 'users') {
      // Remove followers/following arrays (handled by user_follows table)
      delete transformed.followers;
      delete transformed.following;

      // Rename avatar to avatar_url
      if (transformed.avatar !== undefined) {
        transformed.avatar_url = transformed.avatar;
        delete transformed.avatar;
      }

      // Add default password if missing (users will need to reset)
      if (!transformed.password) {
        transformed.password = '$2a$10$defaultHashedPassword'; // Placeholder
      }

      // Add default counts
      transformed.recipes_count = 0;
      transformed.favorites_count = 0;
      transformed.followers_count = 0;
      transformed.following_count = 0;

      // Remove MongoDB timestamps
      delete transformed.createdAt;
      delete transformed.updatedAt;
    }

    if (type === 'recipes') {
      // Rename owner to owner_id
      if (transformed.owner !== undefined) {
        transformed.owner_id = transformed.owner;
        delete transformed.owner;
      }

      // Remove MongoDB timestamps
      delete transformed.createdAt;
      delete transformed.updatedAt;

      // Convert time to integer
      if (transformed.time) {
        transformed.time = parseInt(transformed.time);
      }

      // Add default popularity
      if (!transformed.popularity) {
        transformed.popularity = 0;
      }

      // Handle image field - rename to match schema
      if (!transformed.image && transformed.thumb) {
        transformed.image = transformed.thumb;
      }

      // Remove ingredients array (will be inserted separately into recipe_ingredients table)
      delete transformed.ingredients;
    }

    if (type === 'testimonials') {
      // Remove owner field if exists
      delete transformed.owner;

      // Rename avatar to avatar_url
      if (transformed.avatar !== undefined) {
        transformed.avatar_url = transformed.avatar;
        delete transformed.avatar;
      }

      // Remove MongoDB timestamps
      delete transformed.createdAt;
      delete transformed.updatedAt;
    }

    // Remove MongoDB timestamps for all types
    delete transformed.createdAt;
    delete transformed.updatedAt;
    delete transformed.__v;

    return transformed;
  });
}

async function seedDatabase() {
  try {
    // Read JSON files
    const categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
    const areas = JSON.parse(fs.readFileSync('./data/areas.json', 'utf8'));
    const ingredients = JSON.parse(fs.readFileSync('./data/ingredients.json', 'utf8'));
    const testimonials = JSON.parse(fs.readFileSync('./data/testimonials.json', 'utf8'));
    const recipes = JSON.parse(fs.readFileSync('./data/recipes.json', 'utf8'));
    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

    // Transform all data with specific types
    const transformedCategories = transformData(categories, 'categories');
    const transformedAreas = transformData(areas, 'areas');
    const transformedIngredients = transformData(ingredients, 'ingredients');
    const transformedTestimonials = transformData(testimonials, 'testimonials');
    const transformedUsers = transformData(users, 'users');
    const transformedRecipes = transformData(recipes, 'recipes');
    // Insert categories
    console.log('Inserting categories...');
    const { error: catError } = await supabase
      .from('categories')
      .insert(transformedCategories);
    if (catError) console.error('Categories error:', catError);

    // Insert areas
    console.log('Inserting areas...');
    const { error: areaError } = await supabase
      .from('areas')
      .insert(transformedAreas);
    if (areaError) console.error('Areas error:', areaError);

    // Insert ingredients
    console.log('Inserting ingredients...');
    const { error: ingError } = await supabase
      .from('ingredients')
      .insert(transformedIngredients);
    if (ingError) console.error('Ingredients error:', ingError);

    // Insert testimonials
    console.log('Inserting testimonials...');
    const { error: testError } = await supabase
      .from('testimonials')
      .insert(transformedTestimonials);
    if (testError) console.error('Testimonials error:', testError);

    // Insert users (without recipes first)
    console.log('Inserting users...');
    const { error: usersError } = await supabase
      .from('users')
      .insert(transformedUsers);
    if (usersError) console.error('Users error:', usersError);

    // Insert recipes
    console.log('Inserting recipes...');
    const { error: recipesError } = await supabase
      .from('recipes')
      .insert(transformedRecipes);
    if (recipesError) console.error('Recipes error:', recipesError);
    
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();