const express = require("express");
// const chatController = require("../controllers/chatController");
const authMiddleware = require("./../middlewares/authMiddleware");
const messageController = require("./../controllers/messageController");

const router = express.Router();

router.route("/").post(authMiddleware.protect, messageController.sendMessage);
router
  .route("/:chatId")
  .get(authMiddleware.protect, messageController.getAllMessage);

module.exports = router;
