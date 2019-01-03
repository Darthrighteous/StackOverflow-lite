import { FETCH_USER_QUESTIONS_SUCCESS } from '../actions/actionTypes';
import initialState from '../store/initialState';

const { userQuestions } = initialState;

const userQuestionsReducer = (state = userQuestions, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_USER_QUESTIONS_SUCCESS:
      return [
        ...payload.questions,
      ];
    default:
      return state;
  }

};

export default userQuestionsReducer;
