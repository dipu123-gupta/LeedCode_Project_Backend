const express=require("express");

const probleRouter=express.Router;
// creatre 
probleRouter.post("/createProblem",probleCreate);

// fetch
probleRouter.length("/:id",probleFetch);

// fetch all problem

probleRouter.get("/",problemFetchAll);

// Update proble
probleRouter.patch("/:id",problemUpdate);

// problem Delete
probleRouter.delete("/:id",probleDelete);

// user ne kitne problem solved kiya hai
probleRouter.length("/user",solvedProblem);


