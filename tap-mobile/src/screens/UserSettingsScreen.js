import Screen from "../components/Screen";
import I18nContext, { useTranslation } from "../i18n/I18nContext";
import XButton from "../components/basic/XButton";
import { LOGIN_SCREEN, SELECT_LANGUAGE_SCREEN } from "../navigators/routes";
import { useContext, useMemo, useRef } from "react";
import { Http } from "../common/Http";
import { storeDispatch, useStore } from "../store/store";
import XAvatar from "../components/basic/XAvatar";
import XContainer from "../components/basic/XContainer";
import XText from "../components/basic/XText";
import { Appearance, TouchableOpacity, View } from "react-native";
import { useIsUserLogged, useUserName } from "../store/concreteStores";
import XSelectField from "../components/basic/XSelectField";
import { AntDesign } from '@expo/vector-icons';
import ThemeContext from "../style/ThemeContext";
import { THEME } from "../style/themes";
import XBottomSheetSelector from "../components/basic/XBottomSheetSelector";

const UserSettingsScreen = ({ navigation }) => {
	const t = useTranslation();
	const userName = useUserName();
	const roles = useStore(gS => gS.user.roles);
	const email = useStore(gS => gS.user.email);
	const isLogged = useIsUserLogged();

	const { themeId, setThemeId } = useContext(ThemeContext);
	const themeName = (themeId === THEME.SYSETM && Appearance.getColorScheme() === 'dark') || themeId === THEME.DARK ? t('Dark') : t('Light')

	const { setLanguage } = useContext(I18nContext);

	const THEMES = useMemo(() => [
		{ id: 'Light', title: t('Light theme') },
		{ id: 'Dark', title: t('Dark theme') },
		{ id: 'System', title: t('Use device theme') }
	], []);

	const sheetRef = useRef(null);


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
				title={t('Appearance')}
				value={themeName}
				style={{ marginTop: 10 }}
				iconRight={(props) => <AntDesign name="right" {...props} />}
				onPress={() => sheetRef.current?.present()}
			/>

			<XSelectField
				title={'Language'}
				value={'Srpski'}
				style={{ marginTop: 10 }}
				iconRight={(props) => <AntDesign name="right" {...props} />}
				onPress={() => navigation.navigate(SELECT_LANGUAGE_SCREEN)}
			/>

			{isLogged && <XButton bottom title={"Log out"} style={{ margin: 5, marginTop: 15 }} onPress={() => doLogout()} />}

			<XBottomSheetSelector
				ref={sheetRef}
				title={t('Appearance')}
				data={THEMES}
				selectedId={themeId}
				onItemSelect={(item) => setThemeId(item.id)}
			/>
		</Screen >

	);
}

export default UserSettingsScreen;