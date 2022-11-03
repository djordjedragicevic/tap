import React, { useEffect } from 'react';
import { Http } from './common/Http';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigators/MainNavigator';
import { THEME } from './style/theme';
import { useTheme } from './store/ThemeContext';

const App = () => {

	// useEffect(() => {
	// 	console.log('GET DATA');

	// 	Http.send('/company').then((resp) => {
	// 		console.log(resp);
	// 	});
	// }, []);

	const { theme } = useTheme();
	
	return (
		<NavigationContainer theme={theme.id === THEME.DARK ? DarkTheme : DefaultTheme}>
			<MainNavigator />
		</NavigationContainer>
	);
};

export default App;
