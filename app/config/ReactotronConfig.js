import Reactotron from 'reactotron-react-js';
import { reactotronRedux as reduxPlugin } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';
import Immutable from 'seamless-immutable';
import Config from './DebugConfig';

if (Config.useReactotron) {
  Reactotron
    .configure({
      name: 'Zalo Prime',
      host: 'docker.for.mac.localhost', // docker.for.mac.localhost
    }) // we can use plugins here -- more on this later
    .use(reduxPlugin({ onRestore: Immutable }))
    .use(sagaPlugin())
    .connect(); // let's connect!

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  console.tron = Reactotron;
} else {
  // Fix Reactotron for Production environment
  console.tron = console;
}
