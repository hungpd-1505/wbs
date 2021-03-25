import { combineReducers } from 'redux';

export default function createReducer(injectedReducers) {
	return combineReducers({
		auth: require('./AuthRedux').reducer,
		...injectedReducers,
	});
}
