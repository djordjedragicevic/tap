import { createStackNavigator } from "@react-navigation/stack";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import CalendarScreen from "../screens/CalendarScreen";
import CompaniesScreen from "../screens/CompaniesScreen";
import CompanyScreen from "../screens/CompanyScreen";
import { APPOINTMENTS_SCREEN, CALENDAR_SCREEN, COMPANIES_SCREEN, COMPANY_SCREEN } from "./routes";


const Stack = createStackNavigator();


const AppointmentsStackNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: true }}>
			<Stack.Screen name={COMPANIES_SCREEN} component={CompaniesScreen} options={{ title: 'Companies' }} />
			<Stack.Screen name={COMPANY_SCREEN} component={CompanyScreen} options={{ title: 'Company' }} />
			{/* <Stack.Screen name={CALENDAR_SCREEN} component={CalendarScreen} options={{ title: 'Calendar' }} /> */}
			<Stack.Screen name={APPOINTMENTS_SCREEN} component={AppointmentsScreen} options={{ title: 'Appointments' }} />
		</Stack.Navigator>
	);
};

export default AppointmentsStackNavigator;