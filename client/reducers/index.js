import { combineReducers } from 'redux';
import globalReducer from './globalReducer';
import questionsReducer from './questionsReducer';
import singleQuestionReducer from './singleQuestionReducer';
import userQuestionsReducer from './userQuestionsReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
  global: globalReducer,
  questions: questionsReducer,
  userQuestions: userQuestionsReducer,
  singleQuestion: singleQuestionReducer,
  user: userReducer,
});

export default reducers;