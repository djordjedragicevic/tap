import Screen from "../components/Screen";
import I18nContext, { useTranslation } from "../i18n/I18nContext";
import XButton from "../components/basic/XButton";
import { LOGIN_SCREEN } from "../navigators/routes";
import { useContext } from "react";
import { Http } from "../common/Http";
import { storeDispatch, useStore } from "../store/store";
import XAvatar from "../components/basic/XAvatar";
import XContainer from "../components/basic/XContainer";
import XText from "../components/basic/XText";
import { TouchableOpacity, View } from "react-native";
import { useIsUserLogged, useUserName } from "../store/concreteStores";
import XSelectField from "../components/basic/XSelectField";
import XSwitchField from "../components/basic/XSwitchField";
import { AntDesign } from '@expo/vector-icons';

const UserSettingsScreen = ({ navigation }) => {
	const t = useTranslation();
	const userName = useUserName();
	const roles = useStore(gS => gS.user.roles);
	const email = useStore(gS => gS.user.email);
	const isLogged = useIsUserLogged();

	const { setLanguage } = useContext(I18nContext);
	const doLogout = () => {
		Http.setToken('');
		storeDispatch('user.log_out');
	};
	return (
		<Screen>
			{isLogged ?
				<TouchableOpacity>
					<XContainer style={{ justifyContent: 'center', padding: 10 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<XAvatar size={80} />
							<View style={{ flex: 1, marginLeft: 10 }}>
								<XText adjustsFontSizeToFit numberOfLines={1} size={25}>{userName}</XText>
								<XText secondary style={{ color: 'lightgreen' }}>{roles.join(', ')}</XText>
								<XText secondary>{email}</XText>
							</View>
						</View>
					</XContainer>
				</TouchableOpacity>
				:
				<TouchableOpacity onPress={() => navigation.navigate(LOGIN_SCREEN)}>
					<XContainer style={{ justifyContent: 'center', padding: 10, height: 100, alignItems: 'center' }}>
						<XText adjustsFontSizeToFit numberOfLines={1} size={25}>{'Sign in'}</XText>
					</XContainer>
				</TouchableOpacity>
			}

			<XSelectField
				title={'Apperience'}
				value={'Dark'}
				style={{ marginTop: 10 }}
				iconRight={(props) => <AntDesign name="right" {...props} />}
			/>

			<XSelectField
				title={'Language'}
				value={'Srpski'}
				style={{ marginTop: 10 }}
				iconRight={(props) => <AntDesign name="right" {...props} />}
			/>

			<XButton bottom title={"Log out"} style={{ margin: 5, marginTop: 15, width: '100%' }} onPress={() => doLogout()} />
		</Screen >
	);
}

export default UserSettingsScreen;