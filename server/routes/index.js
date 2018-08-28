import express from 'express';
import {
  getAllQuestions,
} from '../controllers';

const router = express.Router();

router.get('/v1/questions', getAllQuestions);

export default router;
