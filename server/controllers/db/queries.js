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
