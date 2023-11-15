import { getInitials } from "xapp/src/common/utils";
import { useStore } from "xapp/src/store/store";

const maskDefault = {
	maskShown: false,
	maskText: '',
	maskTransparent: false,
	maskStyle: null,
};

export const appStore = (initD = {}) => ({
	name: 'app',
	actions: {
		'app.mask': (appStore, maskShown) => {

			const shown = !!maskShown;

			return {
				...appStore,
				...((maskShown instanceof Object) ? maskShown : maskDefault),
				maskShown: !!shown,
			}
		}
	},
	initData: {
		httpLoading: false,
		font: '',
		...maskDefault,
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
			}
		},
		initData: { ...initData }
	}

};

export const providerStore = (initD = {}) => ({
	name: 'provider',
	actions: {
		'app.set_provider_data': (providerStore, data) => {
			return {
				...providerStore,
				...data
			}
		}
	},
	initData: {
		id: 1,
		name: '',
		...initD
	}
});

export const useIsUserLogged = function (params) {
	const isLogged = useStore(gS => gS.user.isLogged);
	return isLogged;
};
