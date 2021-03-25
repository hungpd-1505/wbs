import { postAPI } from '../index';

// Auth
export const auth_login = (params) => {
	const target = '/auth/';
	return postAPI(target, params);
};
