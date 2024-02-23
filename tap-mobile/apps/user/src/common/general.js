import XAlert from "xapp/src/components/basic/XAlert";
import I18nT from "xapp/src/i18n/i18n"
import * as RootAppNavigation from '../navigators/RootAppNavigation';
import { LOGIN_SCREEN } from "../navigators/routes";
import { Theme } from "xapp/src/style/themes";

export const throwUnexpected = () => {
	const { title, message } = I18nT.tErr('TAP_0');
	XAlert.show(title, message);
};

export const handleUnauth = () => {
	const err = I18nT.tErr('UNAUTHENTICATE')
	XAlert.show(err.title, err.message, [
		true,
		{
			text: I18nT.t('Go to login screen'),
			onPress: () => RootAppNavigation.navigate(LOGIN_SCREEN)
		}

	]);
};

export const PROVIDER_ICON = {
	barber: require('../assets/icons/barber.png'),
	beauty_salon: require('../assets/icons/beauty_salon.png'),
	car_check: require('../assets/icons/car_check.png'),
	english_class: require('../assets/icons/english_class.png'),
	fitness: require('../assets/icons/fitness.png'),
	guitar: require('../assets/icons/guitar.png'),
	makeup: require('../assets/icons/makeup.png'),
	massage: require('../assets/icons/massage.png'),
	math: require('../assets/icons/math.png'),
	nails: require('../assets/icons/nails.png')
};