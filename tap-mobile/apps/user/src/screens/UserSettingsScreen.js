import XScreen from "xapp/src/components/XScreen";
import I18nContext, { useTranslation } from "xapp/src/i18n/I18nContext";
import XButton from "xapp/src/components/basic/XButton";
import { LOGIN_SCREEN } from "../navigators/routes";
import { useContext, useMemo, useRef } from "react";
import { Http } from "xapp/src/common/Http";
import { storeDispatch, useStore } from "xapp/src/store/store";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XContainer from "xapp/src/components/basic/XContainer";
import XText from "xapp/src/components/basic/XText";
import { Appearance, TouchableOpacity, View } from "react-native";
import { useIsUserLogged, useUserName } from "../store/concreteStores";
import XSelectField from "xapp/src/components/basic/XSelectField";
import ThemeContext from "xapp/src/style/ThemeContext";
import XBottomSheetSelector from "xapp/src/components/basic/XBottomSheetSelector";
import XSection from "xapp/src/components/basic/XSection";
import { Theme } from "xapp/src/style/themes";

const UserSettingsScreen = ({ navigation }) => {
	const t = useTranslation();
	const userName = useUserName();
	const roles = useStore(gS => gS.user.roles);
	const email = useStore(gS => gS.user.email);
	const isLogged = useIsUserLogged();

	const { themeId, setThemeId } = useContext(ThemeContext);
	const themeName = (themeId === Theme.SYSETM && Appearance.getColorScheme() === 'dark') || themeId === Theme.DARK ? 'Dark' : 'Light'

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
		<XScreen>
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
				onItemSelect={(item) => setLanguage(item.id)}
			/>
		</XScreen>

	);
}

export default UserSettingsScreen;