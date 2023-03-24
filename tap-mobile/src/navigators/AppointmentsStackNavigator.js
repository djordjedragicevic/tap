import { createStackNavigator } from "@react-navigation/stack";
import CompaniesScreen from "../screens/CompaniesScreen";
import CompanyScreen from "../screens/CompanyScreen";
import { COMPANIES_SCREEN, COMPANY_SCREEN } from "./routes";


const Stack = createStackNavigator();


const AppointmentsStackNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: true }}>
			<Stack.Screen name={COMPANIES_SCREEN} component={CompaniesScreen} options={{ title: 'Companies' }} />
			<Stack.Screen name={COMPANY_SCREEN} component={CompanyScreen} options={{ title: 'Company' }} />
			
		</Stack.Navigator>
	);
};

export default AppointmentsStackNavigator;