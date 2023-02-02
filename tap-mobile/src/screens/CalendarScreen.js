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

	const [sizeCoef, setSizeCoef] = useState(4);
	const [data, setData] = useState();
	const [fromDate, setFromDate] = useState(new Date());
	const { lng } = useContext(I18nContext);

	useEffect(() => {
		let finish = true;
		Http.get("/appointments/free", {
			cId: route.params.companyId,
			services: route.params.services,
			from: new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString(),
		})
			.then(res => {
				if (finish) {
					setData(res);
				}
			});

		return () => finish = false;
	}, []);

	const onTimePeriodPress = useCallback((item) => {
		console.log("ITEM", item);
		XAlert.show("Rezervacija termina", "Da li ste sigurni da zelite rezervisati termin", [
			{
				onPress: () => {

				}
			},
			{
				onPress: () => {
					Http.post("/appointments/book", {
						services: route.params.services,
						uId: 1,
						eId: item.epmloyeeId,
						start: item.start,
						end: item.end
					})
						.then(() => {
							Http.get("/appointments/calendar", {
								cId: route.params.companyId,
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
				<TimePeriodsPanel height={calculateHeightTime(data.company.start, data.company.end, sizeCoef)}>
					{data && data.employeePeriods[0].timePeriods.map((p, idx) => p.subType !== 'FREE_PERIOD' && <TimePeriod
						key={idx}
						item={{
							...p,
							username: data.employeePeriods[0].employeeWorkDayDTO.username,
							epmloyeeId: data.employeePeriods[0].employeeWorkDayDTO.userId
						}}
						sizeCoef={sizeCoef}
						offset={calculateTopTime(data.company.start)}
						onPress={onTimePeriodPress}
					/>)}
				</TimePeriodsPanel>
			</ScrollView>
		</Screen>
	);
};

export default CalendarScreen;