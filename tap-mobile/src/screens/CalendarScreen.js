import Screen from '../components/Screen';
import XText from '../components/basic/XText';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Http } from '../common/Http';
import { Alert, ScrollView, View } from 'react-native';
import { calcucateTopDate, calcucateTopTime, calculateHeightDate, calculateHeightTime } from '../common/utils';
import TimePeriod from '../components/time-periods/TimePeriod';
import TimePeriodsPanel from '../components/time-periods/TimePeriodPanel';
import XAlert from '../components/basic/XAlert';



const CalendarScreen = ({ navigation, route }) => {

	const [sizeCoef, setSizeCoef] = useState(3);

	const [data, setData] = useState();

	useEffect(() => {
		let finish = true;
		Http.get("/appointments/free/appointments", {
			cId: route.params.companyId,
			services: route.params.services,
			from: new Date("2023-01-17T00:00:00.000Z").toISOString(),
		})
			.then(res => {
				if (finish)
					setData(res);
			});

		return () => finish = false;
	}, []);

	const onTimePeriodPress = useCallback((item) => {
		XAlert.show("Rezervacija termina", "Da li ste sigurni da zelite rezervisati termin", [
			{
				onPress: () => {

				}
			},
			{
				onPress: () => {
					Http.post("/appointments/free/book", { services: route.params.services, cId: route.params.companyId, userId: 1 })
				}
			}
		])
	}, []);

	if (!data)
		return null

	return (
		<Screen style={{ paddingBottom: 10 }}>
			<ScrollView>
				<XText>CalendarScreen, company id: {route.params.companyId}</XText>
				<XText>CalendarScreen, services ids: {route.params.services}</XText>
				<TimePeriodsPanel height={calculateHeightTime(data.company.start, data.company.end, sizeCoef)}>
					{data && data.employeePeriods[0].timePeriods.map((p, idx) => <TimePeriod
						key={idx}
						item={p}
						sizeCoef={sizeCoef}
						onPress={onTimePeriodPress}
					/>)}
				</TimePeriodsPanel>
			</ScrollView>
		</Screen>
	);
};

export default CalendarScreen;