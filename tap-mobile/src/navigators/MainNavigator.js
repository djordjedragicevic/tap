import React from 'react';
import {
	createStackNavigator,
	TransitionPresets,
} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AppointmentsScreen from '../screens/user/AppointmentsScreen';
import { HOME_SCREEM, USER_APPINTMENTS_SCREEN } from './routes';

const Stack = createStackNavigator();

const MainNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
			<Stack.Screen name={HOME_SCREEM} component={HomeScreen} />
			<Stack.Screen
				name={USER_APPINTMENTS_SCREEN}
				component={AppointmentsScreen}
			/>
		</Stack.Navigator>
	);
};

export default MainNavigator;
