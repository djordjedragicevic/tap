import XScreen from "xapp/src/components/XScreen";
import { AntDesign } from '@expo/vector-icons';
import XButton from "xapp/src/components/basic/XButton";
import { LOGIN_SCREEN, FAVORITE_PROVIDERS_SCREEN } from "../navigators/routes";
import { useContext, useMemo } from "react";
import { Http } from "xapp/src/common/Http";
import { storeDispatch, useStore } from "xapp/src/store/store";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XText from "xapp/src/components/basic/XText";
import { Appearance, TouchableOpacity, View } from "react-native";
import { useIsUserLogged, useUserName } from "../store/concreteStores";
import XSelectField from "xapp/src/components/basic/XSelectField";
import ThemeContext from "xapp/src/style/ThemeContext";
import XSection from "xapp/src/components/basic/XSection";
import { Theme } from "xapp/src/style/themes";
import XSelector from "xapp/src/components/basic/XSelector";
import I18nContext, { useTranslation } from "xapp/src/i18n/I18nContext";

const UserSettingsScreen = ({ navigation }) => {
	const t = useTranslation();
	const userName = useUserName();
	const roles = useStore(gS => gS.user.roles);
	const email = useStore(gS => gS.user.email);
	const initials = useStore(gS => gS.user.initials);

	const isLogged = useIsUserLogged();

	const { themeId, setThemeId } = useContext(ThemeContext);
	const { lng, setLanguage } = useContext(I18nContext);

	const themeName = (themeId === Theme.SYSETM && Appearance.getColorScheme() === 'dark') || themeId === Theme.DARK ? 'Dark' : 'Light'


	const THEMES = useMemo(() => [
		{ id: 'Light', title: t('Light') },
		{ id: 'Dark', title: t('Dark') },
		{ id: 'System', title: t('Use device theme') }
	], [lng]);
	const LANGS = useMemo(() => [
		{ id: 'en_US', title: t('English') },
		{ id: 'sr_SP', title: t('Serbian') }
	], [lng]);


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
							<XAvatar size={80} initials={initials} />
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
					<XSection>
						<View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
							<XText adjustsFontSizeToFit numberOfLines={1} size={25}>{'Sign in'}</XText>
						</View>
					</XSection>
				</TouchableOpacity>
			}

			<XSelector
				title={t('Appearance')}
				value={t(themeName)}
				style={{ marginTop: 10 }}
				data={THEMES}
				onItemSelect={(item) => setThemeId(item.id)}
				selector={{
					title: t('Appearance')
				}}
			/>

			<XSelector
				title={t('Language')}
				value={t(lng.name)}
				style={{ marginTop: 10 }}
				data={LANGS}
				onItemSelect={(item) => setLanguage(item.id)}
				selector={{
					title: t('Language')
				}}
			/>

			{
				isLogged &&
				<XSelectField
					title={t('Saved')}
					style={{ marginTop: 10 }}
					iconRight={(props) => <AntDesign name="right" {...props} />}
					onPress={() => navigation.navigate(FAVORITE_PROVIDERS_SCREEN)}
				/>
			}

			{isLogged && <XButton bottom title={"Log out"} style={{ margin: 5, marginTop: 15 }} onPress={() => doLogout()} />}
		</XScreen>

	);
}

export default UserSettingsScreen;