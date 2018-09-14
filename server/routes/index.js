import express from 'express';
import {
  getAllQuestions,
  getOneQuestion,
  postQuestion,
  postAnswer,
  deleteQuestion,
  acceptAnswer,
} from '../controllers/db/queries';

import {
  signUp,
  logIn,
  verifyJWT,
} from '../controllers/auth';

import {
  validateQId,
  validateAId,
} from './routeUtils';

const router = express.Router();

router.use('/v2/questions/:questionId', validateQId);
router.use('/v2/questions/:questionId/answers/:answerId', validateAId);

// DATABASE ROUTES
router.get('/v2/questions', getAllQuestions); // get all questions
router.get('/v2/questions/:questionId', getOneQuestion); // get a single question

router.post('/v2/questions', verifyJWT, postQuestion); // post question
router.post('/v2/questions/:questionId/answers', verifyJWT, postAnswer); // post answer

router.delete('/v2/questions/:questionId', verifyJWT, deleteQuestion); // delete question

router.patch('/v2/questions/:questionId/answers/:answerId', verifyJWT, acceptAnswer); // accept answer

// AUTH ROUTES
router.post('/v2/auth/signup', signUp);
router.post('/v2/auth/login', logIn);

router.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.json({
      status: 'failure',
      message: err.message,
    });
  }
});

export default router;
