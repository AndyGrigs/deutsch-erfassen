const { supabase } = require('../config/db');

// Testimonial model functions for Supabase
const Testimonial = {
  // Create a new testimonial
  async create(testimonialData) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find all testimonials
  async findAll() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find testimonial by ID
  async findById(id) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Update testimonial by ID
  async updateById(id, updateData) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Delete testimonial by ID
  async deleteById(id) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Testimonial deleted successfully' };
  }
};

module.exports = { Testimonial };