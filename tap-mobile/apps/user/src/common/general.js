import XAlert from "xapp/src/components/basic/XAlert";
import I18nT from "xapp/src/i18n/i18n"
import * as RootAppNavigation from '../navigators/RootAppNavigation';
import { LOGIN_SCREEN } from "../navigators/routes";

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

	])
};