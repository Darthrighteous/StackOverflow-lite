import express from 'express';
import {
  getAllQuestionsx,
  getOneQuestionx,
  validQuestionx,
  validQueryx,
  postQuestionx,
  postAnswerx,
  acceptAnswerx,
  editQuestionx,
  deleteQuestionx,
} from '../controllers';

import {
  getAllQuestions,
  getOneQuestion,
  postQuestion,

} from '../controllers/db/queries';

import {
  signUp,
  logIn,
  verifyJWT,
} from '../controllers/auth';


const router = express.Router();

// validate question Id
router.use('/v1/questions/:questionId', validQuestionx);
router.use('/v1/questions', validQueryx);

// DUMMY DATA ROUTES
router.get('/v1/questions', getAllQuestionsx);
router.get('/v1/questions/:questionId', getOneQuestionx);

router.post('/v1/questions', postQuestionx);
router.post('/v1/questions/:questionId/answers', postAnswerx);

router.patch('/v1/questions/:questionId/answers/:answerId', acceptAnswerx);
router.patch('/v1/questions/:questionId', editQuestionx);
router.delete('/v1/questions/:questionId', deleteQuestionx);

// DATABASE ROUTES
router.get('/v2/questions', getAllQuestions); // get all questions
router.get('/v2/questions/:questionId', getOneQuestion); // get a single question

router.post('/v2/questions', verifyJWT, postQuestion); // post question


// AUTH ROUTES
router.post('/v2/auth/signup', signUp);
router.post('/v2/auth/login', logIn);

export default router;
