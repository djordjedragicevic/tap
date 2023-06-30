import { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { languages } from "../i18n/i18n";
import HeaderDrawerButton from "../components/HeaderDrawerButton";
import Screen from "../components/Screen";
import ThemeContext, { useThemedStyle } from "../style/ThemeContext";
import { THEME } from "../style/themes";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import I18nContext, { useTranslation } from "../i18n/I18nContext";
import { useGlobalStore } from "../store/globalStore";


const Test1 = () => {
	const [test1, dispatch] = useGlobalStore(false, (state) => state.test1);
	const [test2] = useGlobalStore(false, (state) => state.test2);


	console.log("RENDER TEST 1", test1);

	return <XButton onPress={() => dispatch('TEST_1')}>
		<XText >TEST 1: {test1}</XText>
	</XButton>
};

const Test2 = () => {
	const [test2, dispatch] = useGlobalStore(false, (state) => state.test2);

	// useEffect(() => {
	// 	console.log("TEST 2 - CHANGE test2", test2);
	// }, [test2]);

	// useEffect(() => {
	// 	console.log("TEST 2 - CHANGE dispatch FN");
	// }, [dispatch]);

	console.log("RENDER TEST 2", test2);
	return <XButton onPress={() => dispatch('TEST_2')}>
		<XText>TEST 2: {test2}</XText>
	</XButton>
};

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
			<Test1 />
			<Test2 />
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