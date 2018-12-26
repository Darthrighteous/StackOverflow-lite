import questionsReducer from '../../../client/reducers/questionsReducer';
import { FETCH_QUESTIONS_SUCCESS } from '../../../client/actions/actionTypes';

const initialState = [];

describe('questions reducer', () => {
  it('should return the initial state', () => {
    expect(questionsReducer(undefined, {})).toEqual([]);
  });

  it('should handle FETCH_QUESTIONS_SUCCESS', () => {
    expect(questionsReducer(initialState, {
      type: FETCH_QUESTIONS_SUCCESS,
      payload: { questions: ['question 1 object', 'question 2 object']},
    })).toEqual(['question 1 object', 'question 2 object']);
  });
});
