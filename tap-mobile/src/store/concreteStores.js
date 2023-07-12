export const appStore = (initD = {}) => ({
	name: 'app',
	actions: {
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
		},
		'app.set_font': (appStore, font) => {
			return {
				...appStore,
				font
			}
		}
	},
	initData: {
		httpLoading: false,
		font: '',
		...initD
	}
});


export const userStore = (initD = {}) => ({
	name: 'user',
	actions: {
		'user.set_data': (userStore, userData) => {
			return {
				...userStore,
				userData,
				isLogged: true
			}
		},
		'user.set_is_logged': (userStore, isLogged) => {
			return {
				...userStore,
				isLogged
			}
		},
		'user.favorite_add': (userStore, providerId) => {
			const newFav = userStore.favoriteProviders ? [...userStore.favoriteProviders, providerId] : [providerId];
			return {
				...userStore,
				favoriteProviders: newFav
			}
		},
		'user.favorite_remove': (userStore, providerId) => {
			return {
				user: {
					...userStore,
					favoriteProviders: userStore.favoriteProviders.filter(pId => pId !== providerId)
				}
			}
		}
	},
	initData: {
		isLogged: false,
		...initD
	}

});

export const testStore = (initD = {}) => ({
	name: 'test',
	actions: {
		'app.test_1': (testStore) => {
			return {
				...testStore,
				test1: testStore.test1 + 1
			};
		},
		'app.test_2': (testStore) => {
			return {
				...testStore,
				test2: testStore.test2 + 1
			};
		}
	},
	initData: {
		test1: 0,
		test2: 0,
		...initD,
	}
});