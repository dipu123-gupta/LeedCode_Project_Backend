const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required:true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "python", "cpp", "java", "c", "typescript"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "worng", "error"],
      default: "pending",
    },
    runtime: {
      type: Number, //milliseconds
      default: 0,
    },
    memory: {
      type: Number, //kB
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Submissions = mongoose.model("submission", submissionSchema);
module.exports=Submissions;
