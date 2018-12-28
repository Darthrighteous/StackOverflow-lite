import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { authAction } from '../../../client/actions/authActions';
import { SET_LOADING, SET_LOGGED_IN } from '../../../client/actions/actionTypes';

const axiosMock = new AxiosMockAdapter(axios);
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('sign up action test', () => {
  afterEach(() => {
    axiosMock.restore();
  });

  it('success', () => {
    const successResponse = {
      data: {
        status: 'success',
        message: 'once user created successfully'
      }
    };

    const axiosMock = new AxiosMockAdapter(axios);
    const type='signup';
    axiosMock.onPost(`${process.env.API_BASE_URL}/auth/${type}`)
      .reply(201, successResponse);

    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOGGED_IN, isLoggedIn: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(authAction('signup', null, { push: jest.fn() }))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('fails', () => {
    const failureResponse = {
      data: {
        status: 'failure',
        message: 'user with email already exists'
      }
    };

    const axiosMock = new AxiosMockAdapter(axios);
    const type='signup';
    axiosMock.onPost(`${process.env.API_BASE_URL}/auth/${type}`)
      .reply(409, failureResponse);

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
  
      return store.dispatch(authAction('signup'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});