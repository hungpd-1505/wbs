import _ from 'lodash';

export const convertResponse = (source) => {
	// the request
	const url = _.get(source, 'config.url');
	const method = _.get(source, 'config.method');
	const requestData = _.get(source, 'config.data');
	const requestHeaders = _.get(source, 'config.headers');
	const requestParams = _.get(source, 'config.params');
	const request = {
		url,
		method,
		data: requestData || null,
		headers: requestHeaders,
		params: requestParams || null,
	};

	// there response
	const status = _.get(source, 'status');
	const responseHeaders = _.get(source, 'headers') || {};
	const contentType = responseHeaders['content-type'] || responseHeaders['Content-Type'];
	const bodyData = _.get(source, 'data');
	const useRealBody = (typeof bodyData === 'string' || typeof bodyData === 'object');
	const body = useRealBody ? bodyData : '~~~ skipped ~~~';
	const response = { body, status, headers: responseHeaders };

	// the duration
	const duration = _.get(source, 'duration');

	// return all 3
	return [request, response, duration];
};
