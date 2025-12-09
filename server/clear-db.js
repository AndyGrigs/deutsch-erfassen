// clear-db.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearDatabase() {
  try {
    console.log('🗑️  Clearing database...');

    // Delete in reverse order (to respect foreign keys)
    console.log('Deleting recipe_favorites...');
    await supabase.from('recipe_favorites').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting recipe_ingredients...');
    await supabase.from('recipe_ingredients').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting user_follows...');
    await supabase.from('user_follows').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting recipes...');
    await supabase.from('recipes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting users...');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting testimonials...');
    await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting ingredients...');
    await supabase.from('ingredients').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting areas...');
    await supabase.from('areas').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Deleting categories...');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

clearDatabase();
