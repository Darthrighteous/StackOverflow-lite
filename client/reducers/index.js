import { combineReducers } from 'redux';
import globalReducer from './globalReducer';

const reducers = combineReducers({
  global: globalReducer,
});

export default reducers;