import Screen from '../components/Screen';
import XText from '../components/basic/XText';

const AppointmentsScreen = ({ navigation, route }) => {
	return (
		<Screen center>
			<XText>AppointmentsScreen, company id: {route.params.companyId}</XText>
			<XText>AppointmentsScreen, duration sum: {route.params.durationSum}</XText>
		</Screen>
	);
};

export default AppointmentsScreen;