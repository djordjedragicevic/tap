import XButton from "xapp/src/components/basic/XButton";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useState } from "react";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { View, StyleSheet } from "react-native";
import XText from "xapp/src/components/basic/XText";
import XLink from "xapp/src/components/basic/XLink";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import emptyFn from '../common/utils';

const XLoginForm = ({
	onSignIn = emptyFn,
	onSignUp = emptyFn,
	loading
}) => {

	const [username, setUsername] = useState('djoka');
	const [password, setPassword] = useState('test');

	const t = useTranslation();
	const styles = useThemedStyle(styleCreator);

	const doSignIn = () => {
		onSignIn(username, password);
	};

	return (

		<View style={{
			rowGap: 10,
			paddingTop: 20
		}}>
			<XTextInput
				style={styles.input}
				value={username}
				onChangeText={setUsername}
				disabled={loading}
				selectTextOnFocus
				onSubmitEditing={doSignIn}
				outline
				title={t('Username or email')}
			/>
			<XTextInput
				value={password}
				style={styles.input}
				onChangeText={setPassword}
				disabled={loading}
				selectTextOnFocus
				onSubmitEditing={doSignIn}
				secureTextEntry
				textContentType='password'
				outline
				title={t('Password')}
			/>
			<XButton
				title={t("Sing In")}
				primary
				style={styles.button}
				onPress={doSignIn}
				disabled={loading}
			/>

			<View style={styles.singUpContainer}>
				<XText>{t("Don't have an account?")}</XText>
				<XLink style={styles.link} onPress={onSignUp}>{t("Sing Up")}</XLink>
			</View>
		</View>

	);
}

const styleCreator = (theme) => StyleSheet.create({
	singUpContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		columnGap: 5
	},
	input: {
		//marginTop: 5
	},
	button: {
		marginTop: 45
	},
	link: {
		marginTop: 20
	}
})

export default XLoginForm;