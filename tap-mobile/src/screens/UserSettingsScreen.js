import Screen from "../components/Screen";
import I18nContext, { useTranslation } from "../i18n/I18nContext";
import XButton from "../components/basic/XButton";
import { LOGIN_SCREEN } from "../navigators/routes";
import { useContext } from "react";
import { languages } from "../i18n/i18n";
import { Http } from "../common/Http";
import { storeDispatch } from "../store/store";

const UserSettingsScreen = ({ navigation }) => {
	const t = useTranslation();
	const { setLanguage } = useContext(I18nContext);
	const doLogout = () => {
		Http.setToken('');
		storeDispatch('user.log_out');
	};
	return (
		<Screen center>
			<XButton title={"Log in"} style={{ margin: 5, marginTop: 15, width: '100%' }} onPress={() => navigation.navigate(LOGIN_SCREEN)} />
			<XButton title={"LNG"} style={{ margin: 5, marginTop: 15, width: '100%' }} onPress={() => setLanguage(languages.sr_SP)} />
			<XButton title={"Log out"} style={{ margin: 5, marginTop: 15, width: '100%' }} onPress={() => doLogout()} />
		</Screen>
	);
}

export default UserSettingsScreen;