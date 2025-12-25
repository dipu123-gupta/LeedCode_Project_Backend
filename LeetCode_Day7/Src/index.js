const express = require("express");

const app = express();
;
require("dotenv").config();
const main = require("./config/db.js");
const cookieParser=require("cookie-parser");
const authRouter=require("./routes/userAuth.js");
const probleRouter=require("./routes/problemCreator.js");
// const { Promise } = require("mongoose");
const redisClient = require("./config/redis.js")
app.use(express.json());
app.use(cookieParser())

app.use("/user",authRouter);
app.use("/problem",probleRouter);


const initializeConnection=async()=>{
  try {
    await Promise.all([main(),redisClient.connect()]);
    console.log("db connected");
    

    app.listen(process.env.PORT, () => {
      console.log("Server Running at port number:" + process.env.PORT);
    });

  } catch (error) {
    console.log("Error"+error);
    
  }
}

initializeConnection();

// main()
//   .then(async () => {
//     app.listen(process.env.PORT, () => {
//       console.log("Server Running at port number:" + process.env.PORT);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });
