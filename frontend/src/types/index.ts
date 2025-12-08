// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  avatarURL?: string;
  recipesCount?: number;
  favoritesCount?: number;
  followersCount?: number;
  followingCount?: number;
}

export interface AuthResponse {
  status: string;
  code: number;
  data: {
    token: string;
    user: User;
  };
}

// Recipe Types
export interface Ingredient {
  id: string;
  title: string;
  measure: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  area: string;
  instructions: string;
  time: number;
  image: string;
  thumb: string;
  video?: string;
  popularity: number;
  ingredients: Ingredient[];
  user: {
    name: string;
    email: string;
    avatarURL?: string;
  };
  owner?: string;
}

export interface RecipesResponse {
  status: string;
  code: number;
  data: {
    recipes: Recipe[];
    total?: number;
    page?: number;
    totalPages?: number;
  };
}

export interface SingleRecipeResponse {
  status: string;
  code: number;
  data: {
    recipe: Recipe;
  };
}

// Category, Area, Ingredient Types
export interface Category {
  id: string;
  name: string;
}

export interface Area {
  id: string;
  name: string;
}

export interface IngredientOption {
  id: string;
  title: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  position: string;
  comment: string;
  avatar_url: string;
}

// API Error Type
export interface ApiError {
  status: string;
  code: number;
  message: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface CreateRecipeFormData {
  title: string;
  description: string;
  category: string;
  area: string;
  instructions: string;
  time: number;
  ingredients: Ingredient[];
  image?: File;
  thumb?: File;
  video?: string;
}

// Pagination & Filters
export interface RecipeFilters {
  category?: string;
  ingredient?: string;
  area?: string;
  page?: number;
  limit?: number;
}