import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { FETCH_SINGLE_USER_SUCCESS, SET_LOADING } from '../../../client/actions/actionTypes';
import { fetchSingleUser } from '../../../client/actions/userActions';

const axiosMock = new AxiosMockAdapter(axios);
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('user actions test', () => {
  afterEach(() => {
    axiosMock.restore();
  });

  it('creates FETCH_SINGLE_USER_SUCCESS after fetching a user', () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const username = 'Darthrighteous';
    axiosMock.onGet(`${process.env.API_BASE_URL}/users/${username}`)
      .reply(200, {});

    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      {
        type: FETCH_SINGLE_USER_SUCCESS,
        payload: {}
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
  
    return store.dispatch(fetchSingleUser('Darthrighteous'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('does not create FETCH_SINGLE_USER_SUCCESS when error occurs', () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const username = 'Dddd';
    axiosMock.onGet(`${process.env.API_BASE_URL}/users/${username}`)
      .reply(400, {});

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
  
    return store.dispatch(fetchSingleUser('Dddd'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

});

