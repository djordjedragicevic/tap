import Screen from '../components/Screen';
import XText from '../components/basic/XText';
import XSection from '../components/basic/XSection';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Http } from '../common/Http';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DateUtils } from '../common/utils';
import TimePeriod from '../components/time-periods/TimePeriod';
import TimePeriodsPanel from '../components/time-periods/TimePeriodPanel';
import { getUserDisplayName } from '../common/utils';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { useThemedStyle } from '../style/ThemeContext';



const CalendarScreen = ({ route }) => {

	const [sizeCoef, setSizeCoef] = useState(2);
	const [data, setData] = useState();
	const [fromDate, setFromDate] = useState(new Date());
	const [employeeData, setEmployeeData] = useState(null);
	const [currentDate, setCurrentDate] = useState(DateUtils.dateToString(new Date()));

	const styles = useThemedStyle(createEmplStyles);

	useEffect(() => {
		if (!currentDate)
			return

		let finish = true;
		Http.get("/appointments/calendar", {
			cId: route.params?.companyId || 1,
			from: currentDate
		})
			.then(res => {
				if (finish) {
					res.employees = res.employees.filter(e => e.calendar[0].working)
					setData(res);
					setEmployeeData(res.employees[0]);
				}
			});

		return () => finish = false;
	}, [currentDate]);

	const onDateChange = useCallback((dateString, upS) => {
		setCurrentDate(dateString);
	}, []);

	return (



		<Screen style={{ paddingBottom: 10 }}>

			<CalendarProvider
				date={fromDate}
				onDateChanged={onDateChange}
			>
				<ExpandableCalendar firstDay={1} />

				<View style={{ paddingVertical: 6 }}>
					<ScrollView horizontal contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
						{data && data.employees.map((e) => {
							return (
								<XSection
									key={e.id}
									style={styles.empl}
									onPress={() => setEmployeeData(e)}
									disabled={e.id !== employeeData?.id}
									disabledOpacity={0.4}
								>
									<XText light>{getUserDisplayName(e.user)}</XText>
								</XSection>
							)
						})}
					</ScrollView>
				</View>

				<ScrollView contentContainerStyle={{}}>
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

const createEmplStyles = (theme) => StyleSheet.create({
	empl: {
		backgroundColor: theme.colors.primary,
		marginEnd: 5
	}
});

export default CalendarScreen;