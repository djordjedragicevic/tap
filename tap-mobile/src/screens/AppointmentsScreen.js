import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Http } from "../common/Http";
import { DateUtils, getUserDisplayName } from "../common/utils";
import XText from "../components/basic/XText";
import Screen from "../components/Screen";
import { useThemedStyle } from "../style/ThemeContext";
import XChip from "../components/basic/XChip";
import XAlert from '../components/basic/XAlert';
import { useTranslation } from "../i18n/I18nContext";
import { Theme } from "../style/themes";

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

const FreeAppointment = memo(({ onPress, item: { employee, start } }) => {
	const styles = useThemedStyle(createAppStyle);

	const [sumPrice, sumDuration] = useMemo(() => {
		let p = 0, d = 0;
		employee.lookingServices.forEach(s => {
			p += s.price || 0;
			d += s.duration;
		});
		return [p, d];
	}, []);

	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<View style={{ flex: 1, flexDirection: 'row' }}>

				<View style={styles.timeContainer}>
					<XText light style={{}}>{DateUtils.stringToTimeString(start)}</XText>
					<XText light style={{}}>{sumDuration + ' min'}</XText>
				</View>

				<View style={{ flex: 1, padding: 5, justifyContent: 'center' }}>

					<View style={{ paddingBottom: 20 }}>
						<XText numberOfLines={1} ellipsizeMode='tail' style={styles.textTitle}>{employee.company.name} - {employee.company.type}</XText>
						<XText
							ellipsizeMode='tail'
							numberOfLines={1}
							style={{ fontStyle: 'italic', fontSize: 13 }}
							secondary
						>
							{employee.company.address}, {employee.company.country}
						</XText>
					</View>

					<View style={{ justifyContent: 'space-between', flex: 1, flexDirection: 'row' }}>
						<XChip text={getUserDisplayName(employee.user)} style={{}} />
						<XChip text={(sumPrice || '-') + ' KM'} style={[{}]}></XChip>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
});

const createAppStyle = (theme) => StyleSheet.create({
	container: {
		minHeight: 50,
		backgroundColor: theme.colors.backgroundElement,
		borderRadius: Theme.values.borderRadius,
		marginBottom: 4,
		overflow: 'hidden'
	},
	timeContainer: {
		justifyContent: 'center',
		minWidth: 80,
		paddingHorizontal: 5,
		alignItems: 'center',
		backgroundColor: theme.colors.primary
	},
	headerText: {

	},
	textTitle: {
		fontSize: 16,
		fontWeight: '500'
	},
	textEmp: {
		fontSize: 18
	}
});


const AppointmentsScreen = ({ route }) => {

	const [data, setData] = useState([]);
	const [weekView, setWeekView] = useState(false);
	const t = useTranslation();

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
		});

		return () => finish = false;
	}, []);


	const onAppPress = (item) => {
		XAlert.show(
			t('Book appointment'),
			t('Book appointment'),
			[
				{
					text: t('OK'),
					onPress: () => {
						Http.post('/appointments/book', {
							services,
							eId: item.employee.id,
							csId: item.employee.lookingServices[0].id,
							uId: 1,
							start: item.start,
							end: item.end
						});
					}
				},
				{
					text: t('Cancel')
				}
			]

		);
	};

	const renderItem = useCallback(({ item }) => {
		return <FreeAppointment item={item} onPress={() => onAppPress(item)} />
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
				// ItemSeparatorComponent={XSeparator}
				/>
			}
		</Screen>
	);
}

export default AppointmentsScreen