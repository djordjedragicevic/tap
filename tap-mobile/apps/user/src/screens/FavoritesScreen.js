import XScreen from "xapp/src/components/XScreen";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XText from "xapp/src/components/basic/XText";

const FavoritesScreen = ({ }) => {
	const t = useTranslation();
	return (
		<XScreen center>
			<XText>FAVORITES SCREEN</XText>
		</XScreen>
	);
}

export default FavoritesScreen;