import XScreen from "xapp/src/components/XScreen";
import { AntDesign } from '@expo/vector-icons';
import XButton from "xapp/src/components/basic/XButton";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import { LOGIN_SCREEN, FAVORITE_PROVIDERS_SCREEN } from "../navigators/routes";
import { useContext, useMemo } from "react";
import { Http } from "xapp/src/common/Http";
import { storeDispatch, useStore } from "xapp/src/store/store";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XText from "xapp/src/components/basic/XText";
import { Appearance, ScrollView, View } from "react-native";
import { useIsUserLogged, useUserName } from "../store/concreteStores";
import XSelectField from "xapp/src/components/basic/XSelectField";
import ThemeContext, { useColor } from "xapp/src/style/ThemeContext";
import XSection from "xapp/src/components/basic/XSection";
import { Theme } from "xapp/src/style/themes";
import XSelector from "xapp/src/components/basic/XSelector";
import I18nContext, { useTranslation } from "xapp/src/i18n/I18nContext";

const UserSettingsScreen = ({ navigation }) => {
	const t = useTranslation();
	const username = useUserName();
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
	const selectedThemeIdx = THEMES.findIndex(t => t.id === themeName) || 0;

	const LANGS = useMemo(() => [
		{ id: 'en_US', title: t('English') },
		{ id: 'sr_SP', title: t('Serbian') }
	], [lng]);
	const selectedLangIdx = LANGS.findIndex(l => l.id === lng.id) || 0;

	const doLogout = () => {
		Http.setToken('');
		storeDispatch('user.log_out');
	};

	const pLColor = useColor('secondary');
	return (
		<XScreen flat>
			<View style={{ height: 200, justifyContent: 'center', alignItems: 'center', rowGap: 15, backgroundColor: pLColor }}>
				{
					isLogged ?
						<>
							<XAvatar initials={initials} size={72} />
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								{/* <XText secondary style={{ color: 'lightgreen' }}>{roles.join(', ')}</XText> */}
								<XText light size={16}>{username}</XText>
								<XText light size={16}>{email}</XText>
							</View>
						</>
						:
						<>
							<XButtonIcon
								icon='login'
								size={50}
								primary
							/>
							<XText
								light
								style={{ textAlign: 'center' }}
							>
								{'Sing in or create accoutn to manage your appointments, and more'}
							</XText>
							<XButton
								title={'Sing In'}
								primary
								onPress={() => navigation.navigate(LOGIN_SCREEN)}
							/>
						</>
				}
			</View>

			<ScrollView contentContainerStyle={{ padding: 10, rowGap: 2 }}>
				<XSelector
					title={t('Appearance')}
					iconLeft='bulb1'
					value={t(themeName)}
					data={THEMES}
					initSelectedIdx={selectedThemeIdx}
					onItemSelect={(item) => setThemeId(item.id)}
					selector={{
						title: t('Appearance')
					}}
				/>

				<XSelector
					title={t('Language')}
					iconLeft='earth'
					value={t(lng.name)}
					initSelectedIdx={selectedLangIdx}
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
						iconLeft='heart'
						iconRight='right'
						onPress={() => navigation.navigate(FAVORITE_PROVIDERS_SCREEN)}
					/>
				}

				{isLogged &&
					<XButton
						bottom
						iconLeft='logout'
						textColor='red'
						title={"Log out"}
						uppercase={false}
						style={{ marginTop: 15 }}
						onPress={doLogout}
					/>
				}
			</ScrollView>
		</XScreen>

	);
}

export default UserSettingsScreen;