import { createStackNavigator } from "@react-navigation/stack";
import CompanyListScreen from "../screens/CompanyListScreen";
import { COMPANY_LIST_SCREEN } from "./routes";


const Stack = createStackNavigator();


const AppointmentsStackNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name={COMPANY_LIST_SCREEN} component={CompanyListScreen} />
		</Stack.Navigator>
	);
};

export default AppointmentsStackNavigator;