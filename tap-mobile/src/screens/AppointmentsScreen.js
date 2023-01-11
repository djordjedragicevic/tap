import Screen from '../components/Screen';
import XText from '../components/basic/XText';
import { useEffect } from 'react';
import { Http } from '../common/Http';

const AppointmentsScreen = ({ navigation, route }) => {

	useEffect(() => {
		let finish = true;
		Http.get("/appointments/", { duration: route.params.durationSum, companyId: route.params.companyId })
			.then(res => {
				if (finish)
					setCompany(res.data);
			});

		return () => finish = false;
	}, [])

	return (
		<Screen center>
			<XText>AppointmentsScreen, company id: {route.params.companyId}</XText>
			<XText>AppointmentsScreen, duration sum: {route.params.durationSum}</XText>
		</Screen>
	);
};

export default AppointmentsScreen;