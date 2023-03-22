import Try from "../screens/Try";
import { useTranslation } from "../store/I18nContext";
import { DRAWER_CALENDAR, DRAWER_HOME } from "./routes";
import { HeaderBackButton } from '@react-navigation/elements';
import {
	DrawerContentScrollView,
	DrawerItemList,
	createDrawerNavigator,
} from '@react-navigation/drawer';
import { View } from "react-native";
import XText from "../components/basic/XText";
import HomeTabNavigator from "./HomeTabNavigator";
import CalendarScreen from "../screens/CalendarScreen";


const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {
	return (
		<DrawerContentScrollView {...props}>
			<View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
				<XText>Djordje Dragicevic</XText>
			</View>
			<DrawerItemList {...props} />
		</DrawerContentScrollView>
	)
};

const DrawerNavigator = () => {
	const t = useTranslation();
	return (
		<Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={(props) => <CustomDrawerContent {...props} />}>
			<Drawer.Screen
				name={DRAWER_HOME}
				component={HomeTabNavigator}
				options={{ title: t('Home') }}
			/>
			<Drawer.Screen
				name={DRAWER_CALENDAR}
				component={CalendarScreen}
				options={{ 
					title: t('Calendar'),
					headerShown: true
				}}
			/>
			<Drawer.Screen
				name={'TRY'}
				component={Try}
				options={{ headerShown: true }}
			/>
		</Drawer.Navigator>
	);
};

export default DrawerNavigator;