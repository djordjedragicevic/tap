import Screen from "../components/Screen";
import { useTranslation } from "../i18n/I18nContext";
import XButton from "../components/basic/XButton";
import XTextInput from "../components/basic/XTextInput";
import XAlert from "../components/basic/XAlert";
import { useState } from "react";
import { useLockNavigation } from "../common/useLockNavigation";
import { Http } from "../common/Http";
import { ERR } from "../common/err";
import { storeDispatch } from "../store/store";

const LoginScreen = ({ navigation }) => {
	const t = useTranslation();
	const [userName, setUserName] = useState('gazdadjoka');
	const [password, setPassword] = useState('admin');
	const [loading, setLoading] = useState(false);

	useLockNavigation(loading, navigation);

	const doLogin = async () => {

		try {
			const resp = await Http.post('/auth/login', { userName, password });
			if (resp && resp.token) {
				await Http.setToken(resp.token);

				const user = await Http.get('/user/by-token');
				storeDispatch('user.set_data', user);

				navigation.goBack();
			}

		} catch (err) {
			const msg = err.name === ERR.UNAUTHENTICATE ? 'Invalid username/email or password' : 'Unexpected error occurred'
			XAlert.show('Login error', msg)
		}



	};
	return (
		<Screen style={{ justifyContent: 'center' }} loading={loading}>
			<XTextInput
				value={userName}
				placeholder={'User name'}
				style={{ margin: 5 }}
				onChangeText={setUserName}
				disabled={loading}
				selectTextOnFocus
				onSubmitEditing={doLogin}
			/>
			<XTextInput
				value={password}
				placeholder={'User name'}
				style={{ margin: 5 }}
				onChangeText={setPassword}
				disabled={loading}
				selectTextOnFocus
				onSubmitEditing={doLogin}
				secureTextEntry
				textContentType='password'
			/>
			<XButton
				title={"Log in"}
				style={{ margin: 5, marginTop: 15 }}
				onPress={doLogin}
				disabled={loading}
			/>
		</Screen>
	);
}

export default LoginScreen;