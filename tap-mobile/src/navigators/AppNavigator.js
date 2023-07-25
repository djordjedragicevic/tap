import { createStackNavigator } from '@react-navigation/stack';
import { MAIN_STACK_TAB_NAVIGATOR, MAIN_TAB_FAVORITES, MAIN_TAB_FIND, MAIN_TAB_HOME, MAIN_TAB_USER, PROVIDERS_SCREEN, PROVIDER_SCREEN } from './routes';
import ProvidersScreen from '../screens/ProvidersScreen';
import ProviderScreen from '../screens/ProviderScreen';
import Try from '../screens/Try';
import { useStore } from '../store/store';
import HeaderDrawerButton from '../components/HeaderDrawerButton';
import { useCallback } from 'react';
import TryAH from '../screens/TryAH';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoriteButton from '../components/FavoriteButton';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import { useTranslation } from '../i18n/I18nContext';

import { AntDesign } from '@expo/vector-icons';
import { View } from 'react-native';



const NativeStack = createNativeStackNavigator();


const TabFindStackNavigator = ({ navigation }) => {
	const font = useStore(s => s.app.font);
	return (
		<NativeStack.Navigator
			screenOptions={{
				headerTitleStyle: { fontFamily: font },
			}}>
			<NativeStack.Screen
				name={PROVIDERS_SCREEN}
				component={ProvidersScreen}
			/>
			<NativeStack.Screen
				options={{
					headerTransparent: true,
					// headerBackground: () => (
					// 	<BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
					// )
					//headerShown: false
					headerRight: (props) => <FavoriteButton color={props.tintColor} />
				}}
				name={PROVIDER_SCREEN}
				component={ProviderScreen}
			/>
			{/* <NativeStack.Screen
				name={"T2"}
				component={TryAH}
				options={{
					headerTransparent: true
				}}
			/> */}
		</NativeStack.Navigator >
	)
};

const BottomTab = createBottomTabNavigator();

const MainBottomTabNavigator = () => {
	const t = useTranslation();
	const logged = useStore(gS => gS.user.isLogged);
	return (
		<BottomTab.Navigator>
			<BottomTab.Screen
				name={MAIN_TAB_HOME}
				component={HomeScreen}
				options={{
					title: t("Home"),
					tabBarIcon: (props) => <AntDesign name="home" {...props} />
				}}
			/>
			<BottomTab.Screen
				name={MAIN_TAB_FIND}
				component={TabFindStackNavigator}
				options={{
					title: t("Find"), headerShown: false,
					tabBarIcon: (props) => <AntDesign name="search1" {...props} />
				}}
			/>
			<BottomTab.Screen
				name={MAIN_TAB_FAVORITES}
				component={FavoritesScreen}
				options={{
					title: t("Saved"),
					tabBarIcon: (props) => <AntDesign name="hearto" {...props} />
				}}
			/>
			{
				logged ?
					<BottomTab.Screen
						name={MAIN_TAB_USER}
						component={UserSettingsScreen}
						options={{
							title: t("Profile"),
							tabBarIcon: (props) => <AntDesign name="user" {...props} />

						}} />
					:
					<BottomTab.Screen
						name={MAIN_TAB_USER}
						component={UserSettingsScreen}
						options={{
							title: t("Sign in"),
							tabBarIcon: (props) => (<View style={{ height: props.size, width: props.size, backgroundColor: 'orange', borderRadius: 7 }}></View>)
						}}
					/>
			}
		</BottomTab.Navigator>
	)
}
// const Drawer = createDrawerNavigator();
// const DrawerNavigator = () => {
// 	const font = useStore(s => s.app.font);
// 	const t = useTranslation();
// 	return (
// 		<Drawer.Navigator screenOptions={{ headerShown: false, drawerLabelStyle: { fontFamily: font } }}>
// 			<Drawer.Screen name={DRAWER_HOME} component={HomeStackNavigator} options={{ title: t("Home") }} />
// 			<Drawer.Screen name={'TRY'} component={Try} />
// 		</Drawer.Navigator>
// 	)
// };


const MainStack = createStackNavigator();
const AppNavigator = () => {
	const font = useStore(s => s.app.font);
	return (
		<MainStack.Navigator>
			<MainStack.Screen
				name={MAIN_STACK_TAB_NAVIGATOR}
				component={MainBottomTabNavigator}
				options={{
					headerShown: false,
					headerTitleStyle: { fontFamily: font }
				}}
			/>
		</MainStack.Navigator>
	);
};

export default AppNavigator;