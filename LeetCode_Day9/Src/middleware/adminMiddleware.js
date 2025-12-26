const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");
const redisClient = require("../config/redis.js");

const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("token not present");

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = payload;
    if (!_id) throw new Error("invalid token");

    const user = await User.findById(_id);
    if (!user) throw new Error("user does not exist");

    // ✅ yahan se role check karo
    if (user.role !== "admin") {
      throw new Error("access denied, not admin");
    }

    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) throw new Error("token is blocked / invalid");

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

module.exports = adminMiddleware;
