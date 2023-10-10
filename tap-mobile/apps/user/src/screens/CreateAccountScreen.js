import XScreen from "xapp/src/components/XScreen";
import { StyleSheet } from "react-native";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { useState } from "react";
import XButton from "xapp/src/components/basic/XButton";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { Http } from "xapp/src/common/Http";
import { VERIFICATION_CODE_SCREEN } from "../navigators/routes";
import { useLockNavigation } from "../common/useLockNavigation";
import { emptyFn } from 'xapp/src/common/utils';

const CreateAccountScreen = ({ navigation }) => {
	const [userName, setUserName] = useState('asdfdssss');
	const [email, setEmail] = useState('djordje.dragicevic89@gmail.com');
	const [password, setPassword] = useState('asdfdasf');
	const [loading, setLoading] = useState(false);

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();
	useLockNavigation(loading, navigation);

	const createAccont = () => {
		if (userName && email && password) {
			setLoading(true);
			Http.post('/user/create-account', {
				username: userName,
				email,
				password
			})
				.then(userId => {
					if (userId != null)
						navigation.navigate(VERIFICATION_CODE_SCREEN, { userId });

				})
				.catch(emptyFn)
				.finally(() => setLoading(false));
		}
	};


	return (
		<XScreen
			flat
			style={styles.screen}
			bigTitle={t('Sing Up')}
		>
			<XTextInput
				style={styles.input}
				value={userName}
				onChangeText={setUserName}
				disabled={loading}
				selectTextOnFocus
				onSubmitEditing={createAccont}
				outline
				title={t('Username')}
			/>
			<XTextInput
				style={styles.input}
				value={email}
				onChangeText={setEmail}
				disabled={loading}
				selectTextOnFocus
				onSubmitEditing={createAccont}
				outline
				title={t('Email')}
			/>
			<XTextInput
				value={password}
				style={styles.input}
				onChangeText={setPassword}
				disabled={loading}
				selectTextOnFocus
				onSubmitEditing={createAccont}
				secureTextEntry
				textContentType='password'
				outline
				title={t('Password')}
			/>
			<XButton
				title={t("Sing Up")}
				primary
				style={styles.button}
				onPress={createAccont}
				disabled={loading}
			/>
		</XScreen>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	screen: {
		backgroundColor: theme.colors.backgroundElement,
		paddingHorizontal: 30,
		paddingVertical: 5,
		rowGap: 10
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		marginHorizontal: 25,
		paddingVertical: 5
	},
	subContainer: {
		alignItems: 'center'
	},
	button: {
		marginTop: 35
	}
})

export default CreateAccountScreen;