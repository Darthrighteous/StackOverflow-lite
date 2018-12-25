import {SET_LOADING, SET_LOGGED_IN, SET_ERROR } from './actionTypes';

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  isLoading,
});

export const setLoggedIn = (isLoggedIn) => ({
  type: SET_LOGGED_IN,
  isLoggedIn,
});

export const setErrorMessage = (errorMessage) => ({
  type: SET_ERROR,
  errorMessage,
});
