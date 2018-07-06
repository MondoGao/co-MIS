import * as R from 'ramda';
import { combineReducers } from 'redux';
import { handleActions, createActions } from 'redux-actions';

export const actions = createActions({
  user: {
    login: R.identity,
    logout: R.identity,
  },
});

const current = handleActions(
  {
    [actions.user.login](state, { payload }) {
      return payload;
    },
    [actions.user.logout]() {
      return {};
    },
  },
  {},
);

export default combineReducers({
  current,
});
