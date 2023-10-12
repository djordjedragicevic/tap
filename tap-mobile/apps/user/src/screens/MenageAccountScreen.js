import XScreen from "xapp/src/components/XScreen";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XText from "xapp/src/components/basic/XText";

const MenageAccountScreen = ({ }) => {
	const t = useTranslation();
	return (
		<XScreen center>
			<XText>MENAGE ACCOUNT</XText>
		</XScreen>
	);
}

export default MenageAccountScreen;