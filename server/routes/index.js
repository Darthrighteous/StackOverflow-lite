import express from 'express';
import {
  getAllQuestions,
  getOneQuestion,
  validQuestion,
} from '../controllers';

const router = express.Router();

router.use('/v1/questions/:questionId', validQuestion); // validate question Id

router.get('/v1/questions', getAllQuestions);
router.get('/v1/questions/:questionId', getOneQuestion);

export default router;
