import { API_URL } from './config';

export class Http {
	static send(url, method = 'GET', data = null) {
		console.log(method, ': ', API_URL.concat(url), data);
		return new Promise((resolve, reject) => {
			fetch(API_URL.concat(url), {
				method,
				headers: {
					'Content-Type': method === 'POST' ? 'application/x-www-form-urlencoded;charset=UTF-8' : 'application/json',
				},
				body: data
			})
				.then((resp) => {
					console.log(resp);
					return resp ? resp.json() : Promise.resolve()
				})
				.then((resp) =>{
					//console.log(resp);
					resolve(resp)
				})
				.catch((err) => {
					console.log('NETWORK ERR', err);
					//reject(err);
				});
		});
	}

	static get(url, qParams) {
		let _url = qParams ? url + '?' + new URLSearchParams(qParams) : url;
		return Http.send(_url);
	}

	static post(url, data) {
		return Http.send(url, 'POST', Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&'))
	}
}
