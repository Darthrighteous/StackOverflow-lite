import promise from 'bluebird';
import { Pool } from 'pg';
import pgpmodule from 'pg-promise';
import initQuery from './initQuery';

const options = {
  // Initialization Options
  promiseLib: promise,
};
const pgp = pgpmodule(options);

const connectionString = process.env.DATABASE_URL;
export const db = pgp(connectionString);

const pool = new Pool({
  connectionString,
});

/**
 * Initialize database tables
 * @returns {void}
*/
const initTables = () => {
  pool.query(initQuery)
    .then(() => {
      pool.end();
    })
    .catch(() => {
      pool.end();
    });
};

initTables();

/**
 * validates the body of a question(POST).
 * @param {object} post - The input body from a POST question route.
 * @returns {string} error message
*/
export const validateQuestionBody = (post) => {
  if (typeof post.title === 'undefined') {
    return 'Must provide title';
  }
  const validTitle = typeof post.title === 'string' && post.title.trim() !== '';
  if (!validTitle) {
    return 'Title must be a non-empty string';
  }
  if (typeof post.body !== 'undefined') {
    const validBody = typeof post.body === 'string';
    if (!validBody) {
      return 'Body must be a string';
    }
  }
  return null;
};

/**
 * validates the body of an answer(POST).
 * @param {object} post - The input body from a POST answer route.
 * @returns {object} Joi.validate output
*/
export const validateAnswerBody = (post) => {
  if (typeof post.body === 'undefined') {
    return 'Must provide body';
  }
  const validBody = typeof post.body === 'string' && post.body.trim() !== '';
  if (!validBody) {
    return 'Body must be a non-empty string';
  }
  return null;
};

/**
 * validates the body of a comment(POST).
 * @param {object} post - The input body from a POST answer route.
 * @returns {object} Joi.validate output
*/
export const validateCommentBody = post => validateAnswerBody(post);

/**
* Validates the answer PATCH request body
* @param {object} reqBody - the request body
* @returns {string} error message
*/
export const validatePatchReqBody = (reqBody) => {
  if (typeof reqBody.type === 'undefined') {
    return 'Must provide update type';
  }
  const validUpdateTypes = ['accept', 'edit', 'upvote', 'downvote'];
  const index = validUpdateTypes.indexOf(reqBody.type);
  if (index === -1) {
    return 'Update type must be accept, edit, upvote or downvote';
  }
  if (index === 1) {
    return validateAnswerBody(reqBody);
  }
  return null;
};
