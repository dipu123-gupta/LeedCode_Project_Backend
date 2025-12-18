const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(process.env.DB_COONECT);
  console.log("Data base connected sucessfully");
}
module.exports=main;