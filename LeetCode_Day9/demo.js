const axios = require("axios");

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    java: 62,
    javascript: 63,
    c: 104,
  };
  return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "true",
    },
    headers: {
      "x-rapidapi-key": "696c361fbcmsh28308cda7d5f282p12cfd2jsna73dd1c06ec6",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();
};

const waiting=async (timer)=>{
  SocketTimeoutError(()=>{
    return 1;
  },timer);
}


const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": "696c361fbcmsh28308cda7d5f282p12cfd2jsna73dd1c06ec6",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while (true) {
    const result = await fetchData();

    const IsResultObtained = result.submissions.every((r) => status_id > 2);
    if (IsResultObtained) {
      return result.submissions;
    }
  }
};


waiting(2000);

module.exports = { getLanguageById, submitBatch,submitToken };



// fghffhgjkfduyhdgvnb7buhjjioiouiuydtrdtr
const {
  getLanguageById,
  submitToken,
  submitBatch,
} = require("../validator/problem_validator");
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

    for (const { language, completCode } of referenceSolution) {
      // source_code
      // languageId
      // stdin
      // expectedOutput

      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testCases) => ({
        source_code: completCode,
        language_id: languageId,
        stdin: testCases.input,
        expected_output: testCases.output,
      }));
      const submitResult = await submitBatch(submissions);

      const resultToken = submitResult.map((submission) => submission.token);

      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id != 3) {
          res
            .status_id(400)
            .json({ message: "Reference solution is not valid" });
          return;
        }
      }
    }

    // we can save the problem to database
    await problemModel.create({
      ...req.body,
      problemCreater: req.result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating problem", error: error.message });
  }
};
