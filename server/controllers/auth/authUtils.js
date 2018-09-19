import { getSingleUser } from '../db/queries';

/**
* Helper function to validate email.
* @param {string} email - email to be validated.
* @returns {string} error message.
*/
const validateEmail = (email) => {
  if (typeof email === 'undefined') {
    return 'must provide email';
  }
  const validEmail = typeof email === 'string'
    && email.trim() !== ''
    && (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email);
  if (!validEmail) {
    return 'Invalid Email';
  }
  return null;
};

/**
* Helper function to validate password.
* @param {string} pwd - password to be validated.
* @returns {string} error message.
*/
const validatePassword = (pwd) => {
  if (typeof pwd === 'undefined') {
    return 'must provide password';
  }
  const validPassword = typeof pwd === 'string'
    && pwd.trim() !== ''
    && pwd.trim().length >= 6;
  if (!validPassword) {
    return 'Password must be a non-empty string, up to 6 characters';
  }
  return null;
};

/**
 * validates the body of a sign up request
 * @param {object} user - The input body from a POST sign up.
 * @returns {object} Joi.validate output
*/
export const validateUserBody = (user) => {
  if (typeof user.firstname !== 'undefined') {
    const validFirstName = typeof user.firstname === 'string'
    && user.firstname.trim() !== ''
    && user.firstname.trim().length <= 16;
    // && (/[^A-Za-z]+/g).test(user.firstname);
    if (!validFirstName) {
      return 'first name must be a non-empty string';
    }
  }

  if (typeof user.lastname !== 'undefined') {
    const validFirstName = typeof user.firstname === 'string'
    && user.lastname.trim() !== ''
    && user.lastname.trim().length <= 16;
    // && (/[^A-Za-z]+/g).test(user.lastname);
    if (!validFirstName) {
      return 'last name must be a non-empty string';
    }
  }

  if (typeof user.username === 'undefined') {
    return 'must provide username';
  }
  const validUsername = typeof user.username === 'string'
    && user.username.trim() !== ''
    && user.username.trim().length <= 16;
    // && (/[^A-Za-z]+/g).test(user.username);
  if (!validUsername) {
    return 'Username must be a non-empty string';
  }

  if (validateEmail(user.email) !== null) {
    return validateEmail(user.email);
  }

  if (validatePassword(user.password) !== null) {
    return validatePassword(user.password);
  }
  return null;
};

/**
 * validates the body of a log in request
 * @param {object} body - The input body from a POST log in route.
 * @returns {object} Joi.validate output
*/
export const validateLogInBody = (body) => {
  if (validateEmail(body.email) !== null) {
    return validateEmail(body.email);
  }
  if (validatePassword(body.password) !== null) {
    return validatePassword(body.password);
  }
  return null;
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
