import { useState } from "react";
import XScreen from "xapp/src/components/XScreen";
import XTextInput from "xapp/src/components/basic/XTextInput";
import XButton from "xapp/src/components/basic/XButton";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { Http } from 'xapp/src/common/Http';
import { emptyFn } from "xapp/src/common/utils";
import { storeDispatch } from "xapp/src/store/store";
import { View } from "react-native";


const ChangePasswordScreen = () => {

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatNewPassword, setRepeatNewPassword] = useState('');
	const t = useTranslation();

	const changePassword = () => {
		storeDispatch('app.mask', { maskText: t('Changing password') + '...' });

		Http.post('/user/change-password', {
			newPassword,
			oldPassword,
			repeatPassword: repeatNewPassword
		})
			.then(() => {
				Http.removeToken();
				storeDispatch('user.log_out');
			})
			.catch(emptyFn)
			.finally(() => storeDispatch('app.mask', false));
	};

	return (
		<XScreen
			rowGap={10}
			flat
			style={{ padding: 30 }}
		>
			<XTextInput
				title={t('Old password')}
				value={oldPassword}
				onChangeText={setOldPassword}
				outline
				secureTextEntry
			/>
			<XTextInput
				title={t('New password')}
				value={newPassword}
				onChangeText={setNewPassword}
				outline
				secureTextEntry
			/>
			<XTextInput
				title={t('Repeat new password')}
				value={repeatNewPassword}
				onChangeText={setRepeatNewPassword}
				outline
				secureTextEntry
			/>
			<XButton
				style={{ marginTop: 20 }}
				primary
				disabled={!oldPassword || !newPassword || !repeatNewPassword || newPassword !== repeatNewPassword}
				title={t('Change password_BTN')}
				onPress={changePassword}
			/>
		</XScreen>
	);
};

export default ChangePasswordScreen;