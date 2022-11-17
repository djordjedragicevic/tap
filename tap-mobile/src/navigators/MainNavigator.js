import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppointmentsScreen from '../screens/user/AppointmentsScreen';
import { COMPANY_LIST_SCREEN, USER_APPINTMENTS_SCREEN } from './routes';
import Try from '../screens/Try';
import CompanyListScreen from '../screens/CompanyListScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{
			//...TransitionPresets.SlideFromRightIOS
		}}>
			<Stack.Screen name={"try"} component={Try} />
			<Stack.Screen
				name={COMPANY_LIST_SCREEN}
				component={CompanyListScreen}
			/>
			<Stack.Screen
				name={USER_APPINTMENTS_SCREEN}
				component={AppointmentsScreen}
			/>
		</Stack.Navigator>
	);
};

export default MainNavigator;
