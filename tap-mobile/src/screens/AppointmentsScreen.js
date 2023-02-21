import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Http } from "../common/Http";
import { formatTime } from "../common/utils";
import XText from "../components/basic/XText";
import Screen from "../components/Screen";
import I18nContext from "../store/I18nContext";
import { useThemedStyle } from "../store/ThemeContext";

const convertDateToSectionTitle = (dateString, loc) => {

	return dateString.toLocaleDateString(loc, {
		day: 'numeric',
		month: 'long'
	})
}

const convertData = (resp) => {
	const dataMap = {};
	let tmpSD;
	resp.employees.forEach(e => {
		e.periods.forEach(p => {
			tmpSD = new Date(p.start);
			const s = convertDateToSectionTitle(tmpSD);
			if (!dataMap[s])
				dataMap[s] = [];

			dataMap[s].push({
				...p,
				duration: e.lookingServices.map(s => s.duration).reduce((a, b) => a + b, 0),
				price: e.lookingServices.map(s => s.price).reduce((a, b) => a + b, 0),
				eName: e.user.firstName,
				cName: e.company.name,
				startDate: tmpSD,
				endDate: new Date(p.end),
				id: e.id + '_' + p.start
			});
		});
	});


	return Object.entries(dataMap).map(([k, v]) => {
		v.sort((a, b) => a.startDate - b.startDate);
		return {
			title: k,
			data: v
		}
	});
};

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

	const from = useMemo(() => formatTime(item.startDate, lng), [lng]);
	const end = useMemo(() => formatTime(item.endDate, lng), [lng]);

	return (
		<TouchableOpacity style={styles.container} onPress={() => { }}>
			<XText style={styles.text}>{item.cName}</XText>
			<XText style={styles.text}>{item.eName}</XText>
			<XText style={styles.text}>{from} - {end} {'('}{item.duration} min{')'}</XText>
			<XText style={[styles.text, { alignSelf: 'flex-end' }]}> {item.price} KM</XText>
		</TouchableOpacity>
	);
});

const createAppStyle = (theme) => StyleSheet.create({
	container: {
		minHeight: 50,
		borderWidth: 0.5,
		backgroundColor: theme.colors.backgroundElement,
		borderRadius: theme.values.borderRadius,
		borderWidth: theme.values.borderWidth,
		borderColor: theme.colors.borderColor,
		marginBottom: 5,
		padding: 5
	},
	text: {
		color: theme.colors.textPrimary
	}
});


const AppointmentsScreen = ({ route }) => {

	const [data, setData] = useState();
	const { lng } = useContext(I18nContext);

	useEffect(() => {
		let finish = true;
		Http.get('/appointments/free', {
			cityId: 1,
			sIds: '1,2'
			//cId: '1'
		}).then((resp) => {
			const converted = convertData(resp);
			setData(converted);



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


	if (!data)
		return null;

	return (
		<Screen>
			<XText>Services: {'1,2'}</XText>
			<XText>CompanyId: {'1'}</XText>
			<SectionList
				sections={data}
				renderSectionHeader={renderSectionHeader}
				renderItem={renderItem}
				stickySectionHeadersEnabled
			// keyExtractor={(item, idx) => idx.toString()}


			/>
		</Screen>
	);
}

export default AppointmentsScreen