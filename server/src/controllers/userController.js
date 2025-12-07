const { User } = require('../models/User');
const { Recipe } = require('../models/Recipe');
const HttpError = require('../helpers/HttpError');
const cloudinary = require('../config/cloudinary');

const getCurrent = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Count user's recipes
    const recipesCount = await Recipe.countDocuments({ owner: _id });

    // Count favorites (recipes this user has added to favorites)
    const favoritesCount = await Recipe.countDocuments({ favorites: _id });

    // Count followers (users who follow this user)
    const followersCount = req.user.followers ? req.user.followers.length : 0;

    // Count following (users this user follows)
    const followingCount = req.user.following ? req.user.following.length : 0;

    res.json({
      status: 'success',
      code: 200,
      data: {
        user: {
          id: req.user._id,
          avatar: req.user.avatarURL || null,
          name: req.user.name || null,
          email: req.user.email,
          recipesCount,
          favoritesCount,
          followersCount,
          followingCount,
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

    const user = await User.findById(userId).select('avatarURL name email recipesCount followersCount');
    if (!user) {
      throw HttpError(404, 'User not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        user: {
          id: user._id,
          avatar: user.avatarURL || null,
          name: user.name || null,
          email: user.email,
          recipesCount: user.recipesCount || 0,
          followersCount: user.followersCount || 0,
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

    const { _id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { avatarURL: result.secure_url },
      { new: true }
    ).select('email avatarURL');

    res.json({
      status: 'success',
      code: 200,
      data: {
        user: {
          email: updatedUser.email,
          avatar: updatedUser.avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Find users who follow the current user
    const followers = await User.find({ following: _id }).select('avatarURL name email');

    res.json({
      status: 'success',
      code: 200,
      data: {
        followers,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!req.user.following || req.user.following.length === 0) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          following: [],
        },
      });
    }

    // Find users that the current user is following
    const following = await User.find({
      _id: { $in: req.user.following }
    }).select('avatarURL name email');

    res.json({
      status: 'success',
      code: 200,
      data: {
        following,
      },
    });
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { _id } = req.user;

    if (_id.toString() === userId) {
      throw HttpError(400, 'You cannot follow yourself');
    }

    // Add user to current user's following list
    const currentUser = await User.findByIdAndUpdate(
      _id,
      { $addToSet: { following: userId } },
      { new: true }
    );

    // Add current user to target user's followers list
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { followers: _id },
        $inc: { followersCount: 1 }
      }
    );

    // Update following count
    await User.findByIdAndUpdate(
      _id,
      { $inc: { followingCount: 1 } }
    );

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
    const { _id } = req.user;

    // Remove user from current user's following list
    const currentUser = await User.findByIdAndUpdate(
      _id,
      { $pull: { following: userId } },
      { new: true }
    );

    // Remove current user from target user's followers list
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { followers: _id },
        $inc: { followersCount: -1 }
      }
    );

    // Update following count
    await User.findByIdAndUpdate(
      _id,
      { $inc: { followingCount: -1 } }
    );

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