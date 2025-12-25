const Problem = require("../models/problem");
const Submission = require("../models/submission");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../validator/problem_validator");

const submiteCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    const { code, langauage } = req.body;

    if (!userId || !code || !langauage || !problemId) {
      res.status(400).send("some field missing");
    }

    // fetch the problem from dataBase

    const problem = await Problem.findById(problemId);

    // testcase(Hidden)

    // kya apna dubmission store kar du pehale

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      langauage,
      // testCasesPassed:0,
      status: "pending",
      testCasesTotal: Problem.hiddenTestCases.length,
    });

    // judge0 code ko submit karna hai

    const langauageId = getLanguageById(langauage);
    if (!langauageId) {
      return res
        .status(400)
        .json({ message: `Unsupported language: ${langauage}` });
    }

    const submissions = Problem.hiddenTestCases.map((testCases) => ({
      source_code: code, // ⚠️ pehle completCode tha
      language_id: langauageId,
      stdin: testCases.input,
      expected_output: testCases.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult
      .map((submission) => submission.token)
      .filter(Boolean);

    const testResult = await submitToken(resultToken);

    // submitResult ko update karna
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let errorMessage = null;
    let status = "accepted";
    

    for (const test of testResult) {
      if (test.status._id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
        // errorMessage = test.stderr;
      } else {
        if (test.status._id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
          errorMessage = test.stderr;
        }
      }
    }

    // Store the result in dataBase in submissions
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.sava();

    res.status(201).send(submittedResult)
  } catch (error) {
    res.status(500).send("internal errorMessage"+error)
  }
};

module.exports = submiteCode;
