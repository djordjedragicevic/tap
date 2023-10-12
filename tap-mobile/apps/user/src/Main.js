import React, { useMemo } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useTheme } from 'xapp/src/style/ThemeContext';
import { StatusBar } from 'react-native';
import AppNavigator from './navigators/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import XOverlay from 'xapp/src/components/basic/XOverlay';
import { Theme } from 'xapp/src/style/themes';

const Main = () => {

	const theme = useTheme();
	const navRef = useNavigationContainerRef();
	const navTheme = useMemo(() => {
		const navigationTheme = theme.id === Theme.DARK ? DarkTheme : DefaultTheme;
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

	return (
		<>
			<StatusBar barStyle={'light-content'} backgroundColor={theme.colors.secondary} />

			<SafeAreaProvider>
				<BottomSheetModalProvider>
					<NavigationContainer theme={navTheme} ref={navRef}>
						<AppNavigator />
					</NavigationContainer>
				</BottomSheetModalProvider>
			</SafeAreaProvider>

			<XOverlay />
		</>
	);
};

export default Main;
