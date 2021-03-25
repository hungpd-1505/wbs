import seamlessImmutableTransformer from 'utils/immutablePersistenceTransform/transformer';
import localStorage from 'redux-persist/lib/storage';
// import sessionStorage from 'redux-persist/lib/storage/session'
import _ from 'lodash';

// Session encrypt
const transformer = seamlessImmutableTransformer({
  secretKey: () => 'E24MUwDM',
  onError: (error) => {
    // Handle the error.
    console.error('transform error', error);
  },
});


const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'LDZs5gcN',
    storage: localStorage,
    blacklist: [], // reducer keys that you do NOT want stored to persistence here
    whitelist: ['auth'], // Optionally, just specify the keys you DO want stored to
    transforms: [transformer],
  },
};

export default REDUX_PERSIST;
