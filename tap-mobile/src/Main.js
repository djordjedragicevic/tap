import React, { useMemo } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { THEME } from './style/themes';
import { useTheme } from './style/ThemeContext';
import { StatusBar } from 'react-native';
import AppNavigator from './navigators/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import XOverlay from './components/basic/XOverlay';

const Main = () => {

	const theme = useTheme();
	const navRef = useNavigationContainerRef();
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
				<BottomSheetModalProvider>
					<NavigationContainer
						theme={navTheme}
						ref={navRef}
						onStateChange={state => {
							const route = navRef.getCurrentRoute();
							// if (route.name === MAIN_TAB_USER) {
							// 	navRef.dispatch({
							// 		...StackActions.replace(LAOGIN_SCREEN),
							// 		source: route.key,
							// 		target: navRef.getState().key
							// 	})
							// }
						}}
					>
						<AppNavigator />
					</NavigationContainer>
				</BottomSheetModalProvider>
			</SafeAreaProvider>

			<XOverlay />
		</>
	);
};

export default Main;
