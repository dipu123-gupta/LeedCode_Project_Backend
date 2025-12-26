const Problem = require("../models/problem");
const Submissions = require("../models/submission");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../validator/problem_validator");

const submitCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;

    const { code, language } = req.body;

    if (!userId || !code || !language || !problemId) {
      return res.status(400).json({ message: "some field missing" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const submission = await Submissions.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    const languageId = getLanguageById(language);
    if (!languageId) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    const submissions = problem.hiddenTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output,
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map(t => t.token);

    const results = await submitToken(tokens);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let errorMessage = null;
    let status = "accepted";

    for (const test of results) {
      if (test.status.id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        status = "wrong";
        errorMessage = test.stderr;
      }
    }

    submission.status = status;
    submission.testCasesPassed = testCasesPassed;
    submission.runtime = runtime;
    submission.memory = memory;
    submission.errorMessage = errorMessage;

    await submission.save();
// req.user ke undear user ka information hai
    if (!req.user.problemSolved.includes(problemId)) {
      req.user.problemSolved.push(problemId);
      await req.user.save();
    } 

    res.status(201).json(submission);
  } catch (error) {
    console.error("ERROR", error);
    console.error("STACK", error.stack);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error
    });
  }

};


const runCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;

    const { code, language } = req.body;

    if (!userId || !code || !language || !problemId) {
      return res.status(400).json({ message: "some field missing" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const languageId = getLanguageById(language);
    if (!languageId) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    const submissions = problem.visibleTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output,
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map(t => t.token);

    const results = await submitToken(tokens);

    res.status(201).json(results);
  } catch (error) {
    console.error("ERROR", error);
    console.error("STACK", error.stack);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error
    });
  }

};

module.exports = {submitCode, runCode};
