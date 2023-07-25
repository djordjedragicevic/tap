import { useEffect, useState } from 'react';
import { API_URL, HTTP_TIMEOUT } from './config';
import { S_KEY, SecureStorage } from '../store/deviceStorage';
import { storeDispatch, storeGetValue } from '../store/store';

let _token = null;
export class Http {

	static LOADING = 'loadint'

	static async send(url, config, silent) {

		storeDispatch('app.http_loading_on')
		const d = new Date().getTime();
		try {
			console.log('HTTP START: ' + config.method, ': ', API_URL.concat(url));

			config.headers['Authorization'] = await Http.getToken();

			// const controller = new AbortController();
			// const signal = controller.signal;
			// config.signal = signal;

			//const fId = setTimeout(() => controller.abort(), HTTP_TIMEOUT);
			const response = await fetch(API_URL.concat(url), config);
			//clearTimeout(fId);
			console.log(response.ok, response.status)

			if (!response.ok)

				console.log('HTTP SUCCESS: ' + '(' + (new Date().getTime() - d) / 1000 + 's)');

			const isLogged = storeGetValue((gS) => gS.user.isLogged);
			console.log("USER LOGGED", isLogged);

			//Handle Unautenticate error
			if (response.status === 401) {
				console.warn("UNAUTENTICATED user");
			}
			//Handle Unauthorize error
			else if (response.status === 403) {
				console.warn("FORBIDEN error");

			}
			else if (!response.ok) {
				throw new Error('Response unsuccessful!');
			}

			try {
				const data = response.status !== 200 ? null : await response.json();
				return data;
			}
			catch (err) {
				throw new Error('Response format error!', err);
			}

		} catch (err) {
			console.error('HTTP ERROR:', err);
		}
		finally {
			storeDispatch('app.http_loading_off');
			console.log('')
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
		if (_token == null) {
			const t = await SecureStorage.get(S_KEY.TOKEN, '');
			_token = t;
		}

		return _token;
	}


	static async post(url, data, silent = false) {
		const resp = await Http.send(url, {
			method: 'POST',
			// headers: {
			// 	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			// },
			// body: Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&')
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}, silent);

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
