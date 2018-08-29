import Joi from 'joi';
import { getSingleUser } from '../db/queries';

/**
 * validates the body of a sign up request
 * @param {object} user - The input body from a POST sign up.
 * @returns {object} Joi.validate output
*/
export const validateUserBody = (user) => {
  const schema = {
    firstname: Joi.string().max(16),
    lastname: Joi.string().max(16),
    username: Joi.string().alphanum().min(4).max(16)
      .required(),
    email: Joi.string().email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string().min(6)
      .required(),
  };
  return Joi.validate(user, schema);
};

/**
 * checks if an email is in use in the db
 * @param {object} email - The email being checked.
 * @returns {boolean} true if email is found.
*/
export const checkEmailInUse = async (email) => {
  const user = await getSingleUser(email);
  if (user.email) {
    return true;
  }
  return false;
};