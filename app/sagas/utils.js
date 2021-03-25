import { call, put } from 'redux-saga/effects';
import AuthActions from 'reducers/AuthRedux';

export const safeCall = (saga, ...args) => call(function* () {
	try {
		const response = yield call(saga, ...args);
		const { error, code } = response;
		if (error && code) {
			// yield put(AuthActions.needRequestAccessToken(true))
		}
		return response;
	} catch (err) {
		return { error: true, code: -1, message: '' };
	}
});
