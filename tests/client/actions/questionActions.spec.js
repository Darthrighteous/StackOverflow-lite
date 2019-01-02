import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { FETCH_QUESTIONS_SUCCESS, SET_LOADING, FETCH_SINGLE_SUCCESS } from "../../../client/actions/actionTypes";
import { fetchQuestions, fetchSingleQuestion, postComment, postAnswer, deletePost, modifyPost, postQuestion } from '../../../client/actions/questionActions';
import { mockQuestionsResponse, mockSingleQuestionResponse } from '../../support/mockData';

const axiosMock = new AxiosMockAdapter(axios);
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('question actions test', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMiwiZmlyc3RuYW1lIjoiSmFsaWwiLCJsYXN0bmFtZSI6Ik9ndW5uaXlpIiwiam9pbmVkX2F0IjoiMjAxOC0xMi0yNlQwODoyNDowOS4xOTdaIiwiZW1haWwiOiJqYS5vZ3Vubml5aUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRhcnRocmlnaHRlb3VzIiwicGFzc3dvcmQiOiIkMmIkMTAkcnd4MWZoUTE3c1M3U0gyV045MFdZdTc1TVhvL3ZxTlVJNTBzemlYVFBtSndMZUF3VU5ac2UiLCJxdWVzdGlvbl9jb3VudCI6MSwiYW5zd2VyX2NvdW50Ijo1LCJjb21tZW50X2NvdW50Ijo4LCJ1cHZvdGVkX2Fuc3dlcnMiOlsyLDIsMSwxLDNdLCJkb3dudm90ZWRfYW5zd2VycyI6WzIsMSwxLDEsMSwxLDEsMSwxLDFdLCJ1cHZvdGVkX3F1ZXN0aW9ucyI6WzIsMl0sImRvd252b3RlZF9xdWVzdGlvbnMiOlsyLDJdfSwiaWF0IjoxNTQ2MTA2NjkyfQ.JdqLlip5zl5lrZnZyfi412F3Nx94oYdoHTe3ZtQfMMY';
  const noTokenUser = {
    answer_count: 5,
    comment_count: 8,
    downvoted_answers: [1, 6, 7],
    downvoted_questions: [1, 2],
    email: "ja.ogunniyi@test.com",
    firstname: "Jalil",
    id: 22,
    joined_at: "2018-12-26T08:24:09.197Z",
    lastname: "Ogunniyi",
    question_count: 1,
    upvoted_answers: [1],
    upvoted_questions: [2, 1],
    username: "Darthrighteous"
  };
  const tokenUser = { ...noTokenUser, token };
  const setLocalStorageUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };

  afterEach(() => {
    localStorage.clear();
    axiosMock.restore();
  });
  
  const history = {
    push: jest.fn(),
    goBack: jest.fn(),
  };


  const questions = mockQuestionsResponse.questions;

  it('creates FETCH_QUESTION_SUCCESS after fetching questions', () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet(`${process.env.API_BASE_URL}/questions`)
      .reply(200, mockQuestionsResponse);

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

  it('creates FETCH_SINGLE_SUCCESS when fetching a single question', () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet(`${process.env.API_BASE_URL}/questions/1`)
        .reply(200, mockSingleQuestionResponse);
  
      const expectedActions = [
        { type: SET_LOADING, isLoading: true },
        { 
          type: FETCH_SINGLE_SUCCESS, 
          payload: { question:mockSingleQuestionResponse }
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
      
      return store.dispatch(fetchSingleQuestion(1))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
  });

  it('does not creates FETCH_SINGLE_SUCCESS on error', () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet(`${process.env.API_BASE_URL}/questions/1`)
        .reply(404, {error: {}});
  
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
      
      return store.dispatch(fetchSingleQuestion(1))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
  });


  /* POSTING A COMMENT */
  it('should load when posting a comment', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPost(`${process.env.API_BASE_URL}/questions/1/comments`)
        .reply(201, {});
  
      const expectedActions = [
        { type: SET_LOADING, isLoading: true },
        { type: SET_LOADING, isLoading: false },
      ];
  
      const store = mockStore({});

      return store.dispatch(postComment('questions', 1, {body: 'test comment'}, history))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
  });

  it('should handle when posting a comment with no token', () => {
    const store = mockStore({});

    return store.dispatch(postComment('questions', 1, {body: 'test comment'}, history));
  });

  it('should load when posting a comment and error occurs', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPost(`${process.env.API_BASE_URL}/questions/1/comments`)
        .reply(400, {});
  
      const expectedActions = [
        { type: SET_LOADING, isLoading: true },
        { type: SET_LOADING, isLoading: false },
      ];
  
      const store = mockStore({});

      return store.dispatch(postComment('questions', 1, {booody: 'test comment'}, history))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
  });



  /* POSTING AN ANSWER */
  it('should load when posting an ANSWER- success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPost(`${process.env.API_BASE_URL}/questions/1/answers`)
        .reply(201, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(postAnswer(1, {body: 'test comment'}, history))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should handle when posting an ANSWER with no token', () => {
    const store = mockStore({
      global: {
        isLoading: false,
        isLoggedIn: false
      },
      questions: [],
    });

    return store.dispatch(postAnswer(1, {body: 'test comment'}, history));
  });

  it('should load when posting an ANSWER and error occurs', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPost(`${process.env.API_BASE_URL}/questions/1/answers`)
        .reply(422, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(postAnswer(1, {booody: 'test comment'}, history))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  /* DELETING A POST */
  it('should load when deleting a post- question success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onDelete(`${process.env.API_BASE_URL}/questions/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(deletePost('questions', { questionId: 1, answerId: null }, history))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when deleting a post- answer success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onDelete(`${process.env.API_BASE_URL}/questions/1/answers/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(deletePost('answers', { questionId: 1, answerId: 1 }, history))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should handle when deleting a post with no token', () => {
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];
    const store = mockStore({});

    store.dispatch(deletePost('questions', { questionId: 1, answerId: null }, history));
    return expect(store.getActions()).toEqual(expectedActions);
  });

  it('should load when deleting a post and error occurs', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onDelete(`${process.env.API_BASE_URL}/questions/1`)
        .reply(422, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(deletePost('questions', { questionId: 1, answerId: null }, history))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });



  /** MODIFY POST  */
  it('should load when modifying a post- answer accept success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1/answers/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('accept', 'answers', { questionId: 1, answerId: 1 }, history, null, false)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- question upvote success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('upvote', 'questions', { questionId: 1, answerId: null }, history, null, false)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- question upvote undo success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('upvote', 'questions', { questionId: 1, answerId: null }, history, null, true)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- question downvote success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('downvote', 'questions', { questionId: 1, answerId: null }, history, null, false)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- question downvote undo success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('downvote', 'questions', { questionId: 1, answerId: null }, history, null, true)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- answer upvote success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1/answers/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('upvote', 'answers', { questionId: 1, answerId: 1 }, history, null, false)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- answer upvote undo success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1/answers/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('upvote', 'answers', { questionId: 1, answerId: 1 }, history, null, true)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- answer downvote success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1/answers/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('downvote', 'answers', { questionId: 1, answerId: 1 }, history, null, false)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- answer downvote undo success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1/answers/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('downvote', 'answers', { questionId: 1, answerId: 1 }, history, null, true)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post- answer upvote success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1/answers/1`)
        .reply(200, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('upvote', 'answers', { questionId: 1, answerId: 1 }, history, null, false)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post and error occurs', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPatch(`${process.env.API_BASE_URL}/questions/1`)
        .reply(422, {});
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(
      modifyPost('upvote', 'questions', { questionId: 1, answerId: null }, history, null, false)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should load when modifying a post with no user', () => {
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    store.dispatch(
      modifyPost('upvote', 'questions', { questionId: 1, answerId: null }, history, null, false)
      );
    expect(store.getActions()).toEqual(expectedActions);
  });

  // NETWORK ERROR WHEN DELETING
  it('should handle a network error', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onDelete(`${process.env.API_BASE_URL}/questions/1/answers/1`)
        .networkError();
  
    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(deletePost('answers', { questionId: 1, answerId: 1 }, history))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  /* POSTING A NEW QUESTION */
  it('should load when posting a NEW QUESTION- success', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPost(`${process.env.API_BASE_URL}/questions`)
        .reply(201, {});

    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(postQuestion({title: 'test title', body: 'test body'}, history))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should handle when posting an NEW QUESTION with no token', () => {
    const store = mockStore({
      global: {
        isLoading: false,
        isLoggedIn: false
      },
      questions: [],
    });

    return store.dispatch(postQuestion({title: 'test title', body: 'test body'}, history));
  });

  it('should load when posting a NEW QUESTION and error occurs', () => {
    setLocalStorageUser(tokenUser);
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPost(`${process.env.API_BASE_URL}/questions`)
        .reply(422, {});

    const expectedActions = [
      { type: SET_LOADING, isLoading: true },
      { type: SET_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(postQuestion({title: 'test title', body: 'test body'}, history))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
