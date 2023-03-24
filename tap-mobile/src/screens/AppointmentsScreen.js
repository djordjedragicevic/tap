import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Http } from "../common/Http";
import { DateUtils, formatTime, getUserDisplayName, measureDuration } from "../common/utils";
import XText from "../components/basic/XText";
import Screen from "../components/Screen";
import I18nContext from "../store/I18nContext";
import { useThemedStyle } from "../store/ThemeContext";
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import XChip from "../components/basic/XChip";


const SectionHeader = memo(({ title }) => {
	const styles = useThemedStyle(createSecHeaderStyle);
	return (
		<View style={styles.container}>
			<XText style={styles.text}>{title}</XText>
		</View>
	)
});

const createSecHeaderStyle = (theme) => StyleSheet.create({
	container: {
		backgroundColor: theme.colors.background,
		justifyContent: 'center'
	},
	text: {
		fontSize: 20,
		color: 'red',
		padding: 5
	}
});

const FreeAppointmentPeriod = memo(({ item }) => {
	const { lng } = useContext(I18nContext);
	const styles = useThemedStyle(createAppStyle);

	const [sumPrice, sumDuration] = useMemo(() => {
		let p = 0, d = 0;
		item.employee.lookingServices.forEach(s => {
			p += s.price || 0;
			d += s.duration;
		});
		return [p, d];
	}, []);

	return (
		<TouchableOpacity style={styles.container} onPress={() => { }}>
			<View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
				<View style={{ justifyContent: 'center', minWidth: 75, paddingHorizontal: 5, alignItems: 'center' }}>
					<XText>{DateUtils.stringToTimeString(item.start)}</XText>
					<XText>{'(' + sumDuration + 'min)'}</XText>
				</View>
				<View style={{ flex: 1, alignItems: 'flex-start', paddingHorizontal: 5, justifyContent: 'center' }}>
					<View style={{ flexDirection: 'row' }}>
						<XText style={styles.textCmp}>{item.employee.company.type} </XText>
						<XText style={styles.textCmp}>{item.employee.company.name}</XText>
					</View>
					{/* <View style={{ flexDirection: 'row' }}>
						{item.employee.lookingServices.map(s => <XChip text={s.name} textStyle={{ color: 'hsla(30, 100%, 50%, 1)', fontWeight: 'bold', fontSize: 13 }} style={{ backgroundColor: 'hsla(30, 90%, 80%, 0.6)', marginEnd: 5 }} />)}
					</View> */}

					<XChip text={getUserDisplayName(item.employee.user)} />
				</View>
				<View style={{ justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 5 }}>
					<XText secondary style={[{ alignSelf: 'flex-end' }]}>{sumPrice || '-'} KM</XText>
				</View>
			</View>


		</TouchableOpacity>
	);
});

const createAppStyle = (theme) => StyleSheet.create({
	container: {
		minHeight: 50,
		//borderWidth: 0.5,
		backgroundColor: theme.colors.backgroundElement,
		borderRadius: theme.values.borderRadius,
		//borderWidth: theme.values.borderWidth,
		//borderColor: theme.colors.borderColor,
		marginBottom: 5
	},
	text: {

	},
	textCmp: {
		fontSize: 18
	},
	textEmp: {
		fontSize: 18
	}
});


const AppointmentsScreen = ({ route }) => {

	const [data, setData] = useState([]);
	const { lng } = useContext(I18nContext);
	const [weekView, setWeekView] = useState(false);

	const { city, services, company } = route.params;

	useEffect(() => {
		let finish = true;

		Http.get('/appointments/free', {
			city,
			services,
			company
		}, true).then((resp) => {

			if (finish)
				setData(resp.map(a => {
					return {
						title: a.date,
						data: a.periods
					}
				}));
			// resp.employees[0].periods.forEach(element => {

			// });

			//console.log("FREE APPS", JSON.stringify(resp));
			// setData({
			// 	raw: resp,
			// 	appointments: convertData(resp)
			// })
		});

		return () => finish = false;
	}, []);

	const renderItem = useCallback(({ item }) => {
		return <FreeAppointmentPeriod item={item} />
	}, []);

	const renderSectionHeader = useCallback((item) => {
		return (<SectionHeader title={item.section.title} />)
	}, []);


	return (
		<Screen>
			<XText>City: {city}</XText>
			<XText>Company: {company}</XText>
			<XText>Services: {services}</XText>

			{!!data &&
				<SectionList
					sections={data}
					renderSectionHeader={renderSectionHeader}
					renderItem={renderItem}
					stickySectionHeadersEnabled
				/>
			}
		</Screen>
	);
}

export default AppointmentsScreen