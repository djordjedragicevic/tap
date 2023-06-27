import { createStackNavigator } from "@react-navigation/stack";
import ProvidersScreen from "../screens/ProvidersScreen";
import ProviderScreen from "../screens/ProviderScreen";
import { PROVIDER_SCREEN, PROVIDERS_SCREEN } from "./routes";


const Stack = createStackNavigator();


const AppointmentsStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerTitleStyle: { fontFamily: "Montserrat_500Medium" }
			}}
		>
			<Stack.Screen name={PROVIDERS_SCREEN} component={ProvidersScreen} options={{ title: 'Providers' }} />
			<Stack.Screen name={PROVIDER_SCREEN} component={ProviderScreen} options={{ title: 'Provider' }} />

		</Stack.Navigator>
	);
};

export default AppointmentsStackNavigator;