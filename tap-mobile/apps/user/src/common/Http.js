import { useEffect, useState } from 'react';
import { API_URL, HTTP_TIMEOUT } from './config';
import { S_KEY, SecureStorage } from '../store/deviceStorage';
import { storeDispatch, storeGetValue } from '../store/store';
import { ERR } from './err';
import XAlert from '../components/basic/XAlert';

let _token = null;

const handleHttpError = {

}
export class Http {

	static LOADING = 'loadint'

	static async send(url, config, silent) {



		storeDispatch('app.http_loading_on')
		const d = new Date().getTime();

		let errName;
		let data;

		console.log('HTTP START: ' + config.method, ': ', API_URL.concat(url));

		config.headers['Authorization'] = 'Bearer ' + await Http.getToken();

		try {

			const controller = new AbortController();
			const signal = controller.signal;
			config.signal = signal;

			const fId = setTimeout(() => controller.abort("TIMEOT"), HTTP_TIMEOUT);
			const response = await fetch(API_URL.concat(url), config);
			clearTimeout(fId);

			if (!response.ok) {
				if (response.status === 401) {
					errName = ERR.UNAUTHENTICATE;
				}
				else if (response.status === 403) {
					errName = ERR.FORBIDEN;
				}
				else {
					errName = ERR.UNEXPECTED;
				}
			}
			else {
				try {
					data = response.status !== 200 ? null : await response.json();
				}
				catch (err) {
					errName = ERR.INVALID_RESPONSE;
				}
			}


		} catch (err) {
			if (err?.name === 'AbortError')
				errName = ERR.CONNECTION_TIMEOUT;
			else
				errName = ERR.UNEXPECTED;
		}
		finally {
			storeDispatch('app.http_loading_off');

			if (errName)
				console.log('HTTP ERROR: ' + errName + ' (' + (new Date().getTime() - d) / 1000 + 's)');

			if (errName && !silent) {
				if (errName === ERR.UNAUTHENTICATE)
					XAlert.show('Not logged', 'Have to log in!')
				else if (errName === ERR.FORBIDEN)
					XAlert.show('Forbiden', 'Don\'t have right for acction!')
				else {
					const e = new Error();
					e.name = errName;
					throw e;
				}
			}

			console.log(`HTTP ${errName ? 'NOT ' : ''}SUCCESS: (${(new Date().getTime() - d) / 1000}s)`);
			return data;

		}
	}

	static async get(url, qParams, validate = false, silent = false) {

		if (qParams && validate) {
			const tmpQP = {};
			for (const [k, v] of Object.entries(qParams))
				if (v !== undefined)
					tmpQP[k] = v;
			qParams = tmpQP;
		}

		let _url = qParams ? url + '?' + Object.keys(qParams).map(k => {
			if (Array.isArray(qParams[k]))
				return qParams[k].map(empV => `${k}=${encodeURIComponent(empV)}`).join('&');
			else
				return `${k}=${encodeURIComponent(qParams[k])}`;
		}).join('&') : url;

		const resp = await Http.send(_url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		}, silent);

		return resp;
	}

	static async getToken() {
		if (_token == null) {
			const t = await SecureStorage.get(S_KEY.TOKEN, '');
			_token = t;
		}

		return _token;
	}

	static async setToken(token) {
		await SecureStorage.set(S_KEY.TOKEN, token);
		_token = token;
	}


	static async post(url, data, silent = false) {
		const resp = await Http.send(url, {
			method: 'POST',
			// headers: {
			// 	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			// },
			//body: Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&')
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