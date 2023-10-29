import { useEffect, useState } from 'react';
import { storeDispatch } from '../store/store';
import { SecureStorage } from '../store/deviceStorage';
import XAlert from '../components/basic/XAlert';
import I18n from '../i18n/I18n';


const S_KEY_TOKEN = 'token';

let _token = null;
let _API_URL = '';
let _HOST = '';
let _HTTP_TIMEOUT = 5000;

export class Http {

	static ERR = {
		UNAUTHENTICATE: 'UNAUTHENTICATE',
		FORBIDEN: 'FORBIDEN',
		CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT'
	}

	static init(host, apiUrl, timeout) {
		_API_URL = apiUrl;
		_HOST = host;
		if (timeout != null)
			_HTTP_TIMEOUT = timeout;
	}

	static async send(url, config, hideErrors) {

		storeDispatch('app.http_loading_on')
		const d = new Date().getTime();

		let err, errId, data;

		console.log('HTTP START: ' + config.method, ': ', _API_URL.concat(url));

		config.headers['Authorization'] = 'Bearer ' + await Http.getToken();

		try {

			const controller = new AbortController();
			const signal = controller.signal;
			config.signal = signal;

			const fId = setTimeout(() => controller.abort("TIMEOT"), _HTTP_TIMEOUT);
			const response = await fetch(_API_URL.concat(url), config);
			clearTimeout(fId);

			if (response.ok && response.status === 200) {
				try {
					data = await response.json();
				} catch (_) { }
			}
			else if (response.status === 204) {
				data = null;
			}
			else {
				switch (response.status) {
					case 400: //Bad request, used for custom errors
						const resp = await response.json();
						err = I18n.translateError(resp.tapEID);
						errId = resp.tapEID;
						if (resp.params) {
							Object.entries(resp.params).forEach(([k, v]) => {
								err.message = err.message.replace('{:' + k + '}', v);
							});
						}
						break;
					case 401:
						err = I18n.translateError(Http.ERR.UNAUTHENTICATE);
						errId = Http.ERR.UNAUTHENTICATE;
						break;
					case 403:
						err = I18n.translateError(Http.ERR.FORBIDEN);
						errId = Http.ERR.FORBIDEN;
						break;
					default: {
						err = I18n.translateError();
						errId = I18n.fallbackError;
					}
				}
			}

		} catch (e) {
			if (e?.name === 'AbortError')
				err = I18n.translateError(Http.ERR.CONNECTION_TIMEOUT);
			else
				err = I18n.translateError();
		}
		finally {
			console.log(`HTTP ${err ? 'NOT ' : ''}SUCCESS: (${(new Date().getTime() - d) / 1000}s)`);

			storeDispatch('app.http_loading_off');
		}




		if (err) {
			if (hideErrors !== true)
				XAlert.show(err.title, err.message);

			throw new Error(err.title, { cause: { title: err.title, message: err.message, id: errId } });
		}
		else {
			return data;
		}
	}

	static async get(url, qParams, validate = false, hideErrors = false, passMeError = false) {

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
		}, hideErrors, passMeError);

		return resp;
	}

	static async getToken() {
		if (_token == null) {
			const t = await SecureStorage.get(S_KEY_TOKEN, '');
			_token = t;
		}

		return _token;
	}

	static async setToken(token) {
		await SecureStorage.set(S_KEY_TOKEN, token);
		_token = token;
	}


	static async post(url, data, hideErrors = false) {
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
		}, hideErrors);

		return resp;
	}
	static getAPI() {
		return _API_URL;
	}
	static getHOST() {
		return _HOST;
	}
}

export function useHTTPGet(url, params, initData) {

	const [data, setData] = useState(initData);
	const [refreshId, setRefreshId] = useState(1);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		setRefreshing(true);
		let doSetState = true;
		Http.get(url, params)
			.then(d => {
				if (doSetState)
					setData(d);
			})
			.finally(() => {
				setRefreshing(false);
			});

		return () => {
			doSetState = false;
			setRefreshing(false);
		};
	}, [refreshId, setRefreshing]);

	return [data, () => setRefreshId(refreshId + 1), refreshing];
};
