import Screen from '../components/Screen';
import XText from '../components/basic/XText';
import { useEffect, useState } from 'react';
import { Http } from '../common/Http';
import { ScrollView, View } from 'react-native';
import { calcucateTopDate, calcucateTopTime, calculateHeightDate, calculateHeightTime } from '../common/utils';

const TimePeriodsPanel = ({ height, style, children }) => {
	return (
		<View style={{ flexDirection: 'row', height, borderWidth: 1 }}>
			<View style={{ backgroundColor: 'purple', opacity: 0.5, flex: 1, maxWidth: 70 }} />

			<View style={{ backgroundColor: 'gray', flex: 1, paddingHorizontal: 10, alignItems: 'center' }}>
				{children}
			</View>


		</View>
	)
};

const periodColors = {
	'FREE_APPOINTMENT': 'blue',
	'FREE_PERIOD': 'green',
	'BUSY_APPOINTMENT': 'red',
	'BUSY_BREAK': 'yellow'
};

const TimePeriod = ({ height, top, type, subType }) => {

	// if (type === 'FREE')
	// 	return null

	return (
		<View style={{ backgroundColor: periodColors[subType], height, borderWidth: 1, width: '100%', position: 'absolute', top, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
			<XText light>{type + '   ' + subType} </XText>
		</View >
	)
};

const CalendarScreen = ({ navigation, route }) => {

	const [hBM, setHBM] = useState(3);

	const [data, setData] = useState();

	useEffect(() => {
		let finish = true;
		const now = new Date();
		Http.get("/appointments/free-appointments", {
			cId: route.params.companyId,
			services: route.params.services,
			from: new Date("2023-01-17T00:00:00.000Z").toISOString(),
		})
			.then(res => {
				if (finish)
					setData(res);
			});

		return () => finish = false;
	}, [])

	if (!data)
		return null

	return (
		<Screen style={{paddingBottom: 10}}>
			<ScrollView>
				<XText>CalendarScreen, company id: {route.params.companyId}</XText>
				<XText>CalendarScreen, duration sum: {route.params.durationSum}</XText>
				<TimePeriodsPanel height={calculateHeightTime(data.company.start, data.company.end, hBM)}>
					{data && data.employeePeriods[0].timePeriods.map((p, idx) => <TimePeriod key={idx} height={calculateHeightDate(p.start, p.end, hBM)} top={calcucateTopDate(p.start, calcucateTopTime(data.company.start), hBM)} subType={p.subType} type={p.type} />)}
				</TimePeriodsPanel>
			</ScrollView>
		</Screen>
	);
};

export default CalendarScreen;