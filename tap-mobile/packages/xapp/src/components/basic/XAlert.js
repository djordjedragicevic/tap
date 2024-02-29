import { Alert } from "react-native";
import I18nT from "../../i18n/i18n";

class XAlert {

	static YESNO = 'YESNO';

	static show(title, msg, btns, type) {
		if (!btns)
			btns = [{ text: I18nT.t('OK') }]
		else if (btns.length === 1 && btns[0].text == null)
			btns[0].text = I18nT.t('OK');

		else if (btns.length === 2) {
			if (btns[0] === true)
				btns[0] = {};


			if (!btns[0]?.text)
				btns[0].text = I18nT.t(type !== XAlert.YESNO ? 'Cancel' : 'No');

			if (!btns[1]?.text)
				btns[1].text = I18nT.t(type !== XAlert.YESNO ? 'OK' : 'Yes');
		}

		Alert.alert(title, msg, btns);
	}

	static showYesNo(title, msg, btns) {
		XAlert.show(title, msg, btns, XAlert.YESNO);
	}
	

	static askEdit(cb) {
		XAlert.showYesNo(I18nT.t("Edit item"), I18nT.t("Edit item_MSG"), [
			true,
			{ onPress: cb }
		]);
	}

	static askAdd(cb) {
		XAlert.showYesNo(I18nT.t("Add item"), I18nT.t("Add item_MSG"), [
			true,
			{ onPress: cb }
		]);
	}

	static askDelete(cb) {
		XAlert.showYesNo(I18nT.t("Delete item"), I18nT.t("Delete item_MSG"), [
			true,
			{ onPress: cb }
		]);
	}
};

export default XAlert;