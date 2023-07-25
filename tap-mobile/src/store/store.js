import { useEffect, useState } from "react";

let globalState = {};
let listeners = [];
let actions = {};

export const storeDispatch = function (actionId, payload) {

	if (!actions.hasOwnProperty(actionId)) {
		console.error(`STORE DISPATCH: Action ${actionId} dosn't exist!`);
		return false
	}

	const storeName = actionId.split('.')[0];
	const newState = actions[actionId](globalState[storeName], payload);

	globalState = {
		...globalState,
		[storeName]: { ...newState }
	}

	listeners.forEach((lisOb) => {
		const newV = lisOb.selector(globalState);
		if (newV !== lisOb.value) {
			lisOb.value = newV;
			lisOb.setData(newV);
		}
	});

	return newState;
};

export const storeInit = function ({ name, actions: storeActions, initData }) {
	console.info("	STORE INIT:", name);

	for (const [k, v] of Object.entries(storeActions))
		if (!actions.hasOwnProperty(k))
			actions[k] = v;
		else
			console.error(`STORE INIT: Duplicate key ${k}`)

	if (initData)
		globalState = {
			...globalState,
			[name]: {
				...initData
			}
		};
};

export function useStore(selector = () => globalState) {
	const selectorValue = selector(globalState);
	const setData = useState(selectorValue)[1];

	useEffect(() => {
		listeners.push({ selector, setData, value: selectorValue });
		return () => {
			listeners = listeners.filter(liOb => liOb.setData !== setData)
		};
	}, []);

	return selectorValue;
};

export const storeGetValue = function (selector) {
	return selector instanceof Function ? selector(globalState) : selector;
};