# API Routes Documentation for Frontend Integration

## Base URL
`http://localhost:3000/api`

---

## Authentication Routes

### User Registration
- **POST** `/auth/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password",
    "name": "User Name"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "code": 201,
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name"
      }
    }
  }
  ```

### User Login
- **POST** `/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name"
      }
    }
  }
  ```

### User Logout
- **POST** `/auth/logout`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**: `204 No Content`

---

## User Routes

### Get Current User
- **GET** `/users/current`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "user": {
        "id": "user_id",
        "avatar": "avatar_url",
        "name": "User Name",
        "email": "user@example.com",
        "recipesCount": 5,
        "favoritesCount": 3,
        "followersCount": 10,
        "followingCount": 8
      }
    }
  }
  ```

### Get Other User
- **GET** `/users/{userId}`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "user": {
        "id": "user_id",
        "avatar": "avatar_url",
        "name": "User Name",
        "email": "user@example.com",
        "recipesCount": 5,
        "followersCount": 10
      }
    }
  }
  ```

### Update Avatar
- **PATCH** `/users/avatar`
- **Headers**: `Authorization: Bearer {jwt_token}`, `Content-Type: multipart/form-data`
- **FormData**: 
  ```javascript
  const formData = new FormData();
  formData.append('avatar', fileInput.files[0]);
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "user": {
        "email": "user@example.com",
        "avatar": "avatar_url"
      }
    }
  }
  ```

### Get User's Followers
- **GET** `/users/followers`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "followers": [
        {
          "avatarURL": "avatar_url",
          "name": "Follower Name",
          "email": "follower@example.com"
        }
      ]
    }
  }
  ```

### Get Following Users
- **GET** `/users/following`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "following": [
        {
          "avatarURL": "avatar_url",
          "name": "Following Name",
          "email": "following@example.com"
        }
      ]
    }
  }
  ```

### Follow a User
- **POST** `/users/{userId}/follow`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "message": "Successfully followed user"
  }
  ```

### Unfollow a User
- **DELETE** `/users/{userId}/unfollow`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "message": "Successfully unfollowed user"
  }
  ```

---

## Recipe Routes

### Get All Recipes
- **GET** `/recipes`
- **Query Parameters**:
  - `category` (optional): Filter by recipe category
  - `ingredient` (optional): Filter by ingredient ID
  - `area` (optional): Filter by area
  - `page` (optional, default: 1): Page number
  - `limit` (optional, default: 12): Items per page
- **Headers**: `Authorization: Bearer {jwt_token}` (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "recipes": [
        {
          "id": "recipe_id",
          "title": "Recipe Title",
          "description": "Recipe description",
          "category": "Main Course",
          "area": "American",
          "instructions": "Recipe instructions...",
          "time": 45,
          "image": "image_url",
          "thumb": "thumbnail_url",
          "video": "video_url",
          "popularity": 10,
          "ingredients": [
            {
              "id": "ingredient_id",
              "title": "Ingredient Name",
              "measure": "1 cup"
            }
          ],
          "user": {
            "name": "User Name",
            "email": "user@example.com",
            "avatarURL": "avatar_url"
          }
        }
      ],
      "total": 100,
      "page": 1,
      "totalPages": 9
    }
  }
  ```

### Get Recipe by ID
- **GET** `/recipes/{recipeId}`
- **Headers**: `Authorization: Bearer {jwt_token}` (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "recipe": {
        "id": "recipe_id",
        "title": "Recipe Title",
        "description": "Recipe description",
        "category": "Main Course",
        "area": "American",
        "instructions": "Recipe instructions...",
        "time": 45,
        "image": "image_url",
        "thumb": "thumbnail_url",
        "video": "video_url",
        "popularity": 10,
        "ingredients": [
          {
            "id": "ingredient_id",
            "title": "Ingredient Name",
            "measure": "1 cup"
          }
        ],
        "user": {
          "name": "User Name",
          "email": "user@example.com",
          "avatarURL": "avatar_url"
        }
      }
    }
  }
  ```

### Get Popular Recipes
- **GET** `/recipes/popular`
- **Query Parameters**:
  - `limit` (optional, default: 10): Number of recipes to return
