import { Alert } from "react-native";

class XAlert {
	static show(title, msg, btns) {
		if (Array.isArray(btns)) {
			btns.reverse();
			if (btns[0] && btns[0].text == null)
				btns[0].text = 'Okej'
			if (btns[1] && btns[1].text == null)
				btns[1].text = 'Nemoj'
		}

		Alert.alert(title, msg, btns.reverse())
	}
};

export default XAlert;