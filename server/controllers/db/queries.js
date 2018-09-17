import {
  db,
  validateQuestionBody,
  validateAnswerBody,
  validatePatchAnswerReqBody,
} from './queryUtils';

/**
* perform database query to get all question
* @param {object} req The request
* @param {object} res The response
* @param {object} next Call to pass onto next middleware
* @returns {void}
*/
export const getAllQuestions = async (req, res, next) => {
  // sort query setup
  const { sort } = req.query;
  let sortQuery = '';
  if (sort) {
    const sortArray = ['date', 'answers', 'score'];
    const sortQueries = ['created_at', 'answer_count', 'score'];
    const index = sortArray.indexOf(sort);
    if (index === -1) {
      res.status(400);
      return next(new Error(`${sort} is not a valid sort query`));
    }
    sortQuery = `ORDER BY
                    ${sortQueries[index]} DESC`;
  }

  // username query setup
  const { user } = req.query;
  let userQuery = '';
  if (user) {
    userQuery = `WHERE q.username='${user}'`;
  }

  try {
    const questions = await db.any(`SELECT q.*,
                                      json_agg(json_build_object('id',a.id,
                                                  'body',a.body)) answers
                                    FROM questions q
                                    LEFT JOIN answers a 
                                        ON a.question_id = q.id
                                    ${userQuery}
                                        GROUP BY q.id
                                    ${sortQuery}`);
    return res.status(200).json({
      status: 'success',
      message: 'all questions retrieved successfully',
      questions,
    });
  } catch (e) {
    res.status(404);
    const error = new Error(`${e.message} Questions not found`);
    return next(error);
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
  // sort query setup
  const { sortAnswers } = req.query;
  let sortQuery = '';
  if (sortAnswers) {
    const sortArray = ['date', 'score'];
    const sortQueries = ['created_at', 'score'];
    const index = sortArray.indexOf(sortAnswers);
    if (index === -1) {
      res.status(400);
      return next(new Error(`${sortAnswers} is not a valid answer sort query`));
    }
    sortQuery = `ORDER BY
                    a.${sortQueries[index]} DESC`;
  }

  try {
    const question = await db.one(`SELECT q.*,
                                      json_agg(json_build_object('id',a.id,
                                                  'body',a.body,
                                                  'username',a.username,
                                                  'created_at',a.created_at,
                                                  'accepted',a.accepted,
                                                  'score',a.score) ${sortQuery}) answers
                                  FROM questions q
                                  LEFT JOIN answers a 
                                      ON a.question_id = q.id
                                  WHERE q.id=${req.qId}
                                      GROUP BY q.id`);
    return res.status(200).json({
      status: 'success',
      message: 'one question retrieved successfully',
      question,
    });
  } catch (e) {
    res.status(404);
    const error = new Error(`${e.message} Question of id= ${req.qId} not found`);
    return next(error);
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
    try {
      // get username
      const { username } = res.locals.decoded.user;
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
  const validPatch = validatePatchAnswerReqBody(req.body);
  if (validPatch !== null) {
    res.status(400);
    return next(new Error(validPatch));
  }

  // TODO: check that question belongs to user
  const { username } = res.locals.decoded.user;
  const aId = req.params.answerId;
  const qId = req.params.questionId;

  const question = await db.one('SELECT * FROM questions WHERE id=$1', [qId]);
  const answer = await db.one('SELECT * FROM answers WHERE id=$1', [aId]);

  const { type } = req.body;
  switch (type) {
    case 'accept':
      // accept answer
      if (username === question.username) {
        // route is called by question's author, try update
        try {
          const data = await db.result('UPDATE answers SET accepted = $1 WHERE id= $2 AND "question_id"=$3',
            [true, aId, qId]);
          return res.status(200).json({
            status: 'success',
            message: `Accepted ${data.rowCount} answer successfully`,
            answerId: aId,
            questionId: qId,
          });
        } catch (e) {
          res.status(500);
          return next(new Error(`${e.message}`));
        }
      } else {
        res.status(401);
        return next(new Error('Only the question author can accept an answer'));
      }
    case 'edit':
      if (username === answer.username) {
        // route is called by answer's author, try update
        try {
          const update = await db.result('UPDATE answers SET body = $1 WHERE id = $2 AND "question_id"=$3',
            [req.body.body, aId, qId]);
          if (update.rowCount > 0) {
            return res.status(200).json({
              status: 'success',
              message: `Updated ${update.rowCount} answer successfully`,
              answerId: aId,
              questionId: qId,
            });
          }
          return res.status(400).json({
            status: 'failure',
            message: 'update failed or answer not found',
            answerId: aId,
            questionId: qId,
          });
        } catch (e) {
          res.status(500);
          return next(new Error(`${e.message}`));
        }
      } else {
        res.status(401);
        return next(new Error('Only the answer\'s author can edit an answer'));
      }
    case 'upvote':
      // TODO: DRY this and next case
      if (username === answer.username) {
        return res.status(403).json({
          status: 'failure',
          message: 'You can not upvote your own answer',
        });
      }
      try {
        const update = await db.result('UPDATE answers SET score = score + 1 WHERE id =$1 AND "question_id"=$2', [aId, qId]);
        if (update.rowCount > 0) {
          await db.none('UPDATE users SET upvoted_answers =  array_append(upvoted_answers, $1) WHERE username = $2', [aId, username]);
          return res.status(200).json({
            status: 'success',
            message: 'Upvoted successfully',
            answerId: aId,
            questionId: qId,
          });
        }
        return res.status(400).json({
          status: 'failure',
          message: 'Upvote failed or answer not found',
          answerId: aId,
          questionId: qId,
        });
      } catch (e) {
        res.status(500);
        return next(new Error(`${e.message}`));
      }
    case 'downvote':
      if (username === answer.username) {
        return res.status(403).json({
          status: 'failure',
          message: 'You can not downvote your own answer',
        });
      }
      try {
        const update = await db.result('UPDATE answers SET score = score - 1 WHERE id =$1 AND "question_id"=$2', [aId, qId]);
        if (update.rowCount > 0) {
          await db.none('UPDATE users SET downvoted_answers =  array_append(downvoted_answers, $1) WHERE username = $2', [aId, username]);
          return res.status(200).json({
            status: 'success',
            message: 'Downvoted successfully',
            answerId: aId,
            questionId: qId,
          });
        }
        return res.status(400).json({
          status: 'failure',
          message: 'Downvote failed',
          answerId: aId,
          questionId: qId,
        });
      } catch (e) {
        res.status(500);
        return next(new Error(`${e.message}`));
      }
    default:
      console.log('something really bad has happened');
  }
  return 7;
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
