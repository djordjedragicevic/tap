import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useCallback, useEffect, useState } from "react";
import { storeDispatch } from "xapp/src/store/store";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { StyleSheet } from "react-native";
import XText from "xapp/src/components/basic/XText";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Http } from 'xapp/src/common/Http';
import XLoginForm from "xapp/src/components/XLoginForm";

const LoginScreen = ({ navigation }) => {
	const [loading, setLoading] = useState(false);

	const t = useTranslation();
	const styles = useThemedStyle(styleCreator);

	const doLogin = async (username, password) => {

		setLoading(true);
		try {
			const resp = await Http.post('/app/login', { username, password });

			if (resp.token) {
				await Http.setToken(resp.token);

				const data = await Http.get('/provider/employee-data');
				storeDispatch('user.login', data);
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
		//navigation.navigate(CREATE_ACCOUNT_SCREEN);
	}, [navigation])

	return (
		<XScreen
			style={styles.screen}
			loading={loading}
			flat
		>
			<XText size={32} style={{ textAlign: 'center' }}>{t('Sing In')}</XText>
			<XLoginForm
				onSignIn={doLogin}

			/>
		</XScreen>
	);
}

const styleCreator = (theme) => StyleSheet.create({
	screen: {
		//backgroundColor: theme.colors.backgroundElement,
		paddingHorizontal: 30,
		paddingVertical: 5,
		justifyContent: 'space-evenly'
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