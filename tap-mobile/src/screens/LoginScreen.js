import Screen from "../components/Screen";
import { useTranslation } from "../i18n/I18nContext";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { MAIN_STACK, MAIN_TAB_HOME } from "../navigators/routes";

const LoginScreen = ({navigation}) => {
	const t = useTranslation();
	return (
		<Screen center>
			<XText>LOGIN SCREEN</XText>
			<XButton onPress={() => navigation.navigate(MAIN_STACK)} title={"ET"}/>
		</Screen>
	);
}

export default LoginScreen;