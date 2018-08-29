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
      // console.log(e);
      next(e);
    }
  }
};

/**
* perform database query to delete a question by Id
* @param {object} req The request
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const deleteQuestion = async (req, res, next) => {
  const qId = req.params.questionId;
  // check that question belongs to user
  const { username } = res.locals.decoded.user;
  const rowCount = await db.result('SELECT * FROM questions WHERE id=$1 AND "username"=$2', [qId, username], r => r.rowCount);
  // if rowCount is greater than 0, question belongs to user.
  if (rowCount > 0) {
    try {
      const result = await db.result('DELETE FROM questions WHERE id = $1', qId);
      res.status(200).json({
        status: 'success',
        message: `deleted ${result.rowCount} row(s) of succesfully`,
        id: qId,
      });
    } catch (e) {
      res.status(400);
      // console.log(e);
      next(e);
    }
  } else {
    res.status(403).json({
      status: 'failure',
      message: 'question not found, or user token does not match question owner',
    });
  }
};

/**
* perform database query to accept an answer to a question
* @param {object} req The request containing question Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const acceptAnswer = async (req, res, next) => {
  // TODO: check that question belongs to user
  const { username } = res.locals.decoded.user;
  const aId = req.params.answerId;
  const qId = req.params.questionId;

  const question = await db.one('SELECT * FROM questions WHERE "id"=$1', [qId]);
  const answer = await db.one('SELECT * FROM answers WHERE "id"=$1', [aId]);
  // TODO: rewrite the logic in this if block
  if (username === question.username) {
    // route is called by question author
    // accept answer
    try {
      const data = await db.result('UPDATE answers SET accept = $1 WHERE id = $2 AND "questionId"=$3',
        [true, aId, qId]);
      res.status(200).json({
        status: 'success',
        message: `accepted ${data.rowCount} answer succesfully`,
        answerId: aId,
        questionId: qId,
      });
    } catch (e) {
      // console.log(e);
      res.status(400);
      next(e);
    }
  } else if (username === answer.username) {
    // route is called by answer author
    if (req.body.body) {
      const update = await db.result('UPDATE answers SET body = $1 WHERE id = $2 AND "questionId"=$3',
        [req.body.body, aId, qId]);
      if (update.rowCount > 0) {
        res.status(200).json({
          status: 'success',
          message: `updated ${update.rowCount} answer succesfully`,
          answerId: aId,
          questionId: qId,
        });
      } else {
        res.status(400).json({
          status: 'failure',
          message: 'update failed',
          answerId: aId,
          questionId: qId,
        });
      }
    } else {
      res.status(400).json({
        status: 'failure',
        message: 'require body to update answer',
        answerId: aId,
        questionId: qId,
      });
    }
  } else {
    res.status(404).json({
      status: 'failure',
      message: 'answer not found, or user token does not match answer owner',
      answerId: aId,
      questionId: qId,
    });
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
