import axios from 'axios';

import { FETCH_SINGLE_USER_SUCCESS } from "./actionTypes";
import { setLoading } from "./globalActions";
import requestOptions from "../utils/requestOptions";
import { displayError } from './utils';

const fetchUserSuccess = user => ({
  type: FETCH_SINGLE_USER_SUCCESS,
  payload: { user }
});

export const fetchSingleUser = username => dispatch => {
  dispatch(setLoading(true));
  const path = `${process.env.API_BASE_URL}/users/${username}`;
  return axios(requestOptions('get', path))
    .then(response => {
      const { data } = response;
      return dispatch(fetchUserSuccess(data.user));
    })
    .catch((error) => {
      return displayError(error);
    })
    .then(() => {
      dispatch(setLoading(false));
    });
};

export const i = null;
