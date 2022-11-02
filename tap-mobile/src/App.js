import React from 'react';
import { useEffect } from 'react';
import { Http } from './common/Http';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigators/MainNavigator';

const App = () => {
	useEffect(() => {
		console.log('GET DATA');

		Http.send('/company').then((resp) => {
			console.log(resp);
		});
	}, []);
	return (
		<NavigationContainer>
			<MainNavigator />
		</NavigationContainer>
	);
};

export default App;
