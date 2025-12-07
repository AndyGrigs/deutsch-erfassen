const { supabase } = require('../config/db');

// Ingredient model functions for Supabase
const Ingredient = {
  // Create a new ingredient
  async create(ingredientData) {
    const { data, error } = await supabase
      .from('ingredients')
      .insert([ingredientData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find all ingredients
  async findAll() {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find ingredient by ID
  async findById(id) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Find ingredient by title
  async findByTitle(title) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .ilike('title', title)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Update ingredient by ID
  async updateById(id, updateData) {
    const { data, error } = await supabase
      .from('ingredients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Delete ingredient by ID
  async deleteById(id) {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Ingredient deleted successfully' };
  }
};

module.exports = { Ingredient };