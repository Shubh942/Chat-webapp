const express = require("express");
const chatController = require("../controllers/chatController");
const authMiddleware = require("./../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(authMiddleware.protect, chatController.acessChat);
router.route("/").get(authMiddleware.protect, chatController.fetchChats);
router
  .route("/group")
  .post(authMiddleware.protect, chatController.createGroupChat);
router.route("/rename").put(authMiddleware.protect, chatController.renameGroup);
// router
//   .route("/groupadd")
//   .put(authMiddleware.protect, chatController.addToGroup);

module.exports = router;
