import { useEffect, useState } from 'react';
import { API_URL } from './config';
import { S_KEY, SecureStorage } from '../store/deviceStorage';

export class Http {

	static async send(url, config) {

		const d = new Date().getTime();
		try {

			config.headers['Authorization'] = Http.getToken();

			const response = await fetch(API_URL.concat(url), config);
			if (!response.ok)
				throw new Error('Response unsuccessful!');

			console.log('SUCCESS: ' + config.method, ': ', API_URL.concat(url), '(' + (new Date().getTime() - d) / 1000 + 's)');

			try {
				const data = await response.json();
				return data;
			}
			catch (_) {
				throw new Error('Response format error!');
			}

		} catch (err) {
			console.log('ERROR: ' + config.method, ': ', API_URL.concat(url), '(' + (new Date().getTime() - d) / 1000 + 's)', '\n -- ', err);
		}
	}

	static async get(url, qParams, validate = false) {

		if (qParams && validate) {
			const tmpQP = {};
			for (const [k, v] of Object.entries(qParams))
				if (v !== undefined)
					tmpQP[k] = v;
			qParams = tmpQP;
		}

		let _url = qParams ? url + '?' + new URLSearchParams(qParams) : url;

		const resp = await Http.send(_url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});

		return resp;
	}

	static async getToken() {
		if (!Http._token) {
			const t = await SecureStorage.get(S_KEY.TOKEN);
			Http._token = t;
		}

		return Http._token || '';
	}


	static async post(url, data) {
		const resp = await Http.send(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			},
			body: Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&')
		});

		return resp;
	}
}

export function useHTTPGet(url, params, initData) {

	const [data, setData] = useState(initData);

	useEffect(() => {
		let doSetState = true;

		const asyncWrap = async () => {
			const d = await Http.get(url, params);
			if (doSetState)
				setData(d);
		};
		asyncWrap();

		return () => doSetState = false;
	}, []);

	return data;
};
