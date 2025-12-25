// src/controllers/userProblem.js
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../validator/problem_validator");
const problemModel = require("../models/problem.js");
const Problem = require("../models/problem.js");

// createProblem
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
      return res.status(400).json({
        message: "referenceSolution is required and must be an array",
      });
    }
    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).json({
        message: "visibleTestCases are required and must be an array",
      });
    }

    for (const { language, completCode } of referenceSolution) {
      // map language
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ message: `Unsupported language: ${language}` });
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
        return res
          .status(500)
          .json({ message: "Unexpected submitBatch response shape" });
      }

      const resultToken = submitResult
        .map((submission) => submission.token)
        .filter(Boolean);
        // console.log(resultToken);
        

      if (resultToken.length === 0) {
        return res
          .status(500)
          .json({ message: "No tokens returned from Judge0" });
      }

      const testResult = await submitToken(resultToken);
       console.log(testResult);
       
      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res
            .status(400)
            .json({ message: "Reference solution is not valid", failed: test });
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
    return res
      .status(500)
      .json({ message: "Error creating problem", error: error.message });
  }
};

// updateProblem
const updateProblem = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("missing id field");
  }
  const DsaProblem = await Problem.findById(id);
  if (!DsaProblem) {
    return res.status(404).send("Id is not present in server");
  }

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
      return res.status(400).json({
        message: "referenceSolution is required and must be an array",
      });
    }
    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).json({
        message: "visibleTestCases are required and must be an array",
      });
    }

    for (const { language, completCode } of referenceSolution) {
      // map language
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ message: `Unsupported language: ${language}` });
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
        return res
          .status(500)
          .json({ message: "Unexpected submitBatch response shape" });
      }

      const resultToken = submitResult
        .map((submission) => submission.token)
        .filter(Boolean);

      if (resultToken.length === 0) {
        return res
          .status(500)
          .json({ message: "No tokens returned from Judge0" });
      }

      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res
            .status(400)
            .json({ message: "Reference solution is not valid", failed: test });
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );
    res.status(200).send(newProblem);
  } catch (error) {
    res.status(404).send("Error" + error);
  }
};

// deletedProblem
const deleteProblem = async (req, res) => {  
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).send("Id is missing");
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).send("Problem is missing");
    }

    res.status(200).send("Deleted successfully");
  } catch (error) {
    res.status(500).send("Error" + error);
  }
};

// getAllProblem
const getAllProblems = async (req, res) => {
  try {
    const getAllProblem = await Problem.find({}).select("_id title tags  difficulty");


    if (!getAllProblem) {
      return res.status(404).send("problem is missing");
    }

    res.status(200).send(getAllProblem);
  } catch (error) {}
};
 
const getProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("id is missing");
    }

    const getProblem = await Problem.findById(id).select("title description difficulty tags visibleTestCases startCode");
    if (!getProblem) {
      return res.status(400).send("problem is not present");
    }
    res.status(200).send(getProblem);
  } catch (error) {
    res.status(500).send("Error" + error);
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  getProblem,
};
