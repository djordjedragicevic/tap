import { API_URL } from "./config";

export class Http {

	static send(url, method = 'GET', data = null) {
		return new Promise((resolve, reject) => {

			fetch(API_URL.concat(url), {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: data ? JSON.stringify(data) : undefined
			})
				.then(resp => resp.json())
				.then(resolve)
				.catch(err => {
					console.log("NETWORK ERR", err);
					reject(err);
				});
		});
	}
}