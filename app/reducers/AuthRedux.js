import { createReducer, createActions } from 'reduxsauce'
import immutable from 'seamless-immutable'

import axios from 'axios'
import _ from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({

	settingAuthentication: null,

	// Logout
	requestLogout: null,

	// Login action
	requestLogin: ['params'],
	requestLoginSuccess: ['data', 'params'],
	requestLoginFailure: ['error'],

	setCache: ['key', 'value'],
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const INITIAL_STATUS_STATE = immutable({
	requestLogin: {
		requestLoginFetching: false, requestLoginSuccess: false, requestLoginError: null,
	},
})

const INITIAL_STATE = immutable({
	..._.assign.apply(_, [{}].concat(_.values(INITIAL_STATUS_STATE))),
	token: null,
	userId: 0,
	userName: null,
	name: null,

	cache: {},
})

// ----------------------------
// Setting Token when loading app
const settingAuthentication = (state) => {
	if (state.token) {
		axios.defaults.headers.common.Authorization = `Token ${state.token}`
	}
	return state
}

// ----------------------------

const requestLogout = () => {
	setTimeout(() => {
		window.location.href = '/'
	}, 100)
	return INITIAL_STATE
}

// ----------------------------

const requestLogin = (state) => state.merge({
	...INITIAL_STATUS_STATE.requestLogin,
	requestLoginFetching: true,
})
const requestLoginSuccess = (state, { data }) => {
	// Set token for all request
	axios.defaults.headers.common.Authorization = `Token ${data.token}`

	// Do sau khi login, sidebar khong nhan javascript -> can reload lai man hinh
	// neu giai quyet duoc van de thi khong can reload nua.
	setTimeout(() => window.location.reload(), 100)

	return state.merge({
		...INITIAL_STATUS_STATE.requestLogin,
		requestLoginSuccess: true,
		token: data.token,
		userId: data.id,
		oaId: data.oa_id,
		appId: data.app_id,
		userName: data.username,
		name: data.name,
		plan: data.plan,
		expired_date: data.expired_date,
		noProcessedCount: data.no_processed_yet,
	})
}
const requestLoginFailure = (state, { error }) => state.merge({
	...INITIAL_STATUS_STATE.requestLogin,
	requestLoginError: error,
	token: null,
	userId: 0,
	userName: null,
})

// ----------------------------

const setCache = (state, { key, value }) => state.merge({
	cache: {
		...state.cache,
		[key]: value,
	},
})

export const reducer = createReducer(INITIAL_STATE, {
	[AuthTypes.SETTING_AUTHENTICATION]: settingAuthentication,

	[AuthTypes.REQUEST_LOGOUT]: requestLogout,

	[AuthTypes.REQUEST_LOGIN]: requestLogin,
	[AuthTypes.REQUEST_LOGIN_SUCCESS]: requestLoginSuccess,
	[AuthTypes.REQUEST_LOGIN_FAILURE]: requestLoginFailure,

	[AuthTypes.SET_CACHE]: setCache,
})
