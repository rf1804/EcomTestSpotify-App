/**
 * Created by rf1804 on 19/02/2020.
 *
 * @format
 */

/* eslint-disable global-require */
/* eslint-disable no-undef */

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers/rootReducer';

let middleware = [thunk];

if (__DEV__) {
  const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
  middleware = [...middleware, reduxImmutableStateInvariant, logger];
} else {
  middleware = [...middleware];
}

export default function configureStore(initialState = {}) {
  return createStore(rootReducer, initialState, applyMiddleware(...middleware));
}
