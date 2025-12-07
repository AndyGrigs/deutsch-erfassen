const { supabase } = require('../config/db');

// Area model functions for Supabase
const Area = {
  // Create a new area
  async create(areaData) {
    const { data, error } = await supabase
      .from('areas')
      .insert([areaData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find all areas
  async findAll() {
    const { data, error } = await supabase
      .from('areas')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find area by ID
  async findById(id) {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Find area by name
  async findByName(name) {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .ilike('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Update area by ID
  async updateById(id, updateData) {
    const { data, error } = await supabase
      .from('areas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Delete area by ID
  async deleteById(id) {
    const { error } = await supabase
      .from('areas')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Area deleted successfully' };
  }
};

module.exports = { Area };