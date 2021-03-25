/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';
import Modal from 'react-modal';

// Import css frameworks
import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
// import '!file-loader?name=[name].[ext]!./images/favicon.ico';
// import '!file-loader?name=[name].[ext]!./images/icon-72x72.png';
// import '!file-loader?name=[name].[ext]!./images/icon-96x96.png';
// import '!file-loader?name=[name].[ext]!./images/icon-128x128.png';
// import '!file-loader?name=[name].[ext]!./images/icon-144x144.png';
// import '!file-loader?name=[name].[ext]!./images/icon-152x152.png';
// import '!file-loader?name=[name].[ext]!./images/icon-192x192.png';
// import '!file-loader?name=[name].[ext]!./images/icon-384x384.png';
// import '!file-loader?name=[name].[ext]!./images/icon-512x512.png';
// import '!file-loader?name=[name].[ext]!./manifest.json';
// import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './configureStore';
import AppConfig from './config/AppConfig';

// Import CSS reset and Global Styles
import './styles/index';

if (process.env.NODE_ENV === 'development') {
  require('./config/ReactotronConfig');
}

// Create redux store with history
const initialState = {};

// deploy to server on root folder
const historyOpts = {};
if (AppConfig.publicPath) {
  historyOpts.basename = AppConfig.publicPath;
}
const history = createHistory(historyOpts);

const { store, persistor } = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

Modal.setAppElement('#app');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </PersistGate>
    </Provider>,
    MOUNT_NODE
  );
};

// Initial render
render();

export { store };
