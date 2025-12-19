// src/controllers/userProblem.js
const { getLanguageById, submitBatch, submitToken } = require("../validator/problem_validator");
const problemModel = require("../models/problem.js");

const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreater,
    } = req.body;

    // basic validations kept minimal as per original structure
    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      return res.status(400).json({ message: "referenceSolution is required and must be an array" });
    }
    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).json({ message: "visibleTestCases are required and must be an array" });
    }

    for (const { language, completCode } of referenceSolution) {
      // map language
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res.status(400).json({ message: `Unsupported language: ${language}` });
      }

      const submissions = visibleTestCases.map((testCases) => ({
        source_code: completCode,
        language_id: languageId,
        stdin: testCases.input,
        expected_output: testCases.output,
      }));

      const submitResult = await submitBatch(submissions);

      // submitResult should be array of objects with token
      if (!Array.isArray(submitResult)) {
        return res.status(500).json({ message: "Unexpected submitBatch response shape" });
      }

      const resultToken = submitResult.map((submission) => submission.token).filter(Boolean);

      if (resultToken.length === 0) {
        return res.status(500).json({ message: "No tokens returned from Judge0" });
      }

      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          
          return res.status(400).json({ message: "Reference solution is not valid", failed: test });
        }
      }
    }

    // Save problem to DB, prefer whatever auth middleware sets (req.result or req.user)
    const creator = req.result || req.user || problemCreater || null;
    await problemModel.create({
      ...req.body,
      problemCreater: creator,
    });

    return res.status(201).json({ message: "Problem created successfully" });
  } catch (error) {
    console.error("createProblem error:", error);
    return res.status(500).json({ message: "Error creating problem", error: error.message });
  }
};

module.exports = { createProblem };
