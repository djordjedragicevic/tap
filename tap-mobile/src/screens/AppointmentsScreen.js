import { useEffect } from "react";
import { Http } from "../common/Http";
import XText from "../components/basic/XText";
import Screen from "../components/Screen";

const AppointmentsScreen = ({ route }) => {

	useEffect(() => {
		let finish = true;
		Http.get('/appointments/free-appointments', {
			cId: route.params.companyId,
			services: route.params.services,
			from: new Date().toISOString()
		}).then((resp) => {
			console.log("FREE APPS", JSON.stringify(resp));
		});

		return () => finish = false;
	}, []);


	return (
		<Screen>
			<XText>{route.params.services}</XText>
			<XText>{route.params.companyId}</XText>
		</Screen>
	);
}

export default AppointmentsScreen