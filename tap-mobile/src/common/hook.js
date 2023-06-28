import { useCallback, useEffect, useState } from "react";
import { emptyFn } from "./utils";
import { Http } from "./Http";

export function useAsyncData(fn, initData, onThen, onErr) {
	const [data, setData] = useState(initData);
	const [innerDep, setInnerDep] = useState(0);

	const reload = useCallback(() => setInnerDep(curr => curr + 1), []);

	useEffect(() => {
		let finish = true;
		fn()
			.then(data => {
				if (finish) {
					if (onThen instanceof Function)
						setData(data => onThen(data));
					else
						setData(data);
				}
			})
			.catch(onErr || emptyFn)

		return () => finish = false;
	}, [innerDep]);

	return [data, reload];
};

export function useAsyncGetData(getParams, initData, onThen, onErr) {
	return useAsyncData(() => Http.get(...getParams), initData, onThen, onErr);
};

export function usetGetRequest(url, params = {}) {
	
};