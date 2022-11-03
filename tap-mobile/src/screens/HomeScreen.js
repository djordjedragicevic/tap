/**
 * @author Djordje Dragicevic <djordje.dragicevic@yahoo.com>
 */
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { USER_APPINTMENTS_SCREEN } from '../navigators/routes';
import { useTheme, useThemedStyle } from '../store/ThemeContext';
import { THEME, Theme } from '../style/theme';

const HomeScreen = ({ navigation }) => {
	const { theme, setTheme } = useTheme();
	const styles = useThemedStyle(createStyle);

	return (
		<View style={styles.screen}>
			<Text style={styles.text}>HOME SCREEN</Text>
			<Button
				title="Go to Details"
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
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: theme.colors.backgroundPrimary
		},
	});
}

export default HomeScreen;
