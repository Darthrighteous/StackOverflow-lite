import { FETCH_SINGLE_SUCCESS } from '../actions/actionTypes';
import initialState from '../store/initialState';

const { singleQuestion } = initialState;

const singleQuestionReducer = (state = singleQuestion, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_SINGLE_SUCCESS:
      return {
        ...payload.question,
      };
    default:
      return state;
  }

};

export default singleQuestionReducer;
