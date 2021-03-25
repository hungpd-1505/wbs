import moment from 'moment';
import _ from 'lodash';

export const formatDate = (text) => {
  const o = moment(text);
  if (o.isValid()) {
    if (moment().diff(o, 'days') === 0) {
      return o.format('DD/MM/YYYY HH:mm');
    }
    return o.format('DD/MM/YYYY HH:mm');
  }
  return text;
};

export const formatTime = (text, format = 'HH:mm') => {
  const o = moment(text);
  if (o.isValid()) {
    if (moment().diff(o, 'days') === 0) {
      return o.format('HH:mm');
    }
    return o.format(format);
  }
  return text;
};

export const formatBroadcastDateTime = (text) => {
  const o = moment(text);
  if (o.isValid()) {
    // 2019-12-11T01:23
    return o.format('YYYY-MM-DDTHH:mm');
  }
  return text;
};


export const getFileExtension = (filename) => filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);

export const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const getBase64 = (file, cb) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
};

export const moveElementIndex = (data, from, to) => {
  const _data = _.cloneDeep(data);

  // remove `from` item and store it
  const f = _data.splice(from, 1)[0];

  // insert stored item into position `to`
  _data.splice(to, 0, f);

  return _data;
};
