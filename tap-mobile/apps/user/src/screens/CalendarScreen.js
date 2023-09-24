import XScreen from '../components/XScreen';
import XText from 'xapp/src/components/basic/XText';
import XSection from 'xapp/src/components/basic/XSection';
import { useCallback, useEffect, useState } from 'react';
import { Http } from 'xapp/src/common/Http';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getUserDisplayName } from 'xapp/src/common/utils';
import TimePeriod from '../components/time-periods/TimePeriod';
import TimePeriodsPanel from '../components/time-periods/TimePeriodPanel';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { useThemedStyle } from 'xapp/src/style/ThemeContext';



const CalendarScreen = ({ route }) => {

	const [sizeCoef] = useState(2);
	const [data, setData] = useState();
	const [fromDate] = useState(new Date());
	const [employeeData, setEmployeeData] = useState(null);
	const [currentDate, setCurrentDate] = useState(new Date());

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



		<XScreen style={{ paddingBottom: 10 }}>

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
		</XScreen>
	);
};

const createEmplStyles = (theme) => StyleSheet.create({
	empl: {
		backgroundColor: theme.colors.primary,
		marginEnd: 5
	}
});

export default CalendarScreen;