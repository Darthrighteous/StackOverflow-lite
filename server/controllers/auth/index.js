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
const secretKey = 'public';

/**
* perform database query to create a user account
* @param {object} req The request containing question Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const signUp = async (req, res, next) => {
  const { error } = validateUserBody(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  if (await checkEmailInUse(req.body.email)) {
    next(new Error('user with email already exists'));
  } else {
    req.body.hash = await bcrypt.hash(req.body.password, saltRounds);
    const result = await createUser(req.body);
    if (result.id) {
      res.status(201).json({
        status: 'success',
        message: 'one user successfully created',
        userId: result.id,
      });
    } else {
      res.status(400);
      next(result);
    }
  }
};

/**
* perform database query to create a user account
* @param {object} req The request containing question Id
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const logIn = async (req, res, next) => {
  const { error } = validateLogInBody(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  if (await checkEmailInUse(req.body.email)) {
    // Load hash from your password DB.
    const user = await getSingleUser(req.body.email);
    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      jwt.sign({ user }, secretKey, (err, token) => {
        user.token = token;
        console.log(token);
      });
      res.status(200).send({
        status: 'success',
        message: 'User logged in!',
        user,
      });
    } else {
      res.status(401).json({
        status: 'failure',
        message: 'Invalid password',
      });
    }
  } else {
    next(new Error('user does not exist'));
  }
};

/**
* verify the JWT provided
* @param {object} req The request containing the JWT
* @param {object} res The response
* @param {object} next To pass onto next route
* @returns {void}
*/
export const verifyJWT = (req, res, next) => {
  if (req.headers.authorization !== undefined) {
    const [, token] = req.headers.authorization.split(' ');
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log(`ERROR VALIDATING TOKEN ${err}`);
        res.status(403).json({
          status: 'unauthorized',
          message: 'invalid token',
        });
      } else {
        res.locals.decoded = decoded;
        res.locals.token = token;
        next();
      }
    });
  } else {
    res.status(403).json({
      status: 'unauthorized',
      message: 'no token found',
    });
  }
};
