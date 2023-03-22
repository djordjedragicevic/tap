import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "./DrawerNavigator";
import { MAIN_HOME } from "./routes";

const Stack = createStackNavigator();

const MainNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name={MAIN_HOME} component={DrawerNavigator} />
		</Stack.Navigator>
	);
}

export default MainNavigator;