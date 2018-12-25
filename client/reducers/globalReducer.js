import initialState from '../store/initialState';

const { global } = initialState;

const globalReducer = (state = global, action) => {
  const { type } = action;
  switch (type) {
    default:
      return state;
  }
};

export default globalReducer;
