import express from 'express';
import {
  getAllQuestions,
  getOneQuestion,
  getOneUserPublic,
  postQuestion,
  postAnswer,
  postComment,
  deleteQuestion,
  deleteAnswer,
  modifyPost,
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

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Stackoverflow-lite API'
  });
});

router.use('/questions/:questionId', validateQId);
router.use('/questions/:questionId/answers/:answerId', validateAId);

// DATABASE ROUTES
router.get('/questions', getAllQuestions); // get all questions
router.get('/questions/:questionId', getOneQuestion); // get a single question
router.get('/users/:username', getOneUserPublic); // get a single user

router.post('/questions', verifyJWT, postQuestion); // post question
router.post('/questions/:questionId/answers', verifyJWT, postAnswer); // post answer
router.post('/questions/:questionId/comments', verifyJWT, postComment); // post question comment
router.post('/answers/:answerId/comments', verifyJWT, postComment); // post answer comment

router.delete('/questions/:questionId', verifyJWT, deleteQuestion); // delete question
router.delete('/questions/:questionId/answers/:answerId', verifyJWT, deleteAnswer); // delete question

router.patch('/questions/:questionId/answers/:answerId', verifyJWT, modifyPost); // modify answer
router.patch('/questions/:questionId', verifyJWT, modifyPost); // modify question

// AUTH ROUTES
router.post('/auth/signup', signUp);
router.post('/auth/login', logIn);

router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.status || 500);
    res.json({
      status: 'failure',
      message: err.message,
    });
  }
});

export default router;
