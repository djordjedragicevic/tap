import XText from "../components/basic/XText";
import XTextInput from "../components/basic/XTextInput";
import Screen from "../components/Screen";
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from "../store/I18nContext";
import XButton from "../components/basic/XButton";
import { ScrollView, StyleSheet, View } from "react-native";
import XSelectField from "../components/basic/XSelectField";

const SearchScreen = ({ }) => {
	const t = useTranslation();
	return (
		<Screen style={{ justifyContent: 'center' }}>
			<ScrollView style={{}}>
				<XSelectField
					placeholder={t('Location')}
					value='Banja Luka'
					editable={false}
					iconRight={(props) => <Icon {...props} name='add' />}
					iconLeft={(props) => <Icon {...props} name='location' />}
				/>

				<XSelectField
					placeholder={t('Service type')}
					style={styles.field}
					iconRight={(props) => <Icon {...props} name='add' />}
					iconLeft={(props) => <Icon {...props} name='ios-list' />}
				/>
				<XSelectField
					placeholder={t('Services')}
					style={styles.field}
					iconRight={(props) => <Icon {...props} name='add' />}
					iconLeft={(props) => <Icon {...props} name='ios-construct' />}
				/>
				<XSelectField
					placeholder={t('Company')}
					style={styles.field}
					iconRight={(props) => <Icon {...props} name='add' />}
					iconLeft={(props) => <Icon {...props} name='ios-business' />}
				/>
				<XSelectField
					placeholder={t('From')}
					value="Now"
					style={styles.field}
					iconRight={(props) => <Icon {...props} name='add' />}
					iconLeft={(props) => <Icon {...props} name='calendar' />}
				/>
				<XButton style={{ marginTop: 30 }} title={t('Search')} />
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	field: {
		marginTop: 5
	}
})

export default SearchScreen;