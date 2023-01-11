import { API_URL } from './config';

export class Http {
	static send(url, method = 'GET', data = null) {
		console.log(method, ': ', API_URL.concat(url));
		return new Promise((resolve, reject) => {
			fetch(API_URL.concat(url), {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: data ? JSON.stringify(data) : undefined,
			})
				.then((resp) => {
					//console.log("RESP", resp);
					return resp.json()
				})
				.then((resolve))
				.catch((err) => {
					console.log('NETWORK ERR', err);
					reject(err);
				});
		});
	}

	static get(url, qParams) {
		let _url = qParams ? url + '?' + new URLSearchParams(qParams) : url;
		return this.send(_url);
	}
}