- **Headers**: `Authorization: Bearer {jwt_token}` (optional)
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "recipes": [
        {
          "id": "recipe_id",
          "title": "Recipe Title",
          "description": "Recipe description",
          "category": "Main Course",
          "area": "American",
          "instructions": "Recipe instructions...",
          "time": 45,
          "image": "image_url",
          "thumb": "thumbnail_url",
          "video": "video_url",
          "popularity": 10,
          "ingredients": [...],
          "user": {...}
        }
      ]
    }
  }
  ```

### Create Recipe
- **POST** `/recipes`
- **Headers**: `Authorization: Bearer {jwt_token}`, `Content-Type: multipart/form-data` (if uploading images) or `application/json` (if just sending JSON)
- **FormData** (for image uploads):
  ```javascript
  const formData = new FormData();
  formData.append('title', 'Recipe Title');
  formData.append('description', 'Recipe description');
  formData.append('category', 'Main Course');
  formData.append('area', 'American');
  formData.append('instructions', 'Recipe instructions...');
  formData.append('time', 45);
  formData.append('ingredients', JSON.stringify([{ id: '1', title: 'Ingredient', measure: '1 cup' }]));
  formData.append('image', imageFile);
  formData.append('thumb', thumbFile);
  formData.append('video', 'video_url'); // optional
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "code": 201,
    "data": {
      "recipe": {
        "id": "recipe_id",
        "title": "Recipe Title",
        "description": "Recipe description",
        "category": "Main Course",
        "area": "American",
        "instructions": "Recipe instructions...",
        "time": 45,
        "image": "image_url",
        "thumb": "thumbnail_url",
        "video": "video_url",
        "popularity": 0,
        "owner": "user_id",
        "ingredients": [
          {
            "id": "1",
            "title": "Ingredient",
            "measure": "1 cup"
          }
        ]
      }
    }
  }
  ```

### Delete Recipe
- **DELETE** `/recipes/{recipeId}`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "message": "Recipe deleted successfully"
  }
  ```

### Get User's Recipes
- **GET** `/recipes/own`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "recipes": [
        {
          "id": "recipe_id",
          "title": "Recipe Title",
          "description": "Recipe description",
          "category": "Main Course",
          "area": "American",
          "instructions": "Recipe instructions...",
          "time": 45,
          "image": "image_url",
          "thumb": "thumbnail_url",
          "video": "video_url",
          "popularity": 10,
          "ingredients": [...],
          "user": {...}
        }
      ]
    }
  }
  ```

### Add Recipe to Favorites
- **POST** `/recipes/{recipeId}/favorite`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "recipe": {
        // Full recipe object
      }
    }
  }
  ```

### Remove Recipe from Favorites
- **DELETE** `/recipes/{recipeId}/favorite`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "recipe": {
        // Full recipe object
      }
    }
  }
  ```

### Get Favorite Recipes
- **GET** `/recipes/favorites`
- **Headers**: `Authorization: Bearer {jwt_token}`
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "recipes": [
        // Array of favorite recipes
      ]
    }
  }
  ```

---

## Category Routes

### Get All Categories
- **GET** `/categories`
- **Headers**: Not required
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "categories": [
        {
          "id": "category_id",
          "name": "Category Name"
        }
      ]
    }
  }
  ```

---

## Area Routes

### Get All Areas
- **GET** `/areas`
- **Headers**: Not required
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "areas": [
        {
          "id": "area_id",
          "name": "Area Name"
        }
      ]
    }
  }
  ```

---

## Ingredient Routes

### Get All Ingredients
- **GET** `/ingredients`
- **Headers**: Not required
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "ingredients": [
        {
          "id": "ingredient_id",
          "title": "Ingredient Name"
        }
      ]
    }
  }
  ```

---

## Testimonial Routes

### Get All Testimonials
- **GET** `/testimonials`
- **Headers**: Not required
- **Response**:
  ```json
  {
    "status": "success",
    "code": 200,
    "data": {
      "testimonials": [
        {
          "id": "testimonial_id",
          "name": "Testimonial Name",
          "position": "Position",
          "comment": "Testimonial comment",
          "avatar_url": "avatar_url"
        }
      ]
    }
  }
  ```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "code": 400, 
  "message": "Error message"
}
```

---

## Frontend Implementation Tips

### Authentication Interceptor
Create an HTTP interceptor to automatically add the Authorization header:

```javascript
// Example for Axios
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
```

### File Upload Example
```javascript
const uploadRecipe = async (recipeData) => {
  const formData = new FormData();
  
  // Add text fields
  Object.keys(recipeData).forEach(key => {
    if (key !== 'image' && key !== 'thumb') {
      formData.append(key, recipeData[key]);
    }
  });
  
  // Add files if they exist
  if (recipeData.image) {
    formData.append('image', recipeData.image);
  }
  if (recipeData.thumb) {
    formData.append('thumb', recipeData.thumb);
  }
  
  const response = await axios.post('/api/recipes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};
```

### Pagination Component
```javascript
// Use query parameters for pagination in recipe listing
const getRecipes = async (page = 1, limit = 12, filters = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    ...filters
  });
  
  const response = await axios.get(`/api/recipes?${params}`);
  return response.data;
};
```