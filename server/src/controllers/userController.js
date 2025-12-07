const { User } = require('../models/User');
const { Recipe } = require('../models/Recipe');
const HttpError = require('../helpers/HttpError');
const cloudinary = require('../config/cloudinary');

const getCurrent = async (req, res, next) => {
  try {
    const { id } = req.user;

    // Get user's recipe count
    const { data: userRecipes, total: recipesCount } = await Recipe.findByOwner(id, { page: 1, limit: 1 });

    // Get favorite recipes count
    // In the new model, we would need to implement this method
    // For now, we'll use the user's favorites count from the user record
    const user = await User.findById(id);

    res.json({
      status: 'success',
      code: 200,
      data: {
        user: {
          id: req.user.id,
          avatar: req.user.avatar_url || null,
          name: req.user.name || null,
          email: req.user.email,
          recipesCount: user.recipes_count,
          favoritesCount: user.favorites_count,
          followersCount: user.followers_count,
          followingCount: user.following_count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOtherUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw HttpError(404, 'User not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        user: {
          id: user.id,
          avatar: user.avatar_url || null,
          name: user.name || null,
          email: user.email,
          recipesCount: user.recipes_count || 0,
          followersCount: user.followers_count || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, 'File is required');
    }

    const { path } = req.file;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(path, {
      folder: 'avatars',
      transformation: {
        width: 250,
        height: 250,
        crop: 'fill',
      },
    });

    const { id } = req.user;
    const updatedUser = await User.updateAvatar(id, result.secure_url);

    res.json({
      status: 'success',
      code: 200,
      data: {
        user: {
          email: updatedUser.email,
          avatar: updatedUser.avatar_url,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const { id: currentUserId } = req.user;

    // The follow relationships are stored in a separate table
    // We need to query the user_follows table to get followers
    // This would require updating the User model to handle follow relationships

    // For now, returning an empty array - need to implement follow functionality in User model
    res.json({
      status: 'success',
      code: 200,
      data: {
        followers: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const { id: currentUserId } = req.user;

    // The follow relationships are stored in a separate table
    // We need to query the user_follows table to get following users
    // This would require updating the User model to handle follow relationships

    // For now, returning an empty array - need to implement follow functionality in User model
    res.json({
      status: 'success',
      code: 200,
      data: {
        following: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { id } = req.user;

    if (id === userId) {
      throw HttpError(400, 'You cannot follow yourself');
    }

    // For a complete implementation, we would need to add follow/unfollow methods to the User model
    // This would involve inserting records into the user_follows table
    // and updating followers/following counts

    // Placeholder implementation
    await User.updateFollowingCount(id, 1); // Increment following count
    await User.updateFollowersCount(userId, 1); // Increment followers count

    res.json({
      status: 'success',
      code: 200,
      message: 'Successfully followed user',
    });
  } catch (error) {
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { id } = req.user;

    // For a complete implementation, we would need to add follow/unfollow methods to the User model
    // This would involve removing records from the user_follows table
    // and updating followers/following counts

    // Placeholder implementation
    await User.updateFollowingCount(id, -1); // Decrement following count
    await User.updateFollowersCount(userId, -1); // Decrement followers count

    res.json({
      status: 'success',
      code: 200,
      message: 'Successfully unfollowed user',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrent,
  getOtherUser,
  updateAvatar,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
};