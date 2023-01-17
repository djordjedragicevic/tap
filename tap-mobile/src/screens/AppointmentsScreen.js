import Screen from '../components/Screen';
import XText from '../components/basic/XText';
import { useEffect, useState } from 'react';
import { Http } from '../common/Http';
import { ScrollView, View } from 'react-native';
import { calcucateTopDate, calcucateTopTime, calculateHeightDate, calculateHeightTime } from '../common/utils';

const TimePeriodsPanel = ({ height, style, children }) => {
	return (
		<View style={{ flexDirection: 'row', height, borderWidth: 1 }}>
			<View style={{ backgroundColor: 'purple', flex: 1, maxWidth: 70 }} />

			<View style={{ backgroundColor: 'gray', flex: 1, paddingHorizontal: 10, alignItems: 'center' }}>
				{children}
			</View>


		</View>
	)
};

const TimePeriod = ({ height, top, type, subType }) => {
	return (
		<View style={{ backgroundColor: type === 'FREE' ? 'green' : subType === 'STANDARD' ? 'blue' : 'yellow', height, borderWidth: 1, width: '100%', position: 'absolute', top, opacity: 0.7, borderRadius: 10 }} />
	)
};

const AppointmentsScreen = ({ navigation, route }) => {

	const [hBM, setHBM] = useState(1);

	const [data, setData] = useState();

	useEffect(() => {
		let finish = true;
		const now = new Date();
		Http.get("/appointments/calendar", { cId: route.params.companyId, y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() })
			.then(res => {
				if (finish)
					setData(res);
			});

		return () => finish = false;
	}, [])

	if (!data)
		return null

	return (
		<Screen>
			<ScrollView>
				<XText>AppointmentsScreen, company id: {route.params.companyId}</XText>
				<XText>AppointmentsScreen, duration sum: {route.params.durationSum}</XText>
				<TimePeriodsPanel height={calculateHeightTime(data.company.start, data.company.end, hBM)}>
					{data.periods[0].periods.map(p => <TimePeriod height={calculateHeightDate(p.start, p.end, hBM)} top={calcucateTopDate(p.start, calcucateTopTime(data.company.start), hBM)} subType={p.subType} type={p.type} />)}
				</TimePeriodsPanel>
			</ScrollView>
		</Screen>
	);
};

export default AppointmentsScreen;