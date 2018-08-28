// utility functions
import {
  seedPosts,
  sortPosts,
} from './utils';

// the data
const questionList = [];
seedPosts('question', questionList);

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
