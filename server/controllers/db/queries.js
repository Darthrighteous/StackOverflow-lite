import {
  db,
} from './queryUtils';

/**
* perform database query to get all question
* @param {object} req The request
* @param {object} res The response
* @returns {void}
*/
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await db.any('SELECT * FROM questions');
    res.status(200).json({
      status: 'success',
      message: 'all questions retrieved successfully',
      questions,
    });
  } catch (e) {
    // next(e);
    console.log(e);
    res.status(404);
  }
};

/**
* perform database query to get one question
* @param {object} req The request
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const getOneQuestion = async (req, res, next) => {
  const id = req.params.questionId;
  try {
    const question = await db.one(`SELECT * FROM questions WHERE id=${id}`);
    res.status(200).json({
      status: 'success',
      message: 'one question retrieved successfully',
      question,
    });
  } catch (e) {
    console.log(e);
    res.status(404);
    next(new Error(`Question of that id= ${id} not found`));
  }
};
