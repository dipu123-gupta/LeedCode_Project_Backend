// src/routes/problemCreator.js
const express = require("express");

// destructure createProblem from controller named export
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  getProblem,
  solvedProblem
} = require("../controllers/userProblem.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");
const userMiddleware = require("../middleware/userMiddleware.js");

const problemRouter = express.Router(); // ✅ function call

// Create problem (admin only)
problemRouter.post("/createProblem", adminMiddleware, createProblem);

// Update problem (admin only)
problemRouter.put("/update/:id", adminMiddleware, updateProblem);

// Delete problem (admin only)
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

// Fetch all problems
problemRouter.get("/getAllProblem", userMiddleware, getAllProblems);

// Fetch single problem by id
problemRouter.get("/getProblemById/:id",userMiddleware, getProblem);

// // User ne kitne problem solve kiye (example route)
problemRouter.get("/solvedByUser",userMiddleware, solvedProblem); // ✅ length() galat tha

module.exports = problemRouter;
