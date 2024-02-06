import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { useCallback, useMemo, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { FlatList, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import XButton from "xapp/src/components/basic/XButton";
import { Theme } from "xapp/src/style/themes";
import XSegmentedButton from "xapp/src/components/basic/XSegmentedButton";
import { useColor, usePrimaryColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { useFocusEffect } from '@react-navigation/native';
import { DateUtils, emptyFn, getInitials } from "xapp/src/common/utils";
import XImage from "xapp/src/components/basic/XImage";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XEmptyListIcon from "xapp/src/components/XEmptyListIcon";
import XIcon from "xapp/src/components/basic/XIcon";
import XChip from "xapp/src/components/basic/XChip";
import { APPOINTMENT_SCREEN } from "../navigators/routes";
import { APP_STATUS, APP_STATUS_ICON } from "xapp/src/common/general";
import { STATUS_COLOR } from "../common/general";
import HairSalon from "../components/svg/HairSalon";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";

const arrangeData = (data, dateCode, grouped) => {

	const g = {};
	const newData = [];

	for (const a of data) {
		if (!grouped) {
			newData.push([a]);
		}
		else if (a.joinId == null) {
			newData.push([a]);
		}
		else if (!g[a.joinId]) {
			g[a.joinId] = [a];
			newData.push(g[a.joinId]);
		}
		else {
			g[a.joinId].push(a);
		}
	}

	newData.forEach(a => {
		const sD = new Date(a[0].start);
		const eD = new Date(a[a.length - 1].end);
		a[0]._date = sD.toLocaleDateString(dateCode, { day: 'numeric', month: 'short', year: 'numeric' });
		a[0]._from = sD.toLocaleTimeString(dateCode, { hour: '2-digit', minute: '2-digit', hour12: false });
		a[0]._to = eD.toLocaleTimeString(dateCode, { hour: '2-digit', minute: '2-digit', hour12: false });

	});

	return newData;
};


const getStatus = (apps) => {
	if (!Array.isArray(apps))
		return apps.status;
	if (apps.filter(a => a.status === STATUS.ACCEPTED).length === apps.length)
		return STATUS.ACCEPTED;
	else if (apps.filter(a => a.status === STATUS.REJECTED).length > 0)
		return STATUS.REJECTED;
	else if (apps.filter(a => a.status === STATUS.CANCELED).length > 0)
		return STATUS.CANCELED;
	else
		return STATUS.WAITING;

};


const ServiceRow = ({ item, navigation }) => {

	const statusColor = useColor(STATUS_COLOR[item.status]);
	const t = useTranslation();
	const pColor = useColor('textSecondary');

	return (

		<TouchableOpacity
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				minHeight: 37,
				borderWidth: 0,
				opacity: item.status === APP_STATUS.DROPPED || item.status === APP_STATUS.CANCELED ? 1 : 1
			}}
			onPress={() => navigation.navigate(APPOINTMENT_SCREEN, { id: item.id })}
		>

			<View style={{ width: 5, height: '100%', backgroundColor: statusColor, borderRadius: 50, marginEnd: 5 }} />

			<View style={{ minWidth: 42, alignItems: 'center' }}>
				<XText secondary>{DateUtils.getTimeFromDateTimeString(item.start)}</XText>
			</View>

			<View flex={1} style={{ paddingHorizontal: 5 }}>
				<XText>{item.service.name}</XText>
			</View>


			{/* <XChip
				style={{ width: 110 }}
				text={t(STATUS_TEXT[item.status])}
				color={COLORS[item.status]}
				// icon={<XIcon icon={ICON[item.status]} color={COLORS[item.status]} size={15} />}
			/> */}

			<View style={{ paddingHorizontal: 5 }}>
				<XText secondary>{item.employee.name}</XText>
			</View>

			<XIcon icon='right' size={12} color={pColor} />

		</TouchableOpacity>

	)
};


const AppointmentGroup = ({ item, navigation }) => {

	const styles = useThemedStyle(styleCreator);

	return (
		<View style={[styles.appContainer]}>

			<View style={[styles.appHeader]} start={item[0].start}>
				<XText bold>{item[0]._date}</XText>
				<XText bold>{item[0]._from} - {item[0]._to}</XText>
			</View>

			<XSeparator />

			<View style={{ flexDirection: 'row', columnGap: 5, paddingVertical: 10 }}>
				<XImage
					imgPath={item[0].provider.imagePath}
					style={{
						width: 60,
						height: 60,
						borderRadius: 7
					}}
					contentFit="cover"
				/>
				<View style={{ justifyContent: 'space-evenly' }}>
					<XText icon='isv' bold>{item[0].provider.name} - {item[0].provider.type}</XText>
					<XText icon='enviroment' secondary>{item[0].provider.address1}, {item[0].provider.city}</XText>
				</View>
			</View>
			{/* <XSeparator margin={5} style={{ marginVertical: 5 }} /> */}

			<View style={styles.appCnt}>
				{item.map(app => <ServiceRow navigation={navigation} key={app.id} item={app} />)}
			</View>
		</View>
	)
};

const Appointment = ({ item, navigation }) => {

	const styles = useThemedStyle(styleCreator);
	const sColor = useColor(Theme.vars.primaryLight)
	const t = useTranslation();

	const btnData = useMemo(() => {
		if (item.status === APP_STATUS.ACCEPTED) {
			return {
				title: 'Cancel',
				color: Theme.vars.red,
				onPress: () => changeStatus(APP_STATUS.CANCELED)
			}
		}
		else if (item.status === APP_STATUS.WAITING) {
			return {
				title: 'Withdraw',
				color: Theme.vars.red,
				onPress: () => changeStatus(APP_STATUS.DROPPED)
			}
		}

	}, [item.status]);

	return (
		<Pressable
			style={[styles.appContainer]}
			onPress={() => navigation.navigate(APPOINTMENT_SCREEN, { id: item.id })}
		>

			<View style={[styles.appHeader]}>
				<XText bold>{item._date} - {item._from}</XText>
				<XButtonIcon
					icon='edit'
					size={32}
					colorName={Theme.vars.primary}
					onPress={() => navigation.navigate(APPOINTMENT_SCREEN, { id: item.id })}
				/>
			</View>

			<XSeparator />

			<View style={styles.appMiddle}>

				<XAvatar
					imgPath={item.provider.imagePath}
					size={70}
					color={Theme.vars.green}
					initials={getInitials(null, null, item.provider.name, null)}
				/>

				<View style={{ justifyContent: 'space-evenly', flex: 1, paddingHorizontal: 10, paddingEnd: 15 }}>
					<XText oneLine icon='isv' bold>{item.provider.name}</XText>
					<XText oneLine icon='enviroment' secondary>{item.provider.address1}, {item.provider.city}</XText>
					<XText oneLine icon='tag' secondary>{item.service.name}</XText>
				</View>

			</View>

			{/* <XSeparator /> */}

			<View style={[styles.appFooter]}>
				<XChip
					color={STATUS_COLOR[item.status]}
					text={t(item.status)}
					textProps={{ bold: false }}
					//bgOpacity={0}
					icon={APP_STATUS_ICON[item.status]}
				/>

			</View>

		</Pressable>
	)
};



const MyAppointmentsScreen = ({ navigation }) => {

	const [filter, setFilter] = useState('coming');
	const [refresh, setRefresh] = useState(1);
	const [loading, setLoading] = useState(false);
	const [apps, setApps] = useState([]);
	const [grouped, setGrouped] = useState(false);

	const dateCode = useDateCode();
	const t = useTranslation();
	//const [data, refresh, refreshing] = useHTTPGetOnFocus(useFocusEffect, '/appointment/my-appointments', null, false, arrangeData);


	const loadApps = useCallback(() => {
		setLoading(true);
		Http.get(`/appointment/my-appointments`, { f: filter })
			.then(resp => {
				setApps(arrangeData(resp, dateCode, grouped));
			})
			.catch(emptyFn)
			.finally(() => setLoading(false));
	}, [filter, refresh, dateCode, grouped]);

	useFocusEffect(loadApps);


	const itemRenderer = useCallback(({ item }) => {

		return grouped ?
			<AppointmentGroup item={item} navigation={navigation} />
			:
			<Appointment item={item[0]} navigation={navigation} />

	}, [navigation, grouped]);

	return (
		<XScreen loading={loading} flat>
			<XSegmentedButton
				options={[
					{ id: 1, text: t('Upcoming'), value: 'comming' },
					{ id: 2, text: t('History'), value: 'history' }
				]}
				onSelect={(o) => setFilter(o.value)}
				style={{
					borderRadius: 0,
					borderEndWidth: 0,
					borderStartWidth: 0
				}}
				initialIndex={0}
			/>

			{!apps?.length ?
				<XEmptyListIcon text={t('No appointments')} />
				:
				<FlatList
					data={apps}
					renderItem={itemRenderer}
					keyExtractor={(item) => item[0].id}
					contentContainerStyle={{
						rowGap: 10,
						padding: Theme.values.mainPaddingHorizontal
					}}
					refreshing={loading}
					onRefresh={() => setRefresh(old => old + 1)}
				/>
			}

		</XScreen>
	)
};

const styleCreator = (theme) => StyleSheet.create({
	appContainer: {
		//paddingHorizontal: 10,
		//borderWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor,
		borderRadius: Theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement
	},
	appHeader: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 40,
		//backgroundColor: theme.colors.yellowLight
	},
	appMiddle: {
		flexDirection: 'row',
		padding: 10,
		paddingBottom: 0
	},
	appFooter: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: 45
	},
	appCnt: {
		rowGap: 5,
		paddingHorizontal: 10,
		paddingVertical: 10
	},
})

export default MyAppointmentsScreen;