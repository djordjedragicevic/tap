import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MAIN_STACK_DRAWER, PROVIDERS_SCREEN } from './routes';
import ProvidersScreen from '../screens/ProvidersScreen';
import Try from '../screens/Try';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
	return (
		<Drawer.Navigator>
			<Drawer.Screen name={PROVIDERS_SCREEN} component={ProvidersScreen} />
			<Drawer.Screen name={'TRY'} component={Try} />
		</Drawer.Navigator>
	)
};


const MainStack = createStackNavigator();

const AppNavigator = () => {
	return (
		<MainStack.Navigator>
			<MainStack.Screen name={MAIN_STACK_DRAWER} component={DrawerNavigator} options={{ headerShown: false }} />
		</MainStack.Navigator>
	);
};

export default AppNavigator;