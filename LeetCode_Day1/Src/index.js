const express = require("express");

const app = express();

require("dotenv").config();
const main = require("./config/db.js");
const cookieParser=require("cookie-parser");



app.use(express.json());
app.use(cookieParser())


main()
  .then(async () => {
    app.listen(process.env.PORT, () => {
      console.log("Server Running at port number:" + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
