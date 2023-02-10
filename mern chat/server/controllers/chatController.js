const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Chat = require("./../models/chatModel");
const User = require("./../models/userModel");

exports.acessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});

exports.fetchChats = asyncHandler(async (req, res) => {
  try {
    const chat = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    }).populate("users", "-password");
    res.send(chat);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

exports.createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill the field" });
  }
  var users = JSON.parse(req.body.users);
  if (users.lenght < 2) {
    return res
      .status(400)
      .send("more than 2 users are required for a group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

// exports.addToGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId } = req.body;

//   const added =await  Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $push: { users: userId },
//     },
//     { new: true }
//   );
// });
