const jwt = require("jsonwebtoken");

exports.generateToken = (id) => {
  return jwt.sign({ id }, "mysecretkey", { expiresIn: "30d" });
};
