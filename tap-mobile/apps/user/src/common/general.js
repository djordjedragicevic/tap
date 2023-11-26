import XAlert from "xapp/src/components/basic/XAlert";
import I18n from "xapp/src/i18n/I18n"
import * as RootAppNavigation from '../navigators/RootAppNavigation';
import { LOGIN_SCREEN } from "../navigators/routes";

export const throwUnexpected = () => {
	const { title, message } = I18n.translateError('TAP_0');
	XAlert.show(title, message);
};

export const handleUnauth = () => {
	const err = I18n.translateError('UNAUTHENTICATE')
	XAlert.show(err.title, err.message, [
		true,
		{
			text: I18n.translate('Go to login screen'),
			onPress: () => RootAppNavigation.navigate(LOGIN_SCREEN)
		}

	])
};