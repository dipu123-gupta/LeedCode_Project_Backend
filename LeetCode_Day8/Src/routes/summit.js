const express = require('express');
const userMiddeleWare =require("../middleware/userMiddleware")
const {submitCode,runCode} = require("../controllers/userSubmission");

const summitRouter = express.Router();

summitRouter.post("/submit/:id",userMiddeleWare,submitCode) 

summitRouter.post("/run/:id",userMiddeleWare,runCode)


module.exports=summitRouter;