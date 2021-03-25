import { takeLatest } from 'redux-saga/effects';

/* ------------- Types ------------- */

import { AuthTypes } from '../reducers/AuthRedux';

/* ------------- Sagas ------------- */

import { doLogin } from './AuthSaga';

/* ------------- Connect Types To Sagas ------------- */

import API from '../services/Api';

export default function* root() {
	yield [
		takeLatest(AuthTypes.REQUEST_LOGIN, doLogin, API),
	];
}
