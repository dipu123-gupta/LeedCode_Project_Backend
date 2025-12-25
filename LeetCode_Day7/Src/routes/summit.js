const express = require('express');
const userMiddeleWare =require("../middleware/userMiddleware")
const submiteCode = require("../controllers/userSubmission");

const summitRouter = express.Router();

summitRouter.post("/submit/:id", userMiddeleWare,submiteCode) 