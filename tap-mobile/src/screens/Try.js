import { useContext } from "react";
import { Button, StyleSheet, Text } from "react-native";
import { languages } from "../common/i18n";
import Screen from "../components/Screen";
import I18nContext, { useTranslation } from "../store/I18nContext";
import ThemeContext, { useThemedStyle } from "../store/ThemeContext";
import { THEME } from "../style/theme";

const Try = () => {

	const themedStyle = useThemedStyle(createStyle);
	const themeContext = useContext(ThemeContext);

	const i18nContext = useContext(I18nContext);
	const t = useTranslation();

	return (
		<Screen style={themedStyle.screen}>
			<Text style={themedStyle.text}>Try Screen</Text>
			<Button title="Switch thene" onPress={() => themeContext.setTheme(themeContext.theme.id === THEME.DARK ? THEME.LIGHT : THEME.DARK)} />
			<Button title="Transation" onPress={() => i18nContext.setLanguage(i18nContext.lng.code === languages.en_US.code ? languages.sr_SP : languages.en_US)} />
			<Text style={[themedStyle.text, { alignSelf: "center", fontSize: 20 }]}>{t('Language')}</Text>
		</Screen>
	);
};

const createStyle = (theme) => StyleSheet.create({
	screen: {
		backgroundColor: theme.colors.backgroundColor
	},
	text: {
		color: theme.colors.textPrimary
	}
})

export default Try;