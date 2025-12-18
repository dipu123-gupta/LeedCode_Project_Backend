const User = require("../models/UserModel.js");

const validator = require("../validator/validator.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    // user validation
    validator(req.body);

    // create user ya register users
    const user = await User.create(req.body);

    //    create jwt token
    const token = jwt.sign(
      { id: user._id, email: user.email, firstName: user.firstName },
      "process.env.JWT_KEY",
      {
        expiresIn: "1h",
      }
    );

    // const { firstName, email, password } = req.body;
    // password hashing
    req.body.password = await bcrypt.hash(password, 10);
    // create cookies
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("user register successfully");
  } catch (error) {
    res.status(400).send("Error:" + error);
  }
};

const login = async (req,res) => {
  try {
    // email or password user se lega
    const { email, password } = req.body;

    // ager email nahi bheja to error aa jayega
    if (!email) throw new Error("invalid Credentials");

    // ager password user ne nahi dala to error aayega
    if (!password) throw new Error("invalid credentials");

    // user ka email id and register email id check karega
    const user = await User.findOne(email);

    // user ne password bheja va and user acount banate samay password diya vo match karega
    const matchPass = bcrypt.compare(password, user.password);

    // ager password nahi match kiya to throw new Error("");
    if (!matchPass) throw new Error("invalid credentials");
    // jwt token
    const token = jwt.sign(
      { id: user._id, email: user.email, firstName: user.firstName },
      "process.env.JWT_KEY",
      {
        expiresIn: "1h",
      }
    );
    // cookie expire time
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("login successfully");
  } catch (error) {
    res.status(400).send("Error" + error);
  }
};

module.exports = {register,login};
