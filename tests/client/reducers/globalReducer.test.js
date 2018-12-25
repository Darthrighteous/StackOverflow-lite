import globalReducer from '../../../client/reducers/globalReducer';
import { SET_LOADING, SET_LOGGED_IN, SET_ERROR } from '../../../client/actions/actionTypes';

const initialState = {
  isLoggedIn: false,
  isLoading: false,
  error: '',
};

describe('global reducer', () => {
  it('should return the initial state', () => {
    expect(globalReducer(undefined, {})).toEqual({
      isLoggedIn: false,
      isLoading: false,
      error: '',
    });
  });

  it('should handle SET_LOADING', () => {
    expect(globalReducer(initialState, {
      type: SET_LOADING,
      isLoading: true,
    })).toEqual({
      isLoggedIn: false,
      isLoading: true,
      error: '',
    });
  });

  it('should handle SET_LOGGED_IN', () => {
    expect(globalReducer(initialState, {
      type: SET_LOGGED_IN,
      isLoggedIn: true,
    })).toEqual({
      isLoggedIn: true,
      isLoading: false,
      error: '',
    });
  });

  it('should handle SET_ERROR', () => {
    expect(globalReducer(initialState, {
      type: SET_ERROR,
      errorMessage: 'question not found',
    })).toEqual({
      isLoggedIn: false,
      isLoading: false,
      error: 'question not found',
    });
  });
});
