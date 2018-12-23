import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  createUser,
  getSingleUser,
} from '../db/queries';
import {
  validateUserBody,
  validateLogInBody,
  checkEmailInUse,
} from './authUtils';

const saltRounds = 10;
const secretKey = process.env.SECRET;

/**
* perform database query to create a user account
* @param {object} req The request containing question Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const signUp = async (req, res, next) => {
  const validate = validateUserBody(req.body);
  if (validate != null) {
    res.status(400);
    return next(new Error(validate));
  }

  if (await checkEmailInUse(req.body.email)) {
    res.status(409);
    return next(new Error('user with email already exists'));
  }

  req.body.hash = await bcrypt.hash(req.body.password, saltRounds);
  const result = await createUser(req.body);
  if (result.email) {
    const user = await getSingleUser(result.email);
    jwt.sign({ user }, secretKey, (err, token) => {
      delete user.password;
      user.token = token;
      res.status(201).json({
        status: 'success',
        message: 'one user successfully created',
        user,
      });
    });
    return res;
  }
  res.status(400);
  return next(result);
};

/**
* perform database query to create a user account
* @param {object} req The request containing question Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const logIn = async (req, res, next) => {
  const validate = validateLogInBody(req.body);
  if (validate != null) {
    res.status(400);
    return next(new Error(validate));
  }

  if (await checkEmailInUse(req.body.email)) {
    const user = await getSingleUser(req.body.email);
    // compare password to hash from DB.
    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      jwt.sign({ user }, secretKey, (err, token) => {
        delete user.password;
        user.token = token;
        res.status(200).send({
          status: 'success',
          message: 'User logged in!',
          user,
        });
      });
      return res;
    }

    return res.status(401).json({
      status: 'failure',
      message: 'Invalid password',
    });
  }

  return res.status(401).json({
    status: 'failure',
    message: 'User does not exist',
  });
};

/**
* verify the JWT provided
* @param {object} req The request containing the JWT
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const verifyJWT = (req, res, next) => {
  if (req.headers.authorization !== undefined && req.headers.authorization !== 'undefined') {
    // retrieve jwt from header
    const token = req.headers.authorization;
    // verify and decode token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(403).json({
          status: 'unauthorized',
          message: 'invalid token',
        });
      }
      res.locals.decoded = decoded;
      res.locals.token = token;
    });
    return next();
  }
  return res.status(403).json({
    status: 'unauthorized',
    message: 'No token found',
  });
};
