import Screen from '../components/Screen';
import XText from '../components/basic/XText';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Http } from '../common/Http';
import { Alert, ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { DateUtils } from '../common/utils';
import TimePeriod from '../components/time-periods/TimePeriod';
import TimePeriodsPanel from '../components/time-periods/TimePeriodPanel';
import XAlert from '../components/basic/XAlert';
import I18nContext from '../store/I18nContext';
import { getUserDisplayName } from '../common/utils';
import { Agenda, Calendar, CalendarContext, CalendarProvider, ExpandableCalendar, Timeline, TimelineList, WeekCalendar } from 'react-native-calendars';
import XContainer from '../components/basic/XContainer';



const CalendarScreen = ({ navigation, route }) => {

	const [sizeCoef, setSizeCoef] = useState(2);
	const [data, setData] = useState();
	const [fromDate, setFromDate] = useState(new Date());
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(-1);
	const [employeeData, setEmployeeData] = useState(null);

	const { lng } = useContext(I18nContext);
	const [from] = useState(DateUtils.dateToString(new Date()));

	useEffect(() => {
		let finish = true;
		Http.get("/appointments/calendar", {
			cId: route.params?.companyId || 1,
			//cityId: 1,
			//services: 1,
			from: from
			//from: new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString(),
		})
			.then(res => {
				console.log(res);
				if (finish) {
					setData(res);
					setEmployeeData(res.employees[0]);
				}
			});

		return () => finish = false;
	}, []);

	return (
		<Screen style={{ paddingBottom: 10 }}>
			<XText>Date: {fromDate.toLocaleString(lng.code)}</XText>

			<CalendarProvider date={from}>
				<ExpandableCalendar firstDay={1} />
				{/* <WeekCalendar/> */}

				<View style={{ paddingVertical: 6 }}>
					<ScrollView horizontal contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
						{data && data.employees.map((e, idx) => {
							return (
								<XContainer key={e.id} style={{ marginEnd: 8, backgroundColor: e.id === employeeData?.id ? '#66b3ff' : 'white' }}>
									<TouchableOpacity
										style={{ height: 40, width: 100, justifyContent: 'center', alignItems: 'center' }}
										onPress={() => {
											setEmployeeData(e);
										}}
									>
										<XText>{getUserDisplayName(e.user)}</XText>
									</TouchableOpacity>
								</XContainer>
							)
						})}
					</ScrollView>
				</View>

				<ScrollView>
					<TimePeriodsPanel sizeCoef={sizeCoef}>
						{employeeData && employeeData.calendar[0].periods.map((p, idx) => {
							return (
								<TimePeriod
									key={idx}
									sizeCoef={sizeCoef}
									style={{}}
									item={{
										...p,
										username: employeeData.user.username,
										epmloyeeId: employeeData.user.id
									}}
								/>
							)
						})}
					</TimePeriodsPanel>
				</ScrollView>
			</CalendarProvider>
		</Screen>
	);
};

export default CalendarScreen;