// utility functions
import {
  seedPosts,
  sortPosts,
  getIndexById,
} from './utils';

// the data
const questionList = [];
seedPosts('question', questionList);

/**
 * Middleware: checks if the target question exists.
 * Returns error message or moves to next middleware route appropriately
 * @param {object} req - query request
 * @param {object} res - query response
 * @param {object} next - next route
 * @returns {object} error message or passes on to next route
*/
export const validQuestion = (req, res, next) => {
  const index = getIndexById(req.params.questionId, questionList);
  if (!questionList[index]) {
    // question not found
    return res.status(404).send(`question with id=${req.params.questionId} not found`);
  }
  req.index = index;
  req.question = questionList[index];
  return next();
};

/**
 * Middleware: GETS all question.
 * @param {object} req - query request
 * @param {object} res - query response
 * @returns {void}
*/
export const getAllQuestions = (req, res) => {
  const questions = questionList;
  res.status(200).json({
    status: 'success',
    sortedBy: req.sort,
    message: 'All questions succesfully retrieved and sorted',
    questions,
  });
};

/**
 * Middleware: GETS one question.
 * @param {object} req - query request
 * @param {object} res - query response
 * @returns {void}
*/
export const getOneQuestion = (req, res) => {
  const { question } = req;
  res.json({
    status: 'success',
    message: 'one question succesfully retrieved',
    question,
  });
};
