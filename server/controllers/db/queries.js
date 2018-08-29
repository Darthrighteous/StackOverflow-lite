import {
  db,
  validateQuestionBody,
  validateAnswerBody,
} from './queryUtils';
import { getTimeString } from './dateUtils';

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
    next(e);
    // console.log(e);
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
    // console.log(e);
    res.status(404);
    next(new Error(`Question of that id= ${id} not found`));
  }
};

/**
* perform database query to post a question
* @param {object} req The request
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const postQuestion = async (req, res, next) => {
  const { error } = validateQuestionBody(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    // get current time
    const date = getTimeString();
    // get username
    const { username } = res.locals.decoded.user;

    try {
      const { title, body } = req.body;
      const { id } = await db.one('INSERT INTO questions(title, body, username, date) VALUES($1, $2, $3, $4) RETURNING id',
        [title, body, username, date]);
      res.status(201).json({
        status: 'success',
        message: 'created one question succesfully',
        id,
      });
    } catch (e) {
      res.status(400);
      // console.log(e);
      next(e);
    }
  }
};

/**
* perform database query to post an answer
* @param {object} req The request containing question Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const postAnswer = async (req, res, next) => {
  const { error } = validateAnswerBody(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    // get username
    const { username } = res.locals.decoded.user;
    // get question Id and question body
    const qId = req.params.questionId;
    const { body } = req.body;
    try {
      const date = getTimeString();
      const data = await db.one('INSERT INTO answers (body, date, username, "questionId") VALUES($1, $2, $3, $4) RETURNING id, "questionId"',
        [body, date, username, qId]);
      res.status(201).json({
        status: 'success',
        message: 'created one answer succesfully',
        answerId: data.id,
        questionId: data.questionId,
      });
    } catch (e) {
      res.status(400);
      console.log(e);
      next(e);
    }
  }
};

/**
* perform database query to create a single user
* @param {string} user The email of the user
* @returns {void}
*/
export const createUser = async (user) => {
  try {
    return await db.one('INSERT INTO users (firstname, lastname, username, email, password) VALUES($1, $2, $3, $4, $5) RETURNING id',
      [user.firstname, user.lastname, user.username, user.email, user.hash]);
  } catch (e) {
    return e;
  }
};

/**
* perform database query to a get a single user
* @param {string} email The email of the user
* @returns {user} The user
*/
export const getSingleUser = async (email) => {
  try {
    const user = await db.one('SELECT * FROM users WHERE email= $1', [email]);
    return user;
  } catch (e) {
    return e;
  }
};
