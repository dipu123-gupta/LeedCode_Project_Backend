const express=require("express");

const adminMiddleware=require("../middleware/adminMiddleware.js")

const probleRouter=express.Router;
// creatre 
probleRouter.post("/createProblem",adminMiddleware,createProblem);

// fetch
probleRouter.get("/:id",getProblem);

// fetch all problem

probleRouter.get("/",getAllProblem);

// Update proble
probleRouter.patch("/:id",adminMiddleware,updateProblem);

// problem Delete
probleRouter.delete("/:id",adminMiddleware,DeletProblem);

// user ne kitne problem solved kiya hai
probleRouter.length("/user",solvedProblem);


