import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DRAWER_HOME, MAIN_STACK_DRAWER, PROVIDERS_SCREEN, PROVIDER_SCREEN } from './routes';
import ProvidersScreen from '../screens/ProvidersScreen';
import ProviderScreen from '../screens/ProviderScreen';
import Try from '../screens/Try';
import { useStore } from '../store/store';
import HeaderDrawerButton from '../components/HeaderDrawerButton';
import { useCallback } from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import TryAH from '../screens/TryAH';


const HomeStack = createStackNavigator();

const HomeStackNavigator = ({ navigation }) => {
	const font = useStore(s => s.app.font);
	const getHeaderLeft = useCallback(() => <HeaderDrawerButton navigation={navigation} />, [navigation]);

	return (
		<HomeStack.Navigator
			screenOptions={{
				headerTitleStyle: { fontFamily: font },
				headerLeft: getHeaderLeft
			}}>
			<HomeStack.Screen
				name={PROVIDERS_SCREEN}
				component={ProvidersScreen}
			/>
			<HomeStack.Screen
				options={{
					// headerTransparent: true,
					// headerBackground: () => (
					// 	<BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
					// )
					headerShown: false
				}}
				name={PROVIDER_SCREEN}
				component={ProviderScreen}
			/>
			<HomeStack.Screen
				name={"T2"}
				component={TryAH}
				options={{
					headerTransparent: true
				}}
			/>
		</HomeStack.Navigator >
	)
};


const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
	const font = useStore(s => s.app.font);
	return (
		<Drawer.Navigator screenOptions={{ headerShown: false, drawerLabelStyle: { fontFamily: font } }}>
			<Drawer.Screen name={DRAWER_HOME} component={HomeStackNavigator} />
			<Drawer.Screen name={'TRY'} component={Try} />
		</Drawer.Navigator>
	)
};


const MainStack = createStackNavigator();
const AppNavigator = () => {
	const font = useStore(s => s.app.font);
	return (
		<MainStack.Navigator>
			<MainStack.Screen
				name={MAIN_STACK_DRAWER}
				component={DrawerNavigator}
				options={{
					headerShown: false,
					headerTitleStyle: { fontFamily: font }
				}}
			/>
		</MainStack.Navigator>
	);
};

export default AppNavigator;