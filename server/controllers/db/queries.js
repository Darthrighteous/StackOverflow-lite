import {
  db,
  validateQuestionBody,
  validateAnswerBody,
} from './queryUtils';

/**
* perform database query to get all question
* @param {object} req The request
* @param {object} res The response
* @param {object} next Call to pass onto next middleware
* @returns {void}
*/
export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await db.any(`SELECT q.*,
                                      json_agg(json_build_object('id',a.id,
                                                  'body',a.body)) answers
                                    FROM questions q
                                    LEFT JOIN answers a 
                                        ON a.question_id = q.id
                                        GROUP BY q.id`);
    res.status(200).json({
      status: 'success',
      message: 'all questions retrieved successfully',
      questions,
    });
  } catch (e) {
    res.status(404);
    const error = new Error(`${e.message} Questions not found`);
    next(error);
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
  try {
    const question = await db.one(`SELECT q.*,
                                      json_agg(json_build_object('id',a.id,
                                                  'body',a.body,
                                                  'username',a.username,
                                                  'created_at',a.created_at,
                                                  'accepted',a.accepted,
                                                  'score',a.score)) answers
                                  FROM questions q
                                  LEFT JOIN answers a 
                                      ON a.question_id = q.id
                                  WHERE q.id=${req.qId}
                                      GROUP BY q.id`);
    res.status(200).json({
      status: 'success',
      message: 'one question retrieved successfully',
      question,
    });
  } catch (e) {
    res.status(404);
    const error = new Error(`${e.message} Question of id= ${req.qId} not found`);
    next(error);
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
  const validate = validateQuestionBody(req.body);
  if (validate !== null) {
    res.status(400).json({
      status: 'failure',
      message: validate,
    });
  } else {
    // get username
    const { username } = res.locals.decoded.user;

    try {
      const { title, body } = req.body;
      const { id } = await db.one('INSERT INTO questions(title, body, username) VALUES($1, $2, $3) RETURNING id',
        [title, body, username]);
      res.status(201).json({
        status: 'success',
        message: 'Created one question successfully',
        id,
      });
    } catch (e) {
      res.status(400);
      const error = new Error(`${e.message}`);
      next(error);
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
  const validate = validateAnswerBody(req.body);
  if (validate !== null) {
    res.status(400).json({
      status: 'failure',
      message: validate,
    });
  } else {
    // get username
    const { username } = res.locals.decoded.user;
    // get question Id and question body
    const qId = req.params.questionId;
    const { body } = req.body;
    try {
      const data = await db.one('INSERT INTO answers (body, username, question_id) VALUES($1, $2, $3) RETURNING id, question_id',
        [body, username, qId]);
      res.status(201).json({
        status: 'success',
        message: 'One answer successfully added',
        answerId: data.id,
        questionId: data.question_id,
      });
    } catch (e) {
      res.status(400);
      const error = new Error(`${e.message}`);
      next(error);
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
        message: `Deleted ${result.rowCount} question successfully`,
        id: qId,
      });
    } catch (e) {
      res.status(400);
      const error = new Error(`${e.message}`);
      next(error);
    }
  } else {
    res.status(403).json({
      status: 'failure',
      message: 'Question not found, or user token does not match question owner',
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

  const question = await db.one('SELECT * FROM questions WHERE id=$1', [qId]);
  const answer = await db.one('SELECT * FROM answers WHERE id=$1', [aId]);

  // TODO: rewrite the logic in this if block
  if (username === question.username && !req.body.body) {
    // route is called by question author
    // accept answer
    try {
      const data = await db.result('UPDATE answers SET accepted = $1 WHERE id= $2',
        [true, aId]);
      res.status(200).json({
        status: 'success',
        message: `Accepted ${data.rowCount} answer successfully`,
        answerId: aId,
        questionId: qId,
      });
    } catch (e) {
      const error = new Error(`${e.message}`);
      next(error);
    }
  } else if (username === answer.username) {
    // route is called by answer author
    // validate answer edit body
    const validate = validateAnswerBody(req.body);
    if (validate !== null) {
      res.status(400).json({
        status: 'failure',
        message: validate,
      });
    }
    if (req.body.body) {
      const update = await db.result('UPDATE answers SET body = $1 WHERE id = $2',
        [req.body.body, aId]);
      if (update.rowCount > 0) {
        res.status(200).json({
          status: 'success',
          message: `Updated ${update.rowCount} answer successfully`,
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
      message: 'answer not found, or user token does not match question/answer owner',
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
    return await db.one('INSERT INTO users (firstname, lastname, username, email, password) VALUES($1, $2, $3, $4, $5) RETURNING email',
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
    return await db.one('SELECT * FROM users WHERE email= $1', [email]);
  } catch (e) {
    return e;
  }
};
