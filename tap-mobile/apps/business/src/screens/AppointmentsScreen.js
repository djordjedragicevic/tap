import { ScrollView } from 'react-native';
import XScreen from "xapp/src/components/XScreen";
import { Http, useHTTPGet } from 'xapp/src/common/Http';
import { useStore } from "xapp/src/store/store";
import TimePeriodsPanel from "../components/time-periods/TimePeriodPanel";
import TimePeriod from '../components/time-periods/TimePeriod';
import { useEffect, useState } from 'react';
import XFieldDatePicker from "xapp/src/components/basic/XFieldDataPicker";
import { emptyFn } from 'xapp/src/common/utils';

const AppointmentsScreen = () => {

	const sizeCoef = useState(1)[0];
	const pId = useStore(gS => gS.provider.id);
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState(new Date(2023, 10, 23));

	//const [employeeData] = useHTTPGet('/appointments/' + pId)
	useEffect(() => {
		setLoading(true);
		let finish = true;
		Http.get(`/appointments/${pId}`, { date: date })
			.then(reps => {
				if (finish) {
					console.log(reps);
					setData(reps);
				}
			})
			.catch(emptyFn)
			.finally(setLoading)
		return () => finish = false;
	}, [date]);

	return (
		<XScreen scroll loading={loading}>
			<XFieldDatePicker
				style={{ marginBottom: 10 }}
				onConfirm={setDate}
				initDate={date}
			/>
			<TimePeriodsPanel
				sizeCoef={sizeCoef}
				startHour={9}
				endHour={22}
				data={[]}
			/>
		</XScreen>
	);
}

export default AppointmentsScreen;