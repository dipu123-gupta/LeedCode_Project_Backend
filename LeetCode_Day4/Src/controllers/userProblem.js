const {getLanguageById,submitBatch} = require("../validator/problem_validator");

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

      const submissions = visibleTestCases.map((input, output) => ({
        source_code: completCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const submitResult = await submitBatch(submissions);
    }
  } catch (error) {}
};

module.exports=createProblem;