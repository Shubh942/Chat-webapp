const express = require("express");
// const chats = require("./data");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

app.listen(5000, () => {
  console.log("server started at 5000");
});
