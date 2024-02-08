import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import { LOGIN_SCREEN, FAVORITE_PROVIDERS_SCREEN, MANAGE_ACCOUNT_SCREEN } from "../navigators/routes";
import { useContext, useMemo } from "react";
import { Http } from "xapp/src/common/Http";
import { storeDispatch, useStore } from "xapp/src/store/store";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XText from "xapp/src/components/basic/XText";
import { Appearance, View } from "react-native";
import { useIsUserLogged } from "../store/concreteStores";
import XSelectField from "xapp/src/components/basic/XSelectField";
import ThemeContext, { useColor } from "xapp/src/style/ThemeContext";
import XSection from "xapp/src/components/basic/XSection";
import { Theme } from "xapp/src/style/themes";
import XSelector from "xapp/src/components/basic/XSelector";
import I18nContext, { useTranslation } from "xapp/src/i18n/I18nContext";

const UserSettingsScreen = ({ navigation }) => {
	const t = useTranslation();
	const { username, email, initials, imgPath } = useStore(gS => gS.user);

	const isLogged = useIsUserLogged();

	const { themeId, setThemeId } = useContext(ThemeContext);
	const { lng, setLanguage } = useContext(I18nContext);

	const themeName = (themeId === Theme.SYSETM && Appearance.getColorScheme() === 'dark') || themeId === Theme.DARK ? 'Dark' : 'Light'

	const THEMES = useMemo(() => [
		{ id: 'Light', title: t('Light') },
		{ id: 'Dark', title: t('Dark') },
		{ id: 'System', title: t('Use device theme') }
	], [lng]);
	const selectedTheme = THEMES.find(t => t.id === themeName);

	const LANGS = useMemo(() => [
		{ id: 'en_US', title: t('English') },
		{ id: 'sr_SP', title: t('Serbian') }
	], [lng]);
	const selectedLang = LANGS.find(l => l.id === lng.id) || 0;

	const doLogout = () => {
		Http.setToken('');
		storeDispatch('user.log_out');
	};

	const pLColor = useColor('secondary');
	return (
		<XScreen flat scroll>
			<View style={{ height: 220, justifyContent: 'space-around', alignItems: 'center', backgroundColor: pLColor, padding: 10 }}>
				{
					isLogged ?
						<>
							<XAvatar
								initials={initials}
								imgPath={imgPath}
								size={82}
							/>
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<XText light size={16}>{username}</XText>
								<XText light size={16}>{email}</XText>
							</View>
						</>
						:
						<>
							<View style={{ alignItems: 'center', rowGap: 5 }}>
								<XButtonIcon
									icon='login'
									size={50}
									primary
								/>
								<XText
									light
									style={{ textAlign: 'center' }}
								>
									{t('Sing in or create accoutn to manage your appointments, and more')}
								</XText>
							</View>
							<XButton
								title={t('Sing In')}
								primary
								onPress={() => navigation.navigate(LOGIN_SCREEN)}
							/>
						</>
				}
			</View>

			<View style={{ padding: 10, rowGap: 10 }}>

				<View style={{ rowGap: 8 }}>
					{
						isLogged &&
						<>
							<XSelectField
								title={t('Manage account')}
								iconLeft='user'
								iconRight='right'
								onPress={() => navigation.navigate(MANAGE_ACCOUNT_SCREEN)}
							/>
							<XSelectField
								title={t('Saved providers')}
								iconLeft='heart'
								iconRight='right'
								onPress={() => navigation.navigate(FAVORITE_PROVIDERS_SCREEN)}
							/>
						</>
					}
					<XSelector
						title={t('Appearance')}
						iconLeft='bulb1'
						value={t(themeName)}
						data={THEMES}
						selected={selectedTheme}
						onItemSelect={(item) => setThemeId(item.id)}
						selector={{
							title: t('Appearance')
						}}
					/>
					<XSelector
						title={t('Language')}
						iconLeft='earth'
						value={t(lng.name)}
						selected={selectedLang}
						data={LANGS}
						onItemSelect={(item) => setLanguage(item.id)}
						selector={{
							title: t('Language')
						}}
					/>
				</View>

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
			</View>
		</XScreen>

	);
}

export default UserSettingsScreen;