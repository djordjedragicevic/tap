import { useEffect, useState } from "react";

let globalState = {};
let listeners = [];
let actions = {};

const appStore = {
	name: 'app',
	actions: {
		'app.set_font': (appStore, font) => {
			return {
				...appStore,
				font
			}
		},
		'app.http_loading_on': (appStore) => {
			return {
				...appStore,
				httpLoading: true
			};
		},
		'app.http_loading_off': (appStore) => {
			return {
				...appStore,
				httpLoading: false
			}
		}
		// 'app.mask': (appStore, isMasked) => {
		// 	return {
		// 		...appStore,
		// 		isMasked
		// 	}
		// }
	},
	initData: {
		font: undefined,
		httpLoading: false
	}
};

const isValueChanged = (newV, oldV) => {

	if (Array.isArray(newV) && Array.isArray(oldV)) {
		for (let i = 0, s = newV.length; i < s; i++)
			if (newV[i] !== oldV[i])
				return true;
	} else if (newV !== oldV) {
		return true;
	}


	return false;
};

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
		if (isValueChanged(newV, lisOb.value)) {
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
		globalState[name] = {
			...(globalState[name] || {}),
			...initData
		}
};

storeInit(appStore);

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

//----------------HOOKS---------------
export const useFont = () => {
	const font = useStore(gS => gS.app.font);
	return font;
};