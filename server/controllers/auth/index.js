import bcrypt from 'bcrypt';
import { createUser } from '../db/queries';
import {
  validateUserBody,
  checkEmailInUse,
} from './authUtils';

const saltRounds = 10;

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
