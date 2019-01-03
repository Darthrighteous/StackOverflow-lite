import userReducer from '../../../client/reducers/userReducer';
import { FETCH_SINGLE_USER_SUCCESS } from '../../../client/actions/actionTypes';
import initialState from '../../../client/store/initialState';

const { user } = initialState;

describe('user questions reducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual(user);
  });

  it('should handle FETCH_SINGLE_USER_SUCCESS', () => {
    expect(userReducer(initialState, {
      type: FETCH_SINGLE_USER_SUCCESS,
      payload: { user: { username: 'xD' } },
    })).toEqual({ username: 'xD' });
  });
});
