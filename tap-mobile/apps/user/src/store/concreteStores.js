import { getInitials } from "xapp/src/common/utils";
import { useStore } from "xapp/src/store/store";

export const appStore = (initD = {}) => ({
	name: 'app',
	actions: {
		'app.mask': (appStore, maskShown) => {
			console.log("MASK", maskShown)

			const shown = !!maskShown;
			let maskText = '';
			if (maskShown instanceof Object) {
				maskText = maskShown.maskText;
			}

			return {
				...appStore,
				maskShown: shown,
				maskText: shown ? maskText : ''
			}
		}
	},
	initData: {
		httpLoading: false,
		font: '',
		maskShown: false,
		maskText: '',
		...initD
	}
});


export const userStore = (initD = {}) => {

	const initData = {
		isLogged: false,
		state: {
			favoriteProviders: []
		},
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		phone: '',
		initials: '',
		imgPath: '',
		roles: [],
		...initD
	};

	return {
		name: 'user',
		actions: {
			'user.set_data': (userStore, userData) => {

				const newData = {
					...userStore,
					...userData,
					isLogged: true,
					initials: getInitials(userData.firstName, userData.lastName, userData.username, userData.email)
				};

				if (!newData.state)
					newData.state = {};

				if (newData.state.favoriteProviders)
					newData.state.favoriteProviders = JSON.parse(newData.state.favoriteProviders);

				return newData;
			},
			'user.log_out': () => {
				return {
					...initData
				}
			},
			'user.set_is_logged': (userStore, isLogged) => {
				return {
					...userStore,
					isLogged
				}
			},
			'user.favorite_add': (userStore, providerId) => {
				const newFav = userStore.state.favoriteProviders ? [...userStore.state.favoriteProviders, providerId] : [providerId];
				return {
					...userStore,
					state: {
						...userStore.state,
						favoriteProviders: newFav
					}
				}
			},
			'user.favorite_remove': (userStore, providerId) => {
				return {
					...userStore,
					state: {
						...userStore.state,
						favoriteProviders: userStore.state.favoriteProviders.filter(pId => pId !== providerId)
					}
				}
			}
		},
		initData: { ...initData }
	}

};

export const useIsUserLogged = function (params) {
	const isLogged = useStore(gS => gS.user.isLogged);
	return isLogged;
};

export const useUserName = function () {
	const [firstName, lastName, username, email] = useStore(gS => [gS.user.firstName, gS.user.lastName, gS.user.username, gS.user.email]);
	if (firstName)
		return firstName + (lastName ? ' ' + lastName : '');
	else if (username)
		return username;
	else if (email)
		return email;
};

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