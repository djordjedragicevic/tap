import Screen from "../components/Screen";
import I18nContext, { useTranslation } from "../i18n/I18nContext";
import XButton from "../components/basic/XButton";
import { LOGIN_SCREEN } from "../navigators/routes";
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
import { languages } from "../i18n/i18n";
import XSection from "../components/basic/XSection";

const UserSettingsScreen = ({ navigation }) => {
	const t = useTranslation();
	const userName = useUserName();
	const roles = useStore(gS => gS.user.roles);
	const email = useStore(gS => gS.user.email);
	const isLogged = useIsUserLogged();

	const { themeId, setThemeId } = useContext(ThemeContext);
	const themeName = (themeId === THEME.SYSETM && Appearance.getColorScheme() === 'dark') || themeId === THEME.DARK ? 'Dark' : 'Light'

	const { lng, setLanguage } = useContext(I18nContext);

	const THEMES = useMemo(() => [
		{ id: 'Light', title: t('Light') },
		{ id: 'Dark', title: t('Dark') },
		{ id: 'System', title: t('Use device theme') }
	], [lng]);
	const LANGS = useMemo(() => [
		{ id: 'en_US', title: t('English') },
		{ id: 'sr_SP', title: t('Serbian') }
	], [lng]);

	const themeRef = useRef(null);
	const lngRef = useRef(null);


	const doLogout = () => {
		Http.setToken('');
		storeDispatch('user.log_out');
	};
	return (
		<Screen>
			{isLogged ?
				<TouchableOpacity>
					<XSection style={{ justifyContent: 'center' }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<XAvatar size={80} />
							<View style={{ flex: 1, marginLeft: 10 }}>
								<XText adjustsFontSizeToFit numberOfLines={1} size={25}>{userName}</XText>
								<XText secondary style={{ color: 'lightgreen' }}>{roles.join(', ')}</XText>
								<XText secondary>{email}</XText>
							</View>
						</View>
					</XSection>
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
				value={t(themeName)}
				style={{ marginTop: 10 }}
				//iconRight={(props) => <AntDesign name="right" {...props} />}
				onPress={() => themeRef.current?.present()}
			/>

			<XSelectField
				title={t('Language')}
				value={t(lng.name)}
				style={{ marginTop: 10 }}
				//iconRight={(props) => <AntDesign name="right" {...props} />}
				onPress={() => lngRef.current?.present()}
			/>

			{isLogged && <XButton bottom title={"Log out"} style={{ margin: 5, marginTop: 15 }} onPress={() => doLogout()} />}

			<XBottomSheetSelector
				ref={themeRef}
				title={t('Appearance')}
				data={THEMES}
				selectedId={themeId}
				onItemSelect={(item) => setThemeId(item.id)}
			/>

			<XBottomSheetSelector
				ref={lngRef}
				title={t('Language')}
				data={LANGS}
				selectedId={lng.id}
				onItemSelect={(item) => setLanguage(() => languages[item.id])}
			/>
		</Screen >

	);
}

export default UserSettingsScreen;