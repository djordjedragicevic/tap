import { createStackNavigator } from '@react-navigation/stack';
import {
	FREE_APPOINTMENTS_SCREEN,
	LOGIN_SCREEN,
	MAIN_STACK,
	FAVORITE_PROVIDERS_SCREEN,
	MAIN_TAB_FIND,
	MAIN_TAB_HOME,
	MAIN_TAB_MY_APPOINTMENTS,
	MAIN_TAB_USER,
	PROVIDER_SCREEN,
	BOOK_APPOINTMENT_SCREEN,
	CREATE_ACCOUNT_SCREEN,
	VERIFICATION_CODE_SCREEN,
	MANAGE_ACCOUNT_SCREEN,
	MAP_SCREEN
} from './routes';
import ProvidersScreen from '../screens/ProvidersScreen';
import ProviderScreen from '../screens/provider/ProviderScreen';
import { useStore } from 'xapp/src/store/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { AntDesign } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import { useIsUserLogged } from '../store/concreteStores';
import XAvatar from 'xapp/src/components/basic/XAvatar';
import FreeAppointmentsScreen from '../screens/FreeAppointmentsScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';
import { useColor } from 'xapp/src/style/ThemeContext';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import MenageAccountScreen from '../screens/MenageAccountScreen';
import MapScreen from '../screens/MapScreen';

const BottomTab = createBottomTabNavigator();

const MainBottomTabNavigator = ({ navigation }) => {
	const t = useTranslation();
	const logged = useIsUserLogged();
	const initials = useStore(gS => gS.user.initials);
	const imgPath = useStore(gS => gS.user.imgPath);
	const colorTextLight = useColor('textLight');
	const colorPrimary = useColor('primary');

	return (
		<BottomTab.Navigator
			screenOptions={{
				tabBarStyle: {
					//backgroundColor: secondaryColor,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10
				}
			}}
			initialRouteName={MAIN_TAB_FIND}
		>
			<BottomTab.Screen
				name={MAIN_TAB_HOME}
				component={HomeScreen}
				options={{
					title: t("Home"),
					tabBarIcon: (props) => <AntDesign name="home" {...props} color={props.focused ? colorPrimary : colorTextLight} />
				}}
			/>
			<BottomTab.Screen
				name={MAIN_TAB_FIND}
				component={ProvidersScreen}
				options={{
					title: t("Find"),
					tabBarIcon: (props) => <AntDesign name="search1" {...props} color={props.focused ? colorPrimary : colorTextLight} />
				}}
			/>

			{logged &&
				<BottomTab.Screen
					name={MAIN_TAB_MY_APPOINTMENTS}
					component={MyAppointmentsScreen}
					options={{
						title: t("Appointments"),
						tabBarIcon: (props) => <AntDesign name="calendar" {...props} color={props.focused ? colorPrimary : colorTextLight} />
					}}
				/>
			}
			{/* <BottomTab.Screen
				name={'TRY'}
				component={TryScreen}
				options={{
					title: 'Settings',
					tabBarIcon: (props) => <AntDesign name="setting" {...props} color={props.focused ? colorPrimary : colorTextLight} />
				}}
			/> */}
			<BottomTab.Screen
				name={MAIN_TAB_USER}
				component={UserSettingsScreen}
				options={{
					headerShown: false,
					title: logged ? t("Profile") : t("Sign in"),
					tabBarIcon: (props) => logged ?
						<XAvatar
							imgPath={imgPath}
							initials={initials}
							size={props.size}
							style={!!props.focused && { borderColor: colorPrimary, borderWidth: 1.5 }}
						/>
						:
						<AntDesign name="user" {...props} color={props.focused ? colorPrimary : colorTextLight} />
				}} />
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

			<Stack.Screen
				options={{
					headerTransparent: true,
					title: ''
				}}
				name={LOGIN_SCREEN}
				component={LoginScreen}
			/>
			<Stack.Screen
				name={CREATE_ACCOUNT_SCREEN}
				component={CreateAccountScreen}
				options={{
					headerShown: true,
					headerTransparent: true,
					title: ''
				}}
			/>
			<Stack.Screen
				name={VERIFICATION_CODE_SCREEN}
				component={VerificationCodeScreen}
				options={{
					headerShown: true,
					headerTransparent: true,
					title: ''
				}}
			/>

			<Stack.Screen
				options={{
					headerShown: false
				}}
				name={PROVIDER_SCREEN}
				component={ProviderScreen}
			/>

			<Stack.Screen
				options={{
					headerShown: false
				}}
				name={MAP_SCREEN}
				component={MapScreen}
			/>

			{
				logged &&
				<>
					<Stack.Screen
						name={MANAGE_ACCOUNT_SCREEN}
						component={MenageAccountScreen}
						options={{
							title: t('User account')
						}}
					/>
					<Stack.Screen
						name={FAVORITE_PROVIDERS_SCREEN}
						component={FavoritesScreen}
						options={{
							title: t('Saved')
						}}
					/>
					<Stack.Screen
						name={FREE_APPOINTMENTS_SCREEN}
						component={FreeAppointmentsScreen}
						options={{
							title: t('Free appointments')
						}}
					/>
					<Stack.Screen
						name={BOOK_APPOINTMENT_SCREEN}
						component={BookAppointmentScreen}
						options={{
							title: t('Book appointment')
						}}
					/>
				</>
			}


		</Stack.Navigator>
	);
};

export default AppNavigator;