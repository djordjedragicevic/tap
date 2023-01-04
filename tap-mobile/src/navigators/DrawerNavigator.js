import Try from "../screens/Try";
import { useTranslation } from "../store/I18nContext";
import AppointmentsStackNavigator from "./AppointmentsStackNavigator";
import { DRAWER_APPOINTMENTS } from "./routes";
import { HeaderBackButton } from '@react-navigation/elements';
import {
	DrawerContentScrollView,
	DrawerItemList,
	createDrawerNavigator,
	DrawerItem
} from '@react-navigation/drawer';
import { View } from "react-native";
import XText from "../components/basic/XText";


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
			<Drawer.Screen name={DRAWER_APPOINTMENTS} component={AppointmentsStackNavigator} options={{ title: t('Appointments') }} />
			<Drawer.Screen name={'TRY'} component={Try} options={{ headerShown: true }} />
		</Drawer.Navigator>
	);
};

export default DrawerNavigator;