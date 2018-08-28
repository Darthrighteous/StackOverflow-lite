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
