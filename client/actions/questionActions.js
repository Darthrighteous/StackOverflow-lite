import axios from 'axios';
import Toaster from '../utils/Toaster';

import { FETCH_QUESTIONS_SUCCESS } from './actionTypes';
import { setLoading } from './globalActions';

const fetchQuestionsSuccess = questions => ({
  type: FETCH_QUESTIONS_SUCCESS,
  payload: { questions },
});

export const fetchQuestions = () => (dispatch) => {
  dispatch(setLoading(true));
  return axios.get(`${process.env.API_BASE_URL}/questions`)
    .then(response => {
      const { data } = response;
      Toaster.success('Questions successfully fetched', 'Success');
      return dispatch(fetchQuestionsSuccess(data.questions));
    })
    .catch((error) => {
      const { data } = error.response;
      Toaster.error(data.message, data.status);
    })
    .then(() => {
      dispatch(setLoading(false));
    });
};

export const i = null;