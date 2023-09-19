import { Alert } from "react-native";
import { i18n } from "../../i18n/I18nContext";

class XAlert {

	static show(title, msg, btns) {

		if (!btns)
			btns = [{ text: i18n.translate('OK') }]
		else if (btns.lenght === 1 && btns[0].text == null)
			btns[0].text = i18n.translate('OK');
		else if (btns.lenght === 2) {
			btns[0].text = i18n.translate('Cacnel');
			btns[1].text = i18n.translate('OK');
		}

		Alert.alert(title, msg, btns);
	}
};

export default XAlert;