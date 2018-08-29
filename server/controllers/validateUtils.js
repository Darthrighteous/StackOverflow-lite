import Joi from 'joi';
/**
 * validates the body of an input(POST).
 * @param {object} post - The input body from a POST route.
 * @returns {object} Joi.validate output
*/
export const validatePost = (post) => {
  const schema = {
    title: Joi.string().required(),
    body: Joi.string(),
    date: Joi.string(),
    user: Joi.string().required(),
  };
  return Joi.validate(post, schema);
};

/**
 * validates the body of an input(PATCH).
 * @param {object} update - The input body from a PATCH route.
 * @returns {object} Joi.validate output
*/
export const validateUpdate = (update) => {
  const schema = Joi.object().keys({
    attribute: Joi.any().valid(['score', 'title', 'body']).required(),
    value: Joi.string().required(),
  }).and('attribute', 'value');

  return Joi.validate(update, schema);
};

/**
 * validates a query
 * @param {object} query - The request query
 * @returns {object} Joi.validate output
*/
export const validateQuery = (query) => {
  const schema = {
    sortBy: Joi.any().valid(['score', 'answers', 'date']),
  };
  return Joi.validate(query, schema);
};
