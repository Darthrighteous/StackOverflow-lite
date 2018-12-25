import {SET_LOADING, SET_LOGGED_IN, SET_ERROR } from '../actions/actionTypes';
import initialState from '../store/initialState';

const { global } = initialState;

const globalReducer = (state = global, action) => {
  const { type } = action;
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SET_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.errorMessage,
      };
    default:
      return state;
  }
};

export default globalReducer;
