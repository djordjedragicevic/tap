import { API_URL } from './config';

export class Http {
	static send(url, method = 'GET', data = null) {
		console.log(method, ': ', API_URL.concat(url), data);
		const d = new Date().getTime();
		return new Promise((resolve, reject) => {
			fetch(API_URL.concat(url), {
				method,
				headers: {
					'Content-Type': method === 'POST' ? 'application/x-www-form-urlencoded;charset=UTF-8' : 'application/json',
				},
				body: data
			})
				.then((resp) => {
					const t = new Date().getTime() - d;
					console.log('SUCCESS: ' + method, ': ', API_URL.concat(url), data, '(' + t / 1000 + 's)');
					return resp ? resp.json() : Promise.resolve()
				})
				.then((resp) => {
					//console.log(resp);
					resolve(resp)
				})
				.catch((err) => {
					console.log('NETWORK ERR', err);
					//reject(err);
				});
		});
	}

	static get(url, qParams, validate = false) {

		if (qParams && validate) {
			const tmpQP = {};
			for (const [k, v] of Object.entries(qParams))
				if (v !== undefined)
					tmpQP[k] = v;
			qParams = tmpQP;
		}

		let _url = qParams ? url + '?' + new URLSearchParams(qParams) : url;
		return Http.send(_url);
	}

	static post(url, data) {
		return Http.send(url, 'POST', Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&'))
	}
}

export function useGetRequest(url, params) {

}
