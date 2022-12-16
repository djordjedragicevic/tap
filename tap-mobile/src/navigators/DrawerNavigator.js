import { createDrawerNavigator } from "@react-navigation/drawer";
import Try from "../screens/Try";
import { useTranslation } from "../store/I18nContext";
import AppointmentsStackNavigator from "./AppointmentsStackNavigator";
import { DRAWER_APPOINTMENTS } from "./routes";


const Drawer = createDrawerNavigator();


const DrawerNavigator = () => {
	const t = useTranslation();
	return (
		<Drawer.Navigator screenOptions={{ headerShown: false }}>
			<Drawer.Screen name={DRAWER_APPOINTMENTS} component={AppointmentsStackNavigator} options={{ title: t('Appointments') }} />
			<Drawer.Screen name={'TRY'} component={Try} />
		</Drawer.Navigator>
	);
};

export default DrawerNavigator;