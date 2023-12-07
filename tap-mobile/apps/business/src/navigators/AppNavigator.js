import { createStackNavigator } from '@react-navigation/stack';
import { useStore } from 'xapp/src/store/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { AntDesign } from '@expo/vector-icons';
import { useIsUserLogged } from '../store/concreteStores';
import { CREATE_APPOINTMENT_SCREEN, CREATE_PERIOD_SCREEN, LOGIN_SCREEN, MAIN_STACK, MAIN_TAB_APPOINTMENTS, MAIN_TAB_REQUESTS, MAIN_TAB_SETTINGS, SERVICE_MANAGEMENT_SCREEN } from './routes';
import SettingsScreen from '../screens/SettingsScreen';
import { useColor, usePrimaryColor } from 'xapp/src/style/ThemeContext';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import RequestsScreen from '../screens/RequestsScreen';
import CreatePeriodScreen from '../screens/CreatePeriodScreen';
import { useHeaderBackButton } from 'xapp/src/common/hooks';
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
import LoginScreen from '../screens/LoginScreen';
import ServiceManagementScreen from '../screens/ServiceManagementScreen';

const BottomTab = createBottomTabNavigator();

const MainBottomTabNavigator = ({ navigation }) => {
	const t = useTranslation();
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

	const headerBackButton = useHeaderBackButton();

	return (
		<Stack.Navigator
			screenOptions={{
				headerTitleStyle: { fontFamily: font },
				headerLeft: headerBackButton
			}}>
			{
				logged ?
					<Stack.Group>
						<Stack.Screen
							name={MAIN_STACK}
							component={MainBottomTabNavigator}
							options={{
								headerShown: false,
								headerTitleStyle: { fontFamily: font }
							}}
						/>

						<Stack.Screen
							name={CREATE_PERIOD_SCREEN}
							component={CreatePeriodScreen}
							options={{
								title: t('Add time period'),

							}}
						/>
						<Stack.Screen
							name={CREATE_APPOINTMENT_SCREEN}
							component={CreateAppointmentScreen}
							options={{
								title: t('Create appointment')
							}}
						/>
						<Stack.Screen
							name={SERVICE_MANAGEMENT_SCREEN}
							component={ServiceManagementScreen}
							options={{
								title: t('Service management')
							}}
						/>
					</Stack.Group>
					:
					<Stack.Screen
						name={LOGIN_SCREEN}
						component={LoginScreen}
						options={{
							headerTransparent: true,
							title: ''
						}}
					/>
			}



		</Stack.Navigator>
	);
};

export default AppNavigator;