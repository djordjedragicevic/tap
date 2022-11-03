import React, { useEffect, useMemo } from 'react';
import { Http } from './common/Http';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigators/MainNavigator';
import { THEME } from './style/theme';
import { useTheme } from './store/ThemeContext';
import { StatusBar } from 'react-native';

const App = () => {

	// useEffect(() => {
	// 	console.log('GET DATA');

	// 	Http.send('/company').then((resp) => {
	// 		console.log(resp);
	// 	});
	// }, []);

	const { theme } = useTheme();
	const navTheme = useMemo(() => {
		const navigationTheme = theme.id === THEME.DARK ? DarkTheme : DefaultTheme;
		return {
			...navigationTheme,
			colors: {
				...navigationTheme.colors,
				background: theme.colors.background,
				card: theme.colors.backgroundElement,
				text: theme.colors.textPrimary,
				primary: theme.colors.primary
			}
		}
	}, [theme]);

	// console.log(navTheme)

	return (
		<>
			<StatusBar
				barStyle={theme.id === THEME.DARK ? 'light-content' : 'dark-content'}
				backgroundColor={theme.colors.backgroundElement}
			/>
			<NavigationContainer theme={navTheme}>
				<MainNavigator />
			</NavigationContainer>
		</>
	);
};

export default App;
