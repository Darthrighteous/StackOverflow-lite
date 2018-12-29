import axios from 'axios';
import Toaster from '../utils/Toaster';

import { FETCH_QUESTIONS_SUCCESS, FETCH_SINGLE_SUCCESS } from './actionTypes';
import { setLoading } from './globalActions';
import getUserDetails from '../utils/getUserDetails';
import requestOptions from '../utils/requestOptions';

const fetchQuestionsSuccess = questions => ({
  type: FETCH_QUESTIONS_SUCCESS,
  payload: { questions },
});

const fetchSingleSuccess = question => ({
  type: FETCH_SINGLE_SUCCESS,
  payload: { question },
});

const displayError = (error) => {
  if (error.response) {
    const { data } = error.response;
    Toaster.options.timeOut = 0;
    return Toaster.error(data.message, data.status);
  }
  Toaster.error('Oops! something went wrong, please try again!', 'Failed');
};

const reloadRoute = (history) => {
  history.push('/reload');
  history.goBack();
};

export const fetchQuestions = () => (dispatch) => {
  dispatch(setLoading(true));
  const path = `${process.env.API_BASE_URL}/questions`;
  return axios(requestOptions('get', path))
    .then(response => {
      const { data } = response;
      return dispatch(fetchQuestionsSuccess(data.questions));
    })
    .catch((error) => {
      return displayError(error);
    })
    .then(() => {
      dispatch(setLoading(false));
    });
};

export const fetchSingleQuestion = (id) => (dispatch) => {
  dispatch(setLoading(true));
  const path = `${process.env.API_BASE_URL}/questions/${id}`;
  return axios(requestOptions('get', path))
    .then(response => {
      const { data } = response;
      return dispatch(fetchSingleSuccess(data));
    })
    .catch((error) => {
      return displayError(error);
    })
    .then(() => {
      dispatch(setLoading(false));
    });
};

export const postComment = (type, id, body, history) => (dispatch) => {
  dispatch(setLoading(true));
  const user = getUserDetails();
  if (!user) {
    Toaster.info('please login to post a comment', 'Unauthorized');
    dispatch(setLoading(false));
    return history.push('/login');
  }
  const path = `${process.env.API_BASE_URL}/${type}/${id}/comments`;
  return axios(requestOptions('post', path, body, user.token))
    .then(response => {
      const { data } = response;
      reloadRoute(history);
      return Toaster.success(data.message, data.status);
    })
    .catch((error) => {
      return displayError(error);
    })
    .then(() => {
      dispatch(setLoading(false));
    });
};

export const postAnswer = (id, body, history) => (dispatch) => {
  dispatch(setLoading(true));
  const user = getUserDetails();
  if (!user) {
    Toaster.info('please login to post an answer', 'Unauthorized');
    dispatch(setLoading(false));
    return history.push('/login');
  }
  const path = `${process.env.API_BASE_URL}/questions/${id}/answers`;
  return axios(requestOptions('post', path, body, user.token))
    .then(response => {
      const { data } = response;
      reloadRoute(history);
      return Toaster.success(data.message, data.status);
    })
    .catch((error) => {
      return displayError(error);
    })
    .then(() => {
      dispatch(setLoading(false));
    });
};

export const deletePost = (resource, params, history) => (dispatch) => {
  dispatch(setLoading(true));
  const user = getUserDetails();
  if (!user) {
    Toaster.info('please login to post an answer', 'Unauthorized');
    dispatch(setLoading(false));
    return history.push('/login');
  }
  const path = resource === 'answers' ?
    `${process.env.API_BASE_URL}/questions/${params.questionId}/answers/${params.answerId}`
    : `${process.env.API_BASE_URL}/questions/${params.questionId}`;

  return axios(requestOptions('delete', path, null, user.token))
    .then(response => {
      const { data } = response;
      if (resource === 'questions') {
        history.push('/');
      } else {
        reloadRoute(history);
      }
      return Toaster.success(data.message, data.status);
    })
    .catch((error) => {
      return displayError(error);
    })
    .then(() => {
      dispatch(setLoading(false));
    });
};


export const modifyPost =
  (type, resource, params, history, editInput, undo) => (dispatch) => {
    dispatch(setLoading(true));
    const body = {
      type,
      body: editInput,
    };
    const user = getUserDetails();
    if (!user) {
      Toaster.info('please login to perform that action', 'Unauthorized');
      dispatch(setLoading(false));
      return history.push('/login');
    }
    const path = resource === 'answers' ?
      `${process.env.API_BASE_URL}/questions/${params.questionId}/answers/${params.answerId}`
      : `${process.env.API_BASE_URL}/questions/${params.questionId}`;

    return axios(requestOptions('patch', path, body, user.token))
      .then(response => {
        const { data } = response;
        reloadRoute(history);

        //update localStorage
        const removeFromArray = (array, value) => {
          while (array.indexOf(value) > -1) {
            array.splice(array.indexOf(value), 1);
          }
        };
        if(type === 'upvote') {
          if (resource === 'answers') {
            if(undo) {
              removeFromArray(user.downvoted_answers, params.answerId);
            } else {
              removeFromArray(user.downvoted_answers, params.answerId);
              user.upvoted_answers.push(params.answerId);
            }
          } else {
            if(undo) {
              removeFromArray(user.downvoted_questions, params.questionId);
            } else {
              removeFromArray(user.downvoted_questions, params.questionId);
              user.upvoted_questions.push(params.questionId);
            }
          }
        } else if(type === 'downvote') {
          
          if (resource === 'answers') {
            if(undo){
              removeFromArray(user.upvoted_answers, params.answerId);
            } else { 
              removeFromArray(user.upvoted_answers, params.answerId);
              user.downvoted_answers.push(params.answerId);
            }
          } else {
            if(undo) {
              removeFromArray(user.upvoted_questions, params.questionId);
            } else {
              removeFromArray(user.upvoted_questions, params.questionId);
              user.downvoted_questions.push(params.questionId);
            }
          }
        }
        
        localStorage.setItem('user', JSON.stringify(user));

        return Toaster.success(data.message, data.status);
      })
      .catch((error) => {
        return displayError(error);
      })
      .then(() => {
        dispatch(setLoading(false));
      });
  };
