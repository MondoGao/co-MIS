import * as R from 'ramda';
import { combineReducers } from 'redux';
import { handleActions, createActions } from 'redux-actions';

export const { user } = createActions({
  user: {
    login: R.identity,
  },
});

const current = handleActions(
  {
    [user.login](state, { payload }) {
      return payload;
    },
  },
  {},
);

export default combineReducers({
  current,
});
