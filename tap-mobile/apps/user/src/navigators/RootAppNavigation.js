import { createNavigationContainerRef } from '@react-navigation/native';

export const appNavigation = createNavigationContainerRef();

export const navigate = (name, params) => {
	if (appNavigation.isReady()) {
		appNavigation.navigate(name, params);
	}
};