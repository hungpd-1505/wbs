/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import Immutable from 'seamless-immutable';
import { persistStore, persistReducer } from 'redux-persist';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import DebugConfig from './config/DebugConfig';
import ReduxPersist from './config/ReduxPersist';

import createReducer from './reducers';
import rootSaga from './sagas';

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [];

  const sagaMonitor = DebugConfig.useReactotron ? console.tron.createSagaMonitor : null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middlewares.push(sagaMiddleware);

  middlewares.push(routerMiddleware(history));

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = process.env.NODE_ENV !== 'production'
      && typeof window === 'object'
      && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      shouldHotReload: false,
    })
    : compose;

  let rootReducer = createReducer();
  if (ReduxPersist.active) {
    rootReducer = persistReducer(ReduxPersist.storeConfig, createReducer());
  }

  const createAppropriateStore = DebugConfig.useReactotron ? console.tron.createStore : createStore;
  const store = createAppropriateStore(
    connectRouter(history)(rootReducer),
    /* eslint-disable new-cap */
    Immutable(initialState),
    composeEnhancers(...enhancers)
  );

  const persistor = persistStore(store);

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  // kick off root saga
  store.runSaga(rootSaga);

  return { store, persistor };
}
