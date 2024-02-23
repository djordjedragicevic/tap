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
	barber: require('../assets/svg/barber.svg'),
	beauty_salon: require('../assets/svg/beauty_salon.svg'),
	car_check: require('../assets/svg/car_check1.svg'),
	english_class: require('../assets/svg/english_class.svg'),
	fitness: require('../assets/svg/fitness1.svg'),
	guitar: require('../assets/svg/guitar.svg'),
	makeup: require('../assets/svg/makeup.svg'),
	massage: require('../assets/svg/massage.svg'),
	math: require('../assets/svg/math.svg'),
	nails: require('../assets/svg/nails.svg')
};