import { createStackNavigator } from '@react-navigation/stack';
import { useStore } from 'xapp/src/store/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { AntDesign } from '@expo/vector-icons';
import { useIsUserLogged } from '../store/concreteStores';
import {
	APPOINTMENT_SCREEN,
	CUSTOM_PERIOD_SCREEN,
	LOGIN_SCREEN, MAIN_STACK,
	MAIN_TAB_APPOINTMENTS_CALENDAR,
	MAIN_TAB_REQUESTS,
	MAIN_TAB_SETTINGS
} from './routes';
import SettingsScreen from '../screens/SettingsScreen';
import { useColor, usePrimaryColor } from 'xapp/src/style/ThemeContext';
import AppointmentsCalendarScreen from '../screens/AppointmentsCalendarScreen';
import RequestsScreen from '../screens/RequestsScreen';
import CustomPeriodScreen from '../screens/CustomPeriodScreen';
import { useHeaderBackButton } from 'xapp/src/common/hooks';
import LoginScreen from '../screens/LoginScreen';
import AppointmentScreen from '../screens/AppointmentScreen';

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
			initialRouteName={MAIN_TAB_APPOINTMENTS_CALENDAR}
		>
			<BottomTab.Screen
				name={MAIN_TAB_APPOINTMENTS_CALENDAR}
				component={AppointmentsCalendarScreen}
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
							name={CUSTOM_PERIOD_SCREEN}
							component={CustomPeriodScreen}
							options={{
								title: t('Period'),

							}}
						/>
						<Stack.Screen
							name={APPOINTMENT_SCREEN}
							component={AppointmentScreen}
							options={{
								title: t('Appointment')
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