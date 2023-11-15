import { createStackNavigator } from '@react-navigation/stack';
import { useStore } from 'xapp/src/store/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { AntDesign } from '@expo/vector-icons';
import { useIsUserLogged } from '../store/concreteStores';
import { MAIN_STACK, MAIN_TAB_APPOINTMENTS, MAIN_TAB_REQUESTS, MAIN_TAB_SETTINGS } from './routes';
import SettingsScreen from '../screens/SettingsScreen';
import { useColor, usePrimaryColor } from 'xapp/src/style/ThemeContext';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import RequestsScreen from '../screens/RequestsScreen';

const BottomTab = createBottomTabNavigator();

const MainBottomTabNavigator = ({ navigation }) => {
	const t = useTranslation();
	const logged = useIsUserLogged();
	const colorPrimary = usePrimaryColor();
	const colorTextLight = useColor('textLight');

	return (
		<BottomTab.Navigator
			screenOptions={{
				tabBarStyle: {
					//backgroundColor: secondaryColor,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10
				}
			}}
			initialRouteName={MAIN_TAB_APPOINTMENTS}
		>
			<BottomTab.Screen
				name={MAIN_TAB_APPOINTMENTS}
				component={AppointmentsScreen}
				options={{
					title: t("Appointments"),
					headerShown: false,
					tabBarIcon: (props) => <AntDesign name="calendar" {...props} color={props.focused ? colorPrimary : colorTextLight} />
				}}
			/>
			<BottomTab.Screen
				name={MAIN_TAB_REQUESTS}
				component={RequestsScreen}
				options={{
					title: t("Requests"),
					headerShown: false,
					tabBarIcon: (props) => <AntDesign name="exception1" {...props} color={props.focused ? colorPrimary : colorTextLight} />
				}}
			/>
			<BottomTab.Screen
				name={MAIN_TAB_SETTINGS}
				component={SettingsScreen}
				options={{
					title: t("Settings"),
					tabBarIcon: (props) => <AntDesign name="setting" {...props} color={props.focused ? colorPrimary : colorTextLight} />
				}}
			/>
		</BottomTab.Navigator>
	)
};

const Stack = createStackNavigator();

const AppNavigator = ({ }) => {
	const font = useStore(s => s.app.font);
	const t = useTranslation();
	const logged = useIsUserLogged();
	return (
		<Stack.Navigator>
			<Stack.Screen
				name={MAIN_STACK}
				component={MainBottomTabNavigator}
				options={{
					headerShown: false,
					headerTitleStyle: { fontFamily: font }
				}}
			/>

		</Stack.Navigator>
	);
};

export default AppNavigator;