const redisClient = require("../config/redis.js");
const User = require("../models/UserModel.js");

const validator = require("../validator/validator.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    // user validation
    validator(req.body);

    const { password } = req.body;

    // pehle password hash karo
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";

    // create user ya register users
    const user = await User.create(req.body);

    //    create jwt token
    const token = jwt.sign(
    
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    // create cookies
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("user register successfully");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error("invalid credentials");
    if (!password) throw new Error("invalid credentials");

    const user = await User.findOne({ email });
    if (!user) throw new Error("invalid credentials");

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) throw new Error("invalid credentials");

    // jwt token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("login successfully");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
};

// ================= LOGOUT =================
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("token not present");
    }

    const paylode = jwt.decode(token);
    console.log(paylode);

    if (!paylode || !paylode.exp) {
      throw new Error("invalid token");
    }

    await redisClient.set(`token:${token}`, "blocked");
    await redisClient.expireAt(`token:${token}`, paylode.exp);

    res.cookie("token", null, { expires: new Date(0) });

    res.send("Logged Out successfully");
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
};

// ================= ADMIN REGISTER =================
const adminregister = async (req, res) => {
  try {
    // user validation
    // if(req.user.role!="admin")throw new Error("Invalid Credentials");

    validator(req.body);

    const { password } = req.body;

    // pehle password hash karo
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "admin";

    // create user ya register users
    const user = await User.create(req.body);

    //    create jwt token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    // create cookies
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("admin register successfully");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
};

module.exports = { register, login, logout, adminregister };
