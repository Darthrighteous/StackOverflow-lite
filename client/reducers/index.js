import { combineReducers } from 'redux';
import globalReducer from './globalReducer';
import questionsReducer from './questionsReducer';

const reducers = combineReducers({
  global: globalReducer,
  questions: questionsReducer,
});

export default reducers;