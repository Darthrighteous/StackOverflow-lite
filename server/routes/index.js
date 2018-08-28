import express from 'express';
import {
  getAllQuestions,
  getOneQuestion,
  validQuestion,
  postQuestion,
  postAnswer,
  acceptAnswer,
  editQuestion,
} from '../controllers';

const router = express.Router();

// validate question Id
router.use('/v1/questions/:questionId', validQuestion);

router.get('/v1/questions', getAllQuestions);
router.get('/v1/questions/:questionId', getOneQuestion);

router.post('/v1/questions', postQuestion);
router.post('/v1/questions/:questionId/answers', postAnswer);

router.patch('/v1/questions/:questionId/answers/:answerId', acceptAnswer);
router.patch('/v1/questions/:questionId', editQuestion);

export default router;
