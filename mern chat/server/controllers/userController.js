const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const User = require("./../models/userModel");
const { generateToken } = require("./../config/generateToken");

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Field");
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      user,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      user,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Incorrect username or password");
  }
});

exports.allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // console.log(keyword);
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
