import promise from 'bluebird';
import pgpmodule from 'pg-promise';
import Joi from 'joi';

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
  const schema = {
    title: Joi.string().required(),
    body: Joi.string(),
  };
  return Joi.validate(post, schema);
};
