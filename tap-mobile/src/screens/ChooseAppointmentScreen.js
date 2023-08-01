import Screen from "../components/Screen";
import XText from "../components/basic/XText";

const ChooseAppointmentScreen = ({ navigation, route: { params: { services } } }) => {
	console.log(services);
	return (
		<Screen center>
			<XText>{services.join(',')}</XText>
		</Screen>
	);
}

export default ChooseAppointmentScreen;