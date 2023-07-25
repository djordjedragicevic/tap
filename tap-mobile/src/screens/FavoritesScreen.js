import Screen from "../components/Screen";
import { useTranslation } from "../i18n/I18nContext";
import XText from "../components/basic/XText";

const FavoritesScreen = ({ }) => {
	const t = useTranslation();
	return (
		<Screen center>
			<XText>FAVORITES SCREEN</XText>
		</Screen>
	);
}

export default FavoritesScreen;