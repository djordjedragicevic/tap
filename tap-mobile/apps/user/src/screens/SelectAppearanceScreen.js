import Screen from "../components/Screen";
import { useTranslation } from "../i18n/I18nContext";
import XText from "../components/basic/XText";

const SelectAppearanceScreen = ({ }) => {
	const t = useTranslation();
	return (
		<Screen center>
			<XText>SelectApperienceScreen</XText>
		</Screen>
	);
}

export default SelectAppearanceScreen;