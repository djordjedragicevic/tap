export const appStore = (initD = {}) => ({
	name: 'app',
	actions: {
		'app.http_loading_on': (globalState) => {
			return {
				app: {
					...globalState.app,
					httpLoading: true
				}
			};
		},
		'app.http_loading_off': (globalState) => {
			return {
				app: {
					...globalState.app,
					httpLoading: false
				}
			}
		}
	},
	initData: {
		httpLoading: false,
		...initD
	}
});


export const userStore = (initD = {}) => ({
	name: 'user',
	actions: {
		['user.set_data']: (globalState, userData) => {
			return {
				user: {
					...globalState.user,
					...userData
				}
			};
		}
	},
	initData: {
		...initD
	}

});

export const testStore = (initD = {}) => ({
	name: 'test',
	actions: {
		'app.test_1': (globalState) => {
			return {
				test: {
					...globalState.test,
					test1: globalState.test.test1 + 1
				}
			};
		},
		'app.test_2': (globalState) => {
			return {
				test: {
					...globalState.test,
					test2: globalState.test.test2 + 1
				}
			};
		}
	},
	initData: {
		test1: 0,
		test2: 0,
		...initD
	}
});