// utility functions
import {
  seedPosts,
  sortPosts,
  getIndexById,
  createQuestion,
  createAnswer,
} from './utils';

// validation functions
import {
  validatePost,
} from './validateUtils';

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

/**
 * Middleware: POSTS a question into question list.
 * Responds with the appropriate error/success status and message.
 * @param {object} req - query request
 * @param {object} res - query response
 * @returns {void}
*/
export const postQuestion = (req, res) => {
  const { error } = validatePost(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    const question = createQuestion(req.body);
    questionList.push(question);
    res.status(201).json({
      status: 'success',
      message: 'question succesfully added',
      question,
    });
  }
};

/**
 * Middleware: POSTS an answer to a question object.
 * Responds with appropriate error/success status and message.
 * @param {object} req - query request
 * @param {object} res - query response
 * @returns {void}
*/
export const postAnswer = (req, res) => {
  const { error } = validatePost(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    const answer = createAnswer(req.params.questionId, req.body);
    req.question.addAnswer(answer);
    res.status(201).json({
      status: 'success',
      message: 'answer succesfully added',
      answer,
    });
  }
};
