const express = require("express");

const authRouter = express.Router();
const { register, login, logout ,adminregister} = require("../controllers/userAuthen");
const userMiddeleWare = require("../middleware/userMiddleware.js");
const adminMiddleware=require("../middleware/adminMiddleware.js")

// Register

authRouter.post("/register", register);
// login
authRouter.post("/login", login);
// logout
authRouter.post("/logout", userMiddeleWare, logout);

authRouter.post("/admin/register",adminMiddleware, adminregister);
// GetProfile
// authRouter.get("/getProfile",);

module.exports = authRouter;
