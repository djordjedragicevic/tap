import Screen from '../components/Screen';
import XText from '../components/basic/XText';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Http } from '../common/Http';
import { Alert, ScrollView, View } from 'react-native';
import { calculateHeightTime, calculateTopDate, calculateTopTime } from '../common/utils';
import TimePeriod from '../components/time-periods/TimePeriod';
import TimePeriodsPanel from '../components/time-periods/TimePeriodPanel';
import XAlert from '../components/basic/XAlert';
import I18nContext from '../store/I18nContext';



const CalendarScreen = ({ navigation, route }) => {

	const [sizeCoef, setSizeCoef] = useState(2);
	const [data, setData] = useState();
	const [fromDate, setFromDate] = useState(new Date());
	const { lng } = useContext(I18nContext);
	const from = useState(new Date('2023-02-07'))[0];

	useEffect(() => {
		let finish = true;
		Http.get("/appointments/free", {
			cId: route.params.companyId,
			cityId: 1,
			services: 1,
			from: from.toISOString()
			//from: new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString(),
		})
			.then(res => {
				
				if (finish) {
					setData(res);
				}
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
					Http.post("/appointments/book", {
						services: 1,
						uId: 1,
						eId: item.epmloyeeId,
						start: item.start,
						end: item.end
					})
						.then(() => {
							Http.get("/appointments/calendar", {
								//cId: route.params.companyId,
								from: new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString(),
							}).then(res => setData(res))
						})
						.catch(err => {
							console.log("ERRORR", err);
						})
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
				<XText>Date: {fromDate.toLocaleString(lng.code)}</XText>
				<TimePeriodsPanel height={30000}>
					{data && data.employees[0].periods.map((p, idx) => <TimePeriod
						key={idx}
						from={from}
						item={{
							...p,
							username: data.employees[0].user.username,
							epmloyeeId: data.employees[0].user.id
						}}
						sizeCoef={sizeCoef}
						// offset={calculateTopTime(data[0].company.start)}
						onPress={onTimePeriodPress}
					/>)}
				</TimePeriodsPanel>
			</ScrollView>
		</Screen>
	);
};

export default CalendarScreen;