import { getSingleUser } from '../db/queries';

/**
 * validates the body of a sign up request
 * @param {object} user - The input body from a POST sign up.
 * @returns {object} Joi.validate output
*/
export const validateUserBody = (user) => {
  if (typeof user.firstname !== 'undefined') {
    const validFirstName = typeof user.firstname === 'string'
    && user.firstname.trim() !== ''
    && user.firstname.trim().length <= 16
    && /^[a-zA-Z]+$/.test(user.firstname);
    // && (/[^A-Za-z]+/g).test(user.firstname);
    if (!validFirstName) {
      return 'first name must be a non-empty string of only alphabets';
    }
  }

  if (typeof user.lastname !== 'undefined') {
    const validFirstName = typeof user.firstname === 'string'
    && user.lastname.trim() !== ''
    && user.lastname.trim().length <= 16
    && /^[a-zA-Z]+$/.test(user.lastname);
    // && (/[^A-Za-z]+/g).test(user.lastname);
    if (!validFirstName) {
      return 'last name must be a non-empty string of only alphabets';
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

  if (typeof user.email === 'undefined') {
    return 'must provide email';
  }
  const validEmail = typeof user.email === 'string'
    && user.email.trim() !== '';
    // && (/[^A-Za-z]+/g).test(user.username);
  if (!validEmail) {
    return 'Email must be a non-empty string';
  }

  if (typeof user.password === 'undefined') {
    return 'must provide password';
  }
  const validPassword = typeof user.password === 'string'
    && user.password.trim() !== ''
    && user.password.trim().length >= 6;
    // && (/[^A-Za-z]+/g).test(user.password);
  if (!validPassword) {
    return 'Password must be a non-empty string, up to 6 characters';
  }
  return null;
};

/**
 * validates the body of a log in request
 * @param {object} body - The input body from a POST log in route.
 * @returns {object} Joi.validate output
*/
export const validateLogInBody = (body) => {
  // const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(body.email);
  // console.log(valid);
  if (typeof body.email === 'undefined') {
    return 'must provide email';
  }
  const validEmail = typeof body.email === 'string'
    && body.email.trim() !== '';
    // && (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(body.email);
  if (!validEmail) {
    return 'Invalid Email';
  }

  if (typeof body.password === 'undefined') {
    return 'must provide password';
  }
  const validPassword = typeof body.password === 'string'
    && body.password.trim() !== ''
    && body.password.trim().length >= 6;
    // && (/[^A-Za-z]+/g).test(user.password);
  if (!validPassword) {
    return 'Password must be a non-empty string, up to 6 characters';
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
