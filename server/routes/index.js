import express from 'express';
import {
  getAllQuestions,
  getOneQuestion,
  validQuestion,
  postQuestion,
} from '../controllers';

const router = express.Router();

// validate question Id
router.use('/v1/questions/:questionId', validQuestion);

router.get('/v1/questions', getAllQuestions);
router.get('/v1/questions/:questionId', getOneQuestion);

router.post('/v1/questions', postQuestion);

export default router;
