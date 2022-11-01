import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Http } from './common/Http';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigators/MainNavigator';

const App = () => {
	const [data, setData] = useState('TEST DATA');
	useEffect(() => {
		console.log("GET DATA");

		Http.send('/company')
			.then(resp => {
				setData(JSON.stringify(resp))
			});

	}, []);
	return (
		<NavigationContainer>
			<MainNavigator />
		</NavigationContainer>
	);
};

export default App;
