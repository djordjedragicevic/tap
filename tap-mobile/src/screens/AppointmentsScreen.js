import Screen from '../components/Screen';
import XText from '../components/basic/XText';

const AppointmentsScreen = ({ navigation, route }) => {
	return (
		<Screen center>
			<XText>AppointmentsScreen, company id: {route.params.id}</XText>
		</Screen>
	);
};

export default AppointmentsScreen;