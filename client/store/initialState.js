const initialState = {
  global: {
    isLoading: false,
    isLoggedIn: false,
    error: '',
  },
  questions: [],
  singleQuestion: {
    question: {},
    comments: [],
    answers: [],
  },
};

export default initialState;
