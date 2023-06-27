import { useContext, useEffect } from "react";
import { Button, StyleSheet, Text } from "react-native";
import { languages } from "../i18n/i18n";
import HeaderDrawerButton from "../components/HeaderDrawerButton";
import Screen from "../components/Screen";
import I18nContext, { useTranslation } from "../store/I18nContext";
import ThemeContext, { useThemedStyle } from "../store/ThemeContext";
import { THEME } from "../style/themes";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";


const Try = ({ navigation }) => {

	const themedStyle = useThemedStyle(createStyle);
	const themeContext = useContext(ThemeContext);

	const i18nContext = useContext(I18nContext);
	const t = useTranslation();

	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => <HeaderDrawerButton navigation={navigation} />
		});
	}, []);

	return (
		<Screen style={themedStyle.screen}>
			<XText style={themedStyle.text}>Try Screen</XText>
			<XButton title="Switch theme" onPress={() => themeContext.setTheme(themeContext.theme.id === THEME.DARK ? THEME.LIGHT : THEME.DARK)} />
			<XButton title="Transation" onPress={() => i18nContext.setLanguage(i18nContext.lng.code === languages.en_US.code ? languages.sr_SP : languages.en_US)} />
			<XText style={[themedStyle.text, { alignSelf: "center", fontSize: 20 }]}>{t('Language')}</XText>
		</Screen>
	);
};

const createStyle = (theme) => StyleSheet.create({
	screen: {
		backgroundColor: theme.colors.backgroundColor,
		justifyContent: 'space-around'
	},
	text: {
		color: theme.colors.textPrimary,
		fontWeight: '600'
	}
})

export default Try;