import { FETCH_SINGLE_USER_SUCCESS } from '../actions/actionTypes';
import initialState from '../store/initialState';

const { user } = initialState;

const userReducer = (state = user, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_SINGLE_USER_SUCCESS:
      return {
        ...payload.user,
      };
    default:
      return state;
  }

};

export default userReducer;
