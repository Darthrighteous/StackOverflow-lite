import {
  db,
  validateQuestionBody,
  validateAnswerBody,
  validateCommentBody,
  validatePatchReqBody,
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
  const userQuery = `q.username='${user}'`;
  // search query
  const { search } = req.query;
  const searchQuery = `to_tsvector(q.title || q.body) @@ to_tsquery('${search}')`;
  let query = '';
  if (user) {
    query = `WHERE ${userQuery}`;
    if (search) {
      query += ` AND ${searchQuery}`;
    }
  } else if (search) {
    query = `WHERE ${searchQuery}`;
  }

  try {
    const questions = await db.any(`SELECT q.*,
                                      json_agg(json_build_object('id',a.id,
                                                  'body',a.body)) answers
                                    FROM questions q
                                    LEFT JOIN answers a 
                                        ON a.question_id = q.id
                                    ${query}
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
    const question = await db.one(`SELECT * FROM questions WHERE id = ${req.qId}`);
    const comments = await db.any(`SELECT * FROM comments WHERE question_id = ${req.qId} ORDER BY created_at`);
    const answers = await db.any(`SELECT a.*,
                                      json_agg(json_build_object('id',c.id,
                                                  'body',c.body,
                                                  'username',c.username,
                                                  'created_at',c.created_at) ORDER BY c.created_at) commentList
                                  FROM answers a
                                  LEFT JOIN comments c
                                      ON c.answer_id = a.id
                                  WHERE a.question_id = ${req.qId}
                                      GROUP by a.id
                                  ${sortQuery}`);
    return res.status(200).json({
      status: 'success',
      message: 'one question retrieved successfully',
      question,
      comments,
      answers,
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
      const answer = await db.one('INSERT INTO answers (body, username, question_id) VALUES($1, $2, $3) RETURNING id, question_id',
        [body, username, qId]);
      res.status(201).json({
        status: 'success',
        message: 'One answer successfully added',
        answer,
      });
    } catch (e) {
      res.status(400);
      const error = new Error(`${e.message}`);
      next(error);
    }
  }
};

/**
* perform database query to post a comment
* @param {object} req The request containing question Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const postComment = async (req, res, next) => {
  const validate = validateCommentBody(req.body);
  if (validate !== null) {
    res.status(400).json({
      status: 'failure',
      message: validate,
    });
  } else {
    // get username
    const { username } = res.locals.decoded.user;
    // get parent Id and comment body
    const qId = req.params.questionId;
    const aId = req.params.answerId;
    let type = 'answer';
    if (qId) {
      type = 'question';
    }
    const { body } = req.body;
    try {
      const comment = await db.one('INSERT INTO comments(body, question_id, answer_id, username) VALUES($1, $2, $3, $4) RETURNING id, question_id, answer_id',
        [body, qId, aId, username]);
      res.status(201).json({
        status: 'success',
        message: `One ${type} comment successfully added`,
        comment,
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
* perform database query to delete an answer by Id
* @param {object} req The request
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const deleteAnswer = async (req, res, next) => {
  const qId = req.params.questionId;
  const aId = req.params.answerId;
  // check that answer belongs to user
  const { username } = res.locals.decoded.user;
  const rowCount = await db.result('SELECT * FROM answers WHERE id=$1 AND question_id=$2 AND "username"=$3', [aId, qId, username], r => r.rowCount);
  // if rowCount is greater than 0, answer belongs to user.
  if (rowCount > 0) {
    try {
      const result = await db.result('DELETE FROM answers WHERE id = $1', aId);
      res.status(200).json({
        status: 'success',
        message: `Deleted ${result.rowCount} answer successfully`,
        id: aId,
        questionId: qId,
      });
    } catch (e) {
      res.status(400);
      const error = new Error(`${e.message}`);
      next(error);
    }
  } else {
    res.status(403).json({
      status: 'failure',
      message: 'Answer not found, or user token does not match answer owner',
    });
  }
};

/**
* Helper function to update question/answer
* @param {string} table The type of table to update
* @param {object} req The request containing question and answer Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {object} response object
*/
const updatePost = async (table, req, res, next) => {
  const aId = req.params.answerId;
  const qId = req.params.questionId;
  try {
    let update;
    let title;
    if (table === 'answers') {
      title = 'answer';
      update = await db.result('UPDATE answers SET body = $1 WHERE id = $2 AND "question_id"=$3',
        [req.body.body, aId, qId]);
    } else if (table === 'questions') {
      title = 'question';
      update = await db.result('UPDATE questions SET body = $1 WHERE id = $2',
        [req.body.body, qId]);
    }
    if (update.rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: `Updated ${update.rowCount} ${title} successfully`,
        answerId: aId,
        questionId: qId,
      });
    }
    return res.status(400).json({
      status: 'failure',
      message: `update failed or ${title} not found`,
      answerId: aId,
      questionId: qId,
    });
  } catch (e) {
    res.status(500);
    return next(new Error(`${e.message}`));
  }
};

/**
* Helper function to upvote question/answer
* @param {string} table The type of table to update
* @param {object} req The request containing question and answer Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {object} response object
*/
const upvotePost = async (table, req, res, next) => {
  const { username } = res.locals.decoded.user;
  const aId = req.params.answerId;
  const qId = req.params.questionId;
  try {
    let update;
    if (table === 'answers') {
      update = await db.result('UPDATE answers SET score = score + 1 WHERE id =$1 AND "question_id"=$2', [aId, qId]);
    } else {
      update = await db.result('UPDATE questions SET score = score + 1 WHERE id =$1', [qId]);
    }

    if (update.rowCount > 0) {
      if (table === 'answers') {
        await db.none('UPDATE users SET upvoted_answers =  array_append(upvoted_answers, $1) WHERE username = $2', [aId, username]);
      } else {
        await db.none('UPDATE users SET upvoted_questions =  array_append(upvoted_questions, $1) WHERE username = $2', [qId, username]);
      }

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
};

/**
  * Helper function to downvote question/answer
  * @param {string} table The type of table to update
  * @param {object} req The request containing question and answer Id
  * @param {object} res The response
  * @param {object} next To pass onto next route
  * @returns {object} response object
*/
const downvotePost = async (table, req, res, next) => {
  const { username } = res.locals.decoded.user;
  const aId = req.params.answerId;
  const qId = req.params.questionId;
  try {
    let update;
    if (table === 'answers') {
      update = await db.result('UPDATE answers SET score = score - 1 WHERE id =$1 AND "question_id"=$2', [aId, qId]);
    } else {
      update = await db.result('UPDATE questions SET score = score - 1 WHERE id =$1', [qId]);
    }
    if (update.rowCount > 0) {
      if (table === 'answers') {
        await db.none('UPDATE users SET downvoted_answers =  array_append(downvoted_answers, $1) WHERE username = $2', [aId, username]);
      } else {
        await db.none('UPDATE users SET downvoted_questions =  array_append(downvoted_answers, $1) WHERE username = $2', [qId, username]);
      }
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
};

/**
* perform database query to modify an answer to a question
* @param {object} req The request containing question Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const modifyPost = async (req, res, next) => {
  const validPatch = validatePatchReqBody(req.body);
  if (validPatch !== null) {
    res.status(400);
    return next(new Error(validPatch));
  }

  // TODO: check that question belongs to user
  const { username } = res.locals.decoded.user;
  const aId = req.params.answerId;
  const qId = req.params.questionId;

  const question = await db.one('SELECT * FROM questions WHERE id=$1', [qId]);
  let answer;
  if (aId) {
    answer = await db.one('SELECT * FROM answers WHERE id=$1', [aId]);
  }

  const { type } = req.body;
  switch (type) {
    case 'accept':
      // accept answer
      if (username === question.username) {
        // route is called by question's author, try update
        try {
          let acceptState;
          let acceptId;
          let messagePrefix;
          if (question.accepted_answer === parseInt(aId, 10)) {
            // undo accept
            acceptState = false;
            acceptId = null;
            messagePrefix = 'Undo accept on';
          } else {
            // accept
            acceptState = true;
            acceptId = aId;
            messagePrefix = 'Accepted';
          }
          const accept = await db.result('UPDATE answers SET accepted = $1 WHERE id= $2 AND "question_id"=$3',
            [acceptState, aId, qId]);
          if (accept.rowCount > 0) {
            await db.none('UPDATE questions SET accepted_answer = $1 WHERE id = $2', [acceptId, qId]);
            return res.status(200).json({
              status: 'success',
              message: `${messagePrefix} ${accept.rowCount} answer successfully`,
              answerId: aId,
              questionId: qId,
            });
          }
          return res.status(400).json({
            status: 'failure',
            message: 'accept failed or answer not found',
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
      if (answer) {
        // edit answer route
        if (username === answer.username) {
          // route is called by answer's author, try update
          return updatePost('answers', req, res, next);
        }
        res.status(401);
        return next(new Error('Only the answer\'s author can edit an answer'));
      }
      // edit question route
      if (username === question.username) {
        // route is called by question's author, try update
        return updatePost('questions', req, res, next);
      }
      res.status(401);
      return next(new Error('Only the question\'s author can edit a question'));

    case 'upvote':
      // TODO: DRY this and next case
      if (answer) {
        // answer upvote route
        if (username === answer.username) {
          return res.status(403).json({
            status: 'failure',
            message: 'You can not upvote your own answer',
          });
        }

        return upvotePost('answers', req, res, next);
      }
      // question upvote route
      if (username === question.username) {
        return res.status(403).json({
          status: 'failure',
          message: 'You can not upvote your own question',
        });
      }
      return upvotePost('questions', req, res, next);

    case 'downvote':
      if (answer) {
        // answer downvote route
        if (username === answer.username) {
          return res.status(403).json({
            status: 'failure',
            message: 'You can not downvote your own answer',
          });
        }
        return downvotePost('answers', req, res, next);
      }
      // question downovte route
      if (username === question.username) {
        return res.status(403).json({
          status: 'failure',
          message: 'You can not downvote your own question',
        });
      }
      return downvotePost('questions', req, res, next);

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
