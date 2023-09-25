import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XTextInput from "xapp/src/components/basic/XTextInput";
import XAlert from "xapp/src/components/basic/XAlert";
import { useState } from "react";
import { useLockNavigation } from "../common/useLockNavigation";
import { storeDispatch } from "xapp/src/store/store";
import { Http } from "xapp/src/common/Http";

const LoginScreen = ({ navigation }) => {
	const [userName, setUserName] = useState('gazdadjoka');
	const [password, setPassword] = useState('admin');
	const [loading] = useState(false);

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
			const msg = err.name === Http.ERR.UNAUTHENTICATE ? 'Invalid username/email or password' : 'Unexpected error occurred'
			XAlert.show('Login error', msg)
		}



	};
	return (
		<XScreen style={{ justifyContent: 'center' }} loading={loading}>
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
				primary
				style={{ margin: 5, marginTop: 15 }}
				onPress={doLogin}
				disabled={loading}
			/>
		</XScreen>
	);
}

export default LoginScreen;