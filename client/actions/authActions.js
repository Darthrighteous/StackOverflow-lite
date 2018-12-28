import axios from 'axios';
import Toaster from '../utils/Toaster';
import { setLoading, setLoggedIn } from './globalActions';

export const authAction = (type, userData, history) => (dispatch) => {
  dispatch(setLoading(true));
  return axios.post(`${process.env.API_BASE_URL}/auth/${type}`, userData)
    .then(response => {
      const { data } = response;
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(setLoggedIn(true));
      Toaster.success(data.message, data.status);
      return history.push('/');
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