import { ScrollView } from 'react-native';
import XScreen from "xapp/src/components/XScreen";
import { useHTTPGet } from 'xapp/src/common/Http';
import { useStore } from "xapp/src/store/store";
import TimePeriodsPanel from "../components/time-periods/TimePeriodPanel";
import TimePeriod from '../components/time-periods/TimePeriod';
import { useState } from 'react';

const AppointmentsScreen = () => {

	const sizeCoef = useState(1)[0];
	const pId = useStore(gS => gS.provider.id);

	//const [employeeData] = useHTTPGet('/appointments/' + pId)

	return (
		<XScreen scroll>
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