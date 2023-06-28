import { useEffect } from "react";
import { API_URL } from "../config";

const http = function (url, method, data = {}) {
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
};


export function useHTTPGet(url, qParams, initData) {
	const [data, setData] = useState(initData);
	useEffect(() => {
		let finish = true;
		let _url = qParams ? url + '?' + new URLSearchParams(qParams) : url;
		http(_url, 'GET')
			.then((resp) => {
				if (finish)
					setData(resp);
			})
			.catch();

		return () => finish = false;
	}, [url, qParams]);

	return data;
};