import CryptoJSCore from 'crypto-js/core';
import AES from 'crypto-js/aes';
// import _ from 'lodash';

const { createTransform } = require('redux-persist');
const immutable = require('seamless-immutable');
const { makeEncryptor, makeDecryptor } = require('./helpers');

// encrypt
const makeSyncEncryptor = (secretKey) => makeEncryptor((state) => {
  const _secretKey = secretKey();
  // if(_secretKey)
  //   console.log('Encryptor with key ', _secretKey)

  return AES.encrypt(state, _secretKey).toString();
});

const makeSyncDecryptor = (secretKey, onError) => makeDecryptor((state) => {
  try {
    const _secretKey = secretKey();
    // if(_secretKey)
    //   console.log('Decryptor with key ', _secretKey)

    const bytes = AES.decrypt(state, _secretKey);
    const decryptedString = bytes.toString(CryptoJSCore.enc.Utf8);
    let session = JSON.parse(decryptedString);
    if (!session) {
      session = {};
    }
    return immutable(session);
  } catch (err) {
    // throw new Error(
    //   'Could not decrypt state. Please verify that you are using the correct secret key.'
    // )
    return immutable({});
  }
}, onError);

export default (config) => {
  const inbound = makeSyncEncryptor(config.secretKey);
  const outbound = makeSyncDecryptor(config.secretKey, config.onError);
  return createTransform(inbound, outbound, config);
};
