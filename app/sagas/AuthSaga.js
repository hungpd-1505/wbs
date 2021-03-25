import { put, call } from 'redux-saga/effects';
import _ from 'lodash';
import AuthActions from '../reducers/AuthRedux';

export function* doLogin(api, { params }) {
	const response = yield call(api.auth_login, params);
	if (!_.get(response, 'error', null) && _.get(response, 'token')) {
		yield put(AuthActions.requestLoginSuccess(response));
	} else {
		yield put(AuthActions.requestLoginFailure('ERROR'));
	}
}
