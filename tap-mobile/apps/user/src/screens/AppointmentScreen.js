import { useEffect, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import XScreen from "xapp/src/components/XScreen";
import AppointmentInfoSection from "../components/AppointmentInfoSection";
import utils from "../common/utils";

const AppointmentScreen = ({ route }) => {

	const id = route.params.id;
	const [data, setData] = useState();

	useEffect(() => {
		Http.get(`/appointment/${id}`)
			.then(data => {
				setData({
					...data,
					services: [{
						id: id,
						name: data.serviceName,
						price: data.servicePrice,
						start: DateUtils.getTimeFromDateTimeString(data.start),
						duration: data.serviceDuration,
						employeeName: data.employeeName,
						note: data.serviceNote
					}],
					_isHistory: utils.isHistoryServices(data.start)
				});
			})
			.catch(emptyFn);
	}, []);

	return (
		<XScreen scroll>
			<AppointmentInfoSection data={data} />
		</XScreen>
	);
};


export default AppointmentScreen;