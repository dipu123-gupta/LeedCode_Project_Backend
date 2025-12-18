 const express=require("express");
 const register=require("../controllers/userAuthen.js")

const authRouter= express.Router;

// Register

authRouter.post("/register",register);
// login
// authRouter.post("/login",login);
// logout
// authRouter.post("/logout",logout);
// GetProfile
// authRouter.get("/getProfile",getprofile);

module.exports=authRouter;
