import Screen from "../components/Screen";
import { useTranslation } from "../i18n/I18nContext";
import XText from "../components/basic/XText";

const SelectLanguageScreen = ({ }) => {
	const t = useTranslation();
	return (
		<Screen center>
			<XText>SelectLanguageScreen</XText>
		</Screen>
	);
}

export default SelectLanguageScreen;