import AppConfig from 'config/AppConfig';
// https://stackoverflow.com/a/54026460

export const encrypt = (message) => {
  const passcode = AppConfig.cryptoPasscode;
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n) => (`0${Number(n).toString(16)}`).substr(-2);
  const applySaltToChar = (code) => textToChars(passcode).reduce((a, b) => a ^ b, code);

  try {
    return message.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  } catch (error) {
    return message;
  }
};

export const decrypt = (encoded) => {
  const passcode = AppConfig.cryptoPasscode;
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(passcode).reduce((a, b) => a ^ b, code);
  try {
    return encoded.match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');
  } catch (e) {
    return encoded;
  }
};
