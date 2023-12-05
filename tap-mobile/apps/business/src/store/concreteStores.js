import { useStore } from "xapp/src/store/store";
import { ROLE } from "../common/general";

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

export const userStore = (
	initD = {
		isLogged: false,
		roles: [],
		employee: {
			id: -1,
			name: '',
			imagePath: '',
			provider: {
				id: '',
				name: ''
			},
			user: {
				id: '',
				email: ''
			}
		}
	}
) => ({
	name: 'user',
	actions: {
		'user.login': (employeeStore, data = {}) => {
			return {
				...employeeStore,
				...data,
				isLogged: true
			}
		},
		'user.logout': () => {
			return {
				...initD,
				isLogged: false,
			}
		}
	},
	initData: { ...initD }
});


export const useIsUserLogged = function () {
	const isLogged = useStore(gS => gS.user.isLogged);
	return isLogged;
};


export const useIsRoleEmployee = function () {
	const roles = useStore(gS => gS.user.roles);
	return roles?.indexOf(ROLE.EMPLOYER) > -1;
};

export const useIsRoleOwner = function () {
	const roles = useStore(gS => gS.user.roles);
	return roles?.indexOf(ROLE.PROVIDER_OWNER) > -1;
};