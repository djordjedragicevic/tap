import Screen from "../components/Screen";
import { useTranslation } from "../i18n/I18nContext";
import XText from "../components/basic/XText";

const UserSettingsScreen = ({ }) => {
	const t = useTranslation();
	return (
		<Screen center>
			<XText>USER SCREE</XText>
		</Screen>
	);
}

export default UserSettingsScreen;