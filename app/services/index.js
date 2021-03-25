import axios from 'axios';
import { paramsSerializer } from 'utils/paramsSerializer';
import AppConfig from '../config/AppConfig';
import DebugConfig from '../config/DebugConfig';
import { convertResponse } from './ApiMonitor';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = AppConfig.serviceBaseURL;
axios.defaults.paramsSerializer = paramsSerializer;

// convert all params from int, null to string, blank
// axios.defaults.transformRequest = _.concat((data, headers) => {
// 	if (!_.isNil(data) && headers['content-type'] !== "multipart/form-data") return transformPostParams(data);
// 	return data;
// }, axios.defaults.transformRequest)

// Add a response interceptor
axios.interceptors.response.use((response) => {
	if (DebugConfig.useReactotron) {
		console.tron.apiResponse(...convertResponse(response));
	}
	return response;
}, (error) => Promise.reject(error));

const errorHandler = (e) => {
	if (e.response && e.response.data && e.response.data.error) {
		return Promise.resolve({ ...e.response.data, code: e.response.status });
	} if (e.response) {
		return Promise.resolve({ error: { code: e.response.status }, message: e.response.data });
	}
	return Promise.resolve();
};


export const getAPI = (target, params) => axios.get(target, {
	params: params || {},
}).then((resp) => Promise.resolve(resp.data))
	.catch(errorHandler);

export const postAPI = (target, data, opts = {}) => axios.post(target, data, opts)
	.then((resp) => Promise.resolve(resp.data))
	.catch(errorHandler);

export const putAPI = (target, data, opts = {}) => axios.put(target, data, opts)
	.then((resp) => Promise.resolve(resp.data))
	.catch(errorHandler);

export const delAPI = (target, data) => axios.delete(target, data)
	.then((resp) => Promise.resolve(resp.data))
	.catch(errorHandler);

export const patchAPI = (target, data, opts = {}) => axios.patch(target, data, opts)
	.then((resp) => Promise.resolve(resp.data))
	.catch(errorHandler);
