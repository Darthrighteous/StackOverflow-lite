import promise from 'bluebird';
import pgpmodule from 'pg-promise';

const options = {
  // Initialization Options
  promiseLib: promise,
};
const pgp = pgpmodule(options);

const connectionString = 'postgres://Admin:a@localhost:5432/Stackoverflow-lite';
export const db = pgp(connectionString);


/**
 * validates the body of a question(POST).
 * @param {object} post - The input body from a POST question route.
 * @returns {object} Joi.validate output
*/
export const validateQuestionBody = (post) => {
  if (typeof post.title === 'undefined') {
    return 'must provide title';
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
    return null;
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
    return 'must provide body';
  }
  const validBody = typeof post.body === 'string' && post.body.trim() !== '';
  if (!validBody) {
    return 'Body must be a non-empty string';
  }
  return null;
};
