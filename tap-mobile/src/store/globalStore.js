import { useCallback, useEffect, useState } from "react";

let globalState = {
	user: {
		id: 0,
		email: '',
		firstName: '',
		lastName: ''
	},
	test1: 0,
	test2: 0

};
let listeners = [];
let actions = {
	'USER.SET_DATA': (oldState, userData) => {
		return { user: { ...userData } };

	},
	'TEST_1': (oldState) => {
		return { test1: oldState.test1 + 1 };
	},
	'TEST_2': (oldState) => {
		return { test2: oldState.test2 + 1 };
	}
};

export function useGlobalStore(dispatchOnly = false, selector = () => globalState) {
	const setData = useState(selector(globalState))[1];

	const dispatch = useCallback((actionId, payload) => {
		if (actions[actionId]) {
			const newState = actions[actionId](globalState, payload);
			console.log("")
			console.log("DISPATCH", actionId, payload)
			globalState = {
				...globalState,
				...newState
			};
		}

		listeners.forEach((lisOb) => {
			const newV = lisOb.sel(globalState);
			if (newV !== lisOb.old) {
				lisOb.old = newV;
				lisOb.li(newV);
			}
		});
	}, []);

	useEffect(() => {
		if (!dispatchOnly)
			listeners.push({ sel: selector, li: setData, old: selector(globalState) });

		return () => {
			if (!dispatchOnly)
				listeners = listeners.filter(liOb => liOb.li !== setData)
		};
	}, []);

	return dispatchOnly ? dispatch : [selector(globalState), dispatch]
};