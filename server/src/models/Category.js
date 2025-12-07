const { supabase } = require('../config/db');

// Category model functions for Supabase
const Category = {
  // Create a new category
  async create(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find all categories
  async findAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find category by ID
  async findById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Find category by name
  async findByName(name) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .ilike('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Update category by ID
  async updateById(id, updateData) {
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Delete category by ID
  async deleteById(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Category deleted successfully' };
  }
};

module.exports = { Category };