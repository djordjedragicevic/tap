import { createStackNavigator } from "@react-navigation/stack";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import DrawerNavigator from "./DrawerNavigator";
import { MAIN_FREE_APPOINTMENTS, MAIN_HOME } from "./routes";

const Stack = createStackNavigator();

const MainNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name={MAIN_HOME} component={DrawerNavigator} />

			<Stack.Screen name={MAIN_FREE_APPOINTMENTS} component={AppointmentsScreen} options={{ title: 'Appointments' }} />
		
		</Stack.Navigator>
	);
}

export default MainNavigator;