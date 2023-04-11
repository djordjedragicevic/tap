import XSelectField from "../components/basic/XSelectField";
import Screen from "../components/Screen";
import Icon from 'react-native-vector-icons/Ionicons'
import { useTranslation } from "../store/I18nContext";

const HomeScreen = ({ }) => {
	const t = useTranslation();
	return (
		<Screen>
			<XSelectField
				iconLeft={(props) => <Icon {...props} name='search' />}
				value={t('Find appointment')}
				style={{ height: 70 }}

			/>
		</Screen>
	);
}

export default HomeScreen;