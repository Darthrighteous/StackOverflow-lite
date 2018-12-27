import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { FETCH_QUESTIONS_SUCCESS, SET_LOADING } from "../../../client/actions/actionTypes";
import { fetchQuestions } from '../../../client/actions/questionActions';
import { mockQuestionResponse } from '../../support/mockData';

const axiosMock = new AxiosMockAdapter(axios);
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('question actions test', () => {
  afterEach(() => {
    axiosMock.restore();
  });

  const questions = mockQuestionResponse.questions;

  it('creates FETCH_QUESTION_SUCCESS after fetching questions', () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet(`${process.env.API_BASE_URL}/questions`)
      .reply(200, mockQuestionResponse);

    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      {
        type: FETCH_QUESTIONS_SUCCESS,
        payload: { questions }
      },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({
      global: {
        isLoading: false,
        isLoggedIn: false
      },
      questions: [],
    });
  
    return store.dispatch(fetchQuestions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('does not create FETCH_QUESTION_SUCCESS if no questions', () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet(`${process.env.API_BASE_URL}/questions`)
      .reply(400, { error: {} });

    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({
      global: {
        isLoading: false,
        isLoggedIn: false
      },
      questions: [],
    });
  
    return store.dispatch(fetchQuestions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
