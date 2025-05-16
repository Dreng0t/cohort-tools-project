const router = require('express').Router();
const mongoose = require("mongoose");
const User = require('../models/user.model.js');
const createError = require('http-errors');

const { isAuthenticated } = require("../middleware/jwt.middleware");


router.get('/users/:_id', isAuthenticated, async (req, res, next) => {
  const { _id } = req.params;
  try {
    const user = await User.findById(_id);
    if (!user) return next(createError(404, 'User not found'));
    res.status(200).json(user);
  } catch (err) {
    next(createError(500, 'Failed to fetch user'));
  }
});


module.exports = router;