/**
 * @author Djordje Dragicevic <djordje.dragicevic@yahoo.com>
 */
import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { languages } from '../common/i18n';
import { USER_APPINTMENTS_SCREEN } from '../navigators/routes';
import I18nContext, { useTranslation } from '../store/I18nContext';
import { useTheme, useThemedStyle } from '../store/ThemeContext';
import { THEME, Theme } from '../style/theme';

const HomeScreen = ({ navigation }) => {
	const { theme, setTheme } = useTheme();
	const styles = useThemedStyle(createStyle);
	const t = useTranslation();
	const { lng, setLanguage } = useContext(I18nContext);

	return (
		<View style={styles.screen}>
			<Text style={styles.text}>{t('Test translation')}</Text>
			<Button
				title="Switch languages"
				onPress={() => {
					setLanguage(lng.code === 'en_US' ? languages['sr_SP'] : languages['en_US'])
				}}
			/>

			<Button
				title={t("Go to Details")}
				onPress={() => navigation.navigate(USER_APPINTMENTS_SCREEN)}
			/>
			<Text style={styles.text}>{theme.id}</Text>
			<Button
				title="Swithc theme"
				onPress={() => setTheme(theme.id === THEME.DARK ? Theme.Light : Theme.Dark)}
			/>
		</View>
	);
};

const createStyle = (theme) => {
	return StyleSheet.create({
		text: {
			color: theme.colors.textPrimary
		},
		screen: {
			flex: 1,
			justifyContent: 'space-around',
			alignItems: 'center'
		},
	});
}

export default HomeScreen;
