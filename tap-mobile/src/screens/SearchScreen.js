import XText from "../components/basic/XText";
import XTextInput from "../components/basic/XTextInput";
import Screen from "../components/Screen";
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from "../store/I18nContext";
import XButton from "../components/basic/XButton";
import { View } from "react-native";

const SearchScreen = ({ }) => {
	const t = useTranslation();
	return (
		<Screen style={{ alignItems: 'center', justifyContent: 'center' }}>
			<View style={{ minWidth: 300 }}>
				<XTextInput
					//placeholder={'aaaa'}
					//style={{ maxWidth: 100 }}
					placeholder={t('City')}
					editable={false}
					iconRight={(props) => <Icon {...props} name='search' />}
				/>

				<XTextInput
					//placeholder={'aaaa'}
					//style={{ maxWidth: 100 }}
					placeholder={t('Service')}
					editable={false}
					style={{ marginTop: 10 }}
					iconRight={(props) => <Icon {...props} name='search' />}
				/>
				<XButton style={{ marginTop: 30 }} title={t('Search')} />
			</View>
		</Screen>
	);
}

export default SearchScreen;