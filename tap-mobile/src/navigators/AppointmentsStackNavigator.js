import { createStackNavigator } from "@react-navigation/stack";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import CompaniesScreen from "../screens/CompaniesScreen";
import CompanyScreen from "../screens/CompanyScreen";
import { APPOINTMENTS_SCREEN, COMPANIES_SCREEN, COMPANY_SCREEN } from "./routes";


const Stack = createStackNavigator();


const AppointmentsStackNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: true }}>
			<Stack.Screen name={COMPANIES_SCREEN} component={CompaniesScreen} options={{ title: 'Companies' }} />
			<Stack.Screen name={COMPANY_SCREEN} component={CompanyScreen} options={{ title: 'Company' }} />
			<Stack.Screen name={APPOINTMENTS_SCREEN} component={AppointmentsScreen} options={{ title: 'Appintments' }} />
		</Stack.Navigator>
	);
};

export default AppointmentsStackNavigator;