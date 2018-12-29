import { combineReducers } from 'redux';
import globalReducer from './globalReducer';
import questionsReducer from './questionsReducer';
import singleQuestionReducer from './singleQuestionReducer';

const reducers = combineReducers({
  global: globalReducer,
  questions: questionsReducer,
  singleQuestion: singleQuestionReducer,
});

export default reducers;