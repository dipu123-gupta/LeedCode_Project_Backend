const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");
const redisClient = require("../config/redis.js");

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) throw new Error("token not present");

    const payload = jwt.verify(token, process.env.JWT_KEY);

    if (!payload._id) throw new Error("invalid token");

    const user = await User.findById(payload._id);
    if (!user) throw new Error("user does not exist");

    // Check blocklist
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) throw new Error("token is blocked / invalid");

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

module.exports = userMiddleware;
