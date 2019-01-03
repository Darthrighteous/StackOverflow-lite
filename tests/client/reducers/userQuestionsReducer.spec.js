import userQuestionsReducer from '../../../client/reducers/userQuestionsReducer';
import { FETCH_USER_QUESTIONS_SUCCESS } from '../../../client/actions/actionTypes';
import initialState from '../../../client/store/initialState';

const { userQuestions } = initialState;

describe('user questions reducer', () => {
  it('should return the initial state', () => {
    expect(userQuestionsReducer(undefined, {})).toEqual(userQuestions);
  });

  it('should handle FETCH_USER_QUESTIONS_SUCCESS', () => {
    expect(userQuestionsReducer(initialState, {
      type: FETCH_USER_QUESTIONS_SUCCESS,
      payload: { questions: [ 'question 1', 'question 2' ] },
    })).toEqual([ 'question 1', 'question 2' ]);
  });
});
