const { supabase } = require('../config/db');

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

// User model functions for Supabase
const User = {
  // Create a new user
  async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        password: userData.password,
        email: userData.email,
        name: userData.name,
        subscription: userData.subscription || 'starter',
        avatar_url: userData.avatarURL || null,
        recipes_count: 0,
        favorites_count: 0,
        followers_count: 0,
        following_count: 0
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Find user by email
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Find user by ID
  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(error.message);
    }

    return data;
  },

  // Update user by ID
  async updateById(id, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Update user token
  async updateToken(userId, token) {
    const { data, error } = await supabase
      .from('users')
      .update({ token: token || null })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Delete user token
  async deleteToken(userId) {
    const { data, error } = await supabase
      .from('users')
      .update({ token: null })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Update avatar URL
  async updateAvatar(userId, avatarURL) {
    const { data, error } = await supabase
      .from('users')
      .update({ avatar_url: avatarURL })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Update recipes count
  async updateRecipesCount(userId, increment = 1) {
    const user = await this.findById(userId);
    if (!user) return null;
    
    const newCount = Math.max(0, user.recipes_count + increment);
    return await this.updateById(userId, { recipes_count: newCount });
  },
  
  // Update favorites count
  async updateFavoritesCount(userId, increment = 1) {
    const user = await this.findById(userId);
    if (!user) return null;
    
    const newCount = Math.max(0, user.favorites_count + increment);
    return await this.updateById(userId, { favorites_count: newCount });
  },
  
  // Update followers count
  async updateFollowersCount(userId, increment = 1) {
    const user = await this.findById(userId);
    if (!user) return null;
    
    const newCount = Math.max(0, user.followers_count + increment);
    return await this.updateById(userId, { followers_count: newCount });
  },
  
  // Update following count
  async updateFollowingCount(userId, increment = 1) {
    const user = await this.findById(userId);
    if (!user) return null;
    
    const newCount = Math.max(0, user.following_count + increment);
    return await this.updateById(userId, { following_count: newCount });
  }
};

module.exports = { User };