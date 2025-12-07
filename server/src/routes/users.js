const express = require('express');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authenticate');
const {
  getCurrent,
  getOtherUser,
  updateAvatar,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} = require('../controllers/userController');
const HttpError = require('../helpers/HttpError');

const router = express.Router();

// Set up multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(HttpError(400, 'Only image files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Get current user info
router.get('/current', authenticate, getCurrent);

// Get other user info
router.get('/:userId', authenticate, getOtherUser);

// Update avatar
router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

// Get followers
router.get('/followers', authenticate, getFollowers);

// Get following
router.get('/following', authenticate, getFollowing);

// Follow user
router.post('/follow/:userId', authenticate, followUser);

// Unfollow user
router.delete('/follow/:userId', authenticate, unfollowUser);

module.exports = router;