import XAlert from "xapp/src/components/basic/XAlert";
import I18n from "xapp/src/i18n/I18n"

export const throwUnexpected = () => {
	const { title, message } = I18n.translateError('TAP_0');
	XAlert.show(title, message);
}