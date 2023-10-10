import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useCallback, useEffect, useState } from "react";
import { useLockNavigation } from "../common/useLockNavigation";
import { storeDispatch } from "xapp/src/store/store";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { View, StyleSheet } from "react-native";
import XText from "xapp/src/components/basic/XText";
import XLink from "xapp/src/components/basic/XLink";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { CREATE_ACCOUNT_SCREEN, VERIFICATION_CODE_SCREEN } from "../navigators/routes";
import { Http } from 'xapp/src/common/Http';
import { throwUnexpected } from "../common/general";

const LoginScreen = ({ navigation }) => {
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const t = useTranslation();
	const styles = useThemedStyle(styleCreator);

	const doLogin = async () => {

		setLoading(true);
		try {
			const resp = await Http.post('/auth/login', { userName, password });
			if (resp?.token) {
				await Http.setToken(resp.token);

				const user = await Http.get('/user/by-token');

				storeDispatch('user.set_data', user);

				navigation.goBack();
			}
			else if (resp?.unverified) {
				navigation.navigate(VERIFICATION_CODE_SCREEN, { userId: resp.userId, userName, password });
			}

		}
		catch (err) { }
		finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (loading)
				setLoading(false);
		}
	}, [loading])

	const goToCreateAccount = useCallback(() => {
		navigation.navigate(CREATE_ACCOUNT_SCREEN);
	}, [navigation])

	return (
		<XScreen
			style={styles.screen}
			loading={loading}
			flat
			bigTitle={t('Sing In')}
		>
			<View style={{
				rowGap: 10,
				paddingTop: 20
			}}>
				<XTextInput
					style={styles.input}
					value={userName}
					onChangeText={setUserName}
					disabled={loading}
					selectTextOnFocus
					onSubmitEditing={doLogin}
					outline
					title={t('Username or email')}
				/>
				<XTextInput
					value={password}
					style={styles.input}
					onChangeText={setPassword}
					disabled={loading}
					selectTextOnFocus
					onSubmitEditing={doLogin}
					secureTextEntry
					textContentType='password'
					outline
					title={t('Password')}
				/>
				<XButton
					title={t("Sing In")}
					primary
					style={styles.button}
					onPress={doLogin}
					disabled={loading}
				/>

				<View style={styles.singUpContainer}>
					<XText>{t("Don't have an account?")}</XText>
					<XLink style={styles.link} onPress={goToCreateAccount}>{t("Sing Up")}</XLink>
				</View>

			</View>
		</XScreen>
	);
}

const styleCreator = (theme) => StyleSheet.create({
	screen: {
		//backgroundColor: theme.colors.backgroundElement,
		paddingHorizontal: 30,
		paddingVertical: 5
	},
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

export default LoginScreen;