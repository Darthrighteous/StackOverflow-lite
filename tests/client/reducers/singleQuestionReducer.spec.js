import singleQuestionReducer from '../../../client/reducers/singleQuestionReducer';
import { FETCH_SINGLE_SUCCESS } from '../../../client/actions/actionTypes';
import initialState from '../../../client/store/initialState';

const { singleQuestion } = initialState;

describe('single question reducer', () => {
  it('should return the initial state', () => {
    expect(singleQuestionReducer(undefined, {})).toEqual(singleQuestion);
  });

  it('should handle FETCH_SINGLE_SUCCESS', () => {
    expect(singleQuestionReducer(initialState, {
      type: FETCH_SINGLE_SUCCESS,
      payload: { question: { id: 1 } },
    })).toEqual({ id: 1 });
  });
});
