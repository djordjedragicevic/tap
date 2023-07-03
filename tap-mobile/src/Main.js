import React, { useMemo } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { THEME } from './style/themes';
import { useTheme } from './style/ThemeContext';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import AppNavigator from './navigators/AppNavigator';
import { useStore } from './store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Main = () => {

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

	return (
		<>
			<StatusBar
				barStyle={theme.id === THEME.DARK ? 'light-content' : 'dark-content'}
				backgroundColor={theme.colors.backgroundElement}
			/>
			<SafeAreaProvider>
				<NavigationContainer theme={navTheme}>
					<AppNavigator />
				</NavigationContainer>
			</SafeAreaProvider>
		</>
	);
};

export default Main;
