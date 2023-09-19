import XScreen from "xapp/src/components/XScreen";
import { useTranslation } from "../i18n/I18nContext";
import XText from "xapp/src/components/basic/XText";

const SelectAppearanceScreen = ({ }) => {
	const t = useTranslation();
	return (
		<XScreen center>
			<XText>SelectApperienceScreen</XText>
		</XScreen>
	);
}

export default SelectAppearanceScreen;