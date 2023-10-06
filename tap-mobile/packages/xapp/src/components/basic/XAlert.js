import { Alert } from "react-native";
import I18n from "../../i18n/I18n";

class XAlert {

	static show(title, msg, btns) {

		if (!btns)
			btns = [{ text: I18n.translate('OK') }]
		else if (btns.lenght === 1 && btns[0].text == null)
			btns[0].text = I18n.translate('OK');
		else if (btns.lenght === 2) {
			btns[0].text = I18n.translate('Cacnel');
			btns[1].text = I18n.translate('OK');
		}

		Alert.alert(title, msg, btns);
	}
};

export default XAlert;