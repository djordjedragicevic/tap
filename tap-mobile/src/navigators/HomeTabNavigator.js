import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../screens/CalendarScreen';
import SearchScreen from '../screens/SearchScreen';
import AppointmentsStackNavigator from './AppointmentsStackNavigator';
import { CALENDAR_SCREEN, HOME_TAB_PROVIDERS, HOME_TAB_SEARCH } from './routes';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from "../store/I18nContext";


const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
	const t = useTranslation()
	return (
		<Tab.Navigator screenOptions={{ headerShown: false }}>
			<Tab.Screen
				name={HOME_TAB_PROVIDERS}
				component={AppointmentsStackNavigator}
				options={{
					title: t('Home'),
					tabBarIcon: (props) => <Icon {...props} name='home' />
				}}
				/>
			<Tab.Screen
				name={HOME_TAB_SEARCH}
				component={SearchScreen}
				options={{
					title: t('Search'),
					tabBarIcon: (props) => <Icon {...props} name='search' />
				}}
			/>
			{/* <Tab.Screen
				name={CALENDAR_SCREEN}
				component={CalendarScreen}
				options={{
					title: 'settings',
					tabBarIcon: (props) => <Icon {...props} name='settings' />
				}}
			/> */}

		</Tab.Navigator>
	);
}

export default HomeTabNavigator;