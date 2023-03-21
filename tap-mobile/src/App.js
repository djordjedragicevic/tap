import React, { useMemo } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { THEME } from './style/themes';
import { useTheme } from './store/ThemeContext';
import { StatusBar } from 'react-native';
import DrawerNavigator from './navigators/DrawerNavigator';
import MainTabNavigator from './navigators/MainTabNavigator';
import MainNavigator from './navigators/MainNavigator';

const App = () => {

	const { theme } = useTheme();
	const navTheme = useMemo(() => {
		const navigationTheme = theme.id === THEME.DARK ? DarkTheme : DefaultTheme;
		return {
			...navigationTheme,
			colors: {
				...navigationTheme.colors,
				background: theme.colors.background,
				//card: theme.colors.backgroundElement,
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
				<MainTabNavigator />
			</NavigationContainer>
		</>
	);
};

export default App;
