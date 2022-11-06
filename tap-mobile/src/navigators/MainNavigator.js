import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CompaniesScreen from '../screens/CompaniesScreen';
import AppointmentsScreen from '../screens/user/AppointmentsScreen';
import { COMPANIES_SCREEN, COMPANY_SCREEN, USER_APPINTMENTS_SCREEN } from './routes';
import Try from '../screens/Try';
import CompanyScreen from '../screens/CompnayScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{
			//...TransitionPresets.SlideFromRightIOS
		}}>
			<Stack.Screen
				name={COMPANIES_SCREEN}
				component={CompaniesScreen}
			/>
			<Stack.Screen
				name={COMPANY_SCREEN}
				component={CompanyScreen}
			/>
			<Stack.Screen
				name={USER_APPINTMENTS_SCREEN}
				component={AppointmentsScreen}
			/>
			<Stack.Screen name={"try"} component={Try} />
		</Stack.Navigator>
	);
};

export default MainNavigator;
