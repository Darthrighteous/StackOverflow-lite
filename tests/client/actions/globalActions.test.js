import { SET_LOADING, SET_LOGGED_IN, SET_ERROR } from '../../../client/actions/actionTypes';
import { setLoading, setLoggedIn, setErrorMessage } from '../../../client/actions/globalActions';

describe('global actions test', () => {
  it('should create a set loading action', () => {
    const expectedAction = {
      type: SET_LOADING,
      isLoading: true,
    };

    expect(setLoading(true)).toEqual(expectedAction);
  });

  it('should create a set logged in action', () => {
    const expectedAction = {
      type: SET_LOGGED_IN,
      isLoggedIn: true,
    };

    expect(setLoggedIn(true)).toEqual(expectedAction);
  });

  it('should create a set error message action', () => {
    const expectedAction = {
      type: SET_ERROR,
      errorMessage: 'that question does not exist',
    };

    expect(setErrorMessage('that question does not exist')).toEqual(expectedAction);
  });
});
