import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../screens/CalendarScreen';
import CompaniesScreen from '../screens/CompaniesScreen';
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
	return (
		<Tab.Navigator>
			<Tab.Screen name={'calendar'} component={CalendarScreen} />
			<Tab.Screen name={'companies'} component={CompaniesScreen}/>
		</Tab.Navigator>
	);
}

export default MainTabNavigator;