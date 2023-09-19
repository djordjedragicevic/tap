import { createStackNavigator } from '@react-navigation/stack';
import { BOOK_APPOINTMENT_SCREEN, FREE_APPOINTMENTS_SCREEN, LOGIN_SCREEN, MAIN_STACK, MAIN_TAB_FAVORITES, MAIN_TAB_FIND, MAIN_TAB_HOME, MAIN_TAB_USER, PROVIDERS_SCREEN, PROVIDER_SCREEN, SELECT_APPEARANCE_SCREEN, SELECT_LANGUAGE_SCREEN } from './routes';
import ProvidersScreen from '../screens/ProvidersScreen';
import ProviderScreen from '../screens/ProviderScreen';
import { useStore } from '../store/store';
import { useCallback, useEffect } from 'react';
import FavoriteButton from '../components/FavoriteButton';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import { useTranslation } from '../i18n/I18nContext';
import { AntDesign } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import { useIsUserLogged } from '../store/concreteStores';
import XAvatar from '../components/basic/XAvatar';
import FreeAppointmentsScreen from '../screens/FreeAppointmentsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';


const stack = createStackNavigator();

const TabFindStackNavigator = ({ navigation }) => {
	const font = useStore(s => s.app.font);
	return (
		<stack.Navigator
			screenOptions={{
				headerTitleStyle: { fontFamily: font },
			}}>
			<stack.Screen
				name={PROVIDERS_SCREEN}
				component={ProvidersScreen}
			/>
			<stack.Screen
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
			{/* <stack.Screen
				name={"T2"}
				component={TryAH}
				options={{
					headerTransparent: true
				}}
			/> */}
		</stack.Navigator >
	)
};

const BottomTab = createBottomTabNavigator();

const MainBottomTabNavigator = ({ navigation }) => {
	const t = useTranslation();
	const logged = useIsUserLogged();


	const onTabPress = useCallback((e) => {
		if (!logged && (e.target.startsWith(MAIN_TAB_FAVORITES))) {
			e.preventDefault();
			navigation.navigate(LOGIN_SCREEN);
		}
	}, [logged, navigation]);

	return (
		<BottomTab.Navigator
			screenListeners={{
				tabPress: onTabPress,
			}}
			initialRouteName={MAIN_TAB_FIND}
		>
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
			<BottomTab.Screen
				name={MAIN_TAB_FAVORITES + "S"}
				component={FavoritesScreen}
				options={{
					title: t("Saved"),
					tabBarIcon: (props) => <AntDesign name="hearto" {...props} />
				}}
			/>
			<BottomTab.Screen
				name={MAIN_TAB_USER}
				component={UserSettingsScreen}
				options={{
					title: logged ? t("Profile") : t("Sign in"),
					tabBarIcon: (props) => logged ?
						<XAvatar {...props} />
						:
						<AntDesign name="user" {...props} />
				}} />
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
	const t = useTranslation();
	return (
		<stack.Navigator>
			<stack.Screen
				name={MAIN_STACK}
				component={MainBottomTabNavigator}
				options={{
					headerShown: false,
					headerTitleStyle: { fontFamily: font }
				}}
			/>
			<stack.Group
				screenOptions={{
					presentation: 'containedModal',
					animation: 'slide_from_bottom',
					animationDuration: 100
				}}
			>
				<stack.Screen
					options={{ headerShown: false }}
					name={LOGIN_SCREEN}
					component={LoginScreen}
				/>
			</stack.Group>

			<stack.Screen
				name={FREE_APPOINTMENTS_SCREEN}
				component={FreeAppointmentsScreen}
				options={{
					title: t('Free appointments')
				}}
			/>
			<stack.Screen
				name={BOOK_APPOINTMENT_SCREEN}
				component={BookAppointmentScreen}
				options={{
					title: t('Book appointment')
				}}
			/>
		</stack.Navigator>
	);
};

export default AppNavigator;