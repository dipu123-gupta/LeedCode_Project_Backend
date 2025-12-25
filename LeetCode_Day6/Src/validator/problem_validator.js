// src/validator/problem_validator.js
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
      base64_encoded: "false",
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

/* ✅ FIXED HERE — ONLY THIS CHANGE */
const waiting = async (timer) => {
  return new Promise((resolve) => setTimeout(resolve, timer));
};

const submitToken = async (resultTokens) => {
  if (!Array.isArray(resultTokens) || resultTokens.length === 0) {
    throw new Error("submitToken requires a non-empty array of tokens");
  }

  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultTokens.join(","),
      base64_encoded: "false",
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
    try {
      const result = await fetchData();

      const submissions = result.submissions || result;

      if (!Array.isArray(submissions)) {
        throw new Error("Unexpected submitToken response shape");
      }

      const allDone = submissions.every(
        (r) => typeof r.status_id === "number" && r.status_id > 2
      );

      if (allDone) return submissions;

      await waiting(2000);
    } catch (err) {
      console.error(
        "submitToken poll error:",
        err?.response?.data || err.message
      );
      throw err;
    }
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
