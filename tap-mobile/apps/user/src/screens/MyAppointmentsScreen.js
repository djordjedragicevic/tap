import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { useCallback, useMemo, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import XButton from "xapp/src/components/basic/XButton";
import { Theme } from "xapp/src/style/themes";
import XSegmentedButton from "xapp/src/components/basic/XSegmentedButton";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { useFocusEffect } from '@react-navigation/native';
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import XImage from "xapp/src/components/basic/XImage";
import XSeparator from "xapp/src/components/basic/XSeparator";
import { STATUS } from "xapp/src/common/general";
import XEmptyListIcon from "xapp/src/components/XEmptyListIcon";
import XIcon from "xapp/src/components/basic/XIcon";

const arrangeData = (data, dateCode) => {

	const g = {};
	const newData = [];

	for (const a of data) {
		//newData.push([a]);
		a.allAccepted = a.status === STATUS.ACCEPTED;
		a.allRejected = a.status === STATUS.REJECTED;

		if (a.joinId == null) {
			newData.push([a]);
		}
		else if (!g[a.joinId]) {
			g[a.joinId] = [a];
			a.allAccepted = a.status === STATUS.ACCEPTED;
			a.allRejected = a.status === STATUS.REJECTED;
			newData.push(g[a.joinId]);
		}
		else {
			g[a.joinId].push(a);
			if (a.status !== STATUS.ACCEPTED && g[a.joinId][0].allAccepted)
				g[a.joinId][0].allAccepted = false;
			if (a.status !== STATUS.REJECTED && g[a.joinId][0].allRejected)
				g[a.joinId][0].allRejected = false;
		}
	}


	newData.forEach(a => {
		const sD = new Date(a[0].start);
		const eD = new Date(a[a.length - 1].end);
		a[0].startTime = sD.toLocaleDateString(dateCode, { day: 'numeric', month: 'short', year: 'numeric' })
			+ ' - '
			+ sD.toLocaleTimeString(dateCode, { hour: '2-digit', minute: '2-digit', hour12: false })
			+ '  '
			+ eD.toLocaleTimeString(dateCode, { hour: '2-digit', minute: '2-digit', hour12: false });

		a[0].gropuStatus = STATUS.WAITING;

		if (a[0].allAccepted)
			a[0].gropuStatus = STATUS.ACCEPTED;

		if (a[0].allRejected)
			a[0].gropuStatus = STATUS.REJECTED;

	});

	return newData;
};

const STATUS_TEXT = {
	WAITING: 'Waiting',
	CANCELED: 'Canceled',
	ACCEPTED: 'Accepted',
	REJECTED: 'Rejected'
};

const ICON = {
	WAITING: 'hourglass',
	CANCELED: 'closecircleo',
	ACCEPTED: 'checkcircle',
	REJECTED: 'closecircle'
};

const COLORS = {
	WAITING: Theme.vars.yellow,
	CANCELED: Theme.vars.blue,
	ACCEPTED: Theme.vars.green,
	REJECTED: Theme.vars.red
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


const ServiceRowButton = ({ item, statusColor }) => {
	const t = useTranslation();
	const [title, colorN] = useMemo(() => {
		let ti = '';
		let cN = '';

		if (item[0].allAccepted) {
			ti = 'Reject';
			cN = Theme.vars.red;
		}
		else if (item[0].allRejected)
			ti = STATUS_TEXT.REJECTED;
		else
			ti = 'Withdraw';

		return [ti, cN];
	}, [item]);

	if (item[0].gropuStatus === STATUS.REJECTED)
		return null;


	return (
		<XButton
			colorName={colorN}
			small
			secondary
			style={{ width: 100 }}
			uppercase={false}
			title={t(title)}
		/>
	)
};

const ServiceRow = ({ item }) => {

	const statusColor = useColor(COLORS[item.status]);
	const t = useTranslation();

	return (

		<View style={{ flexDirection: 'row', alignItems: 'center', paddingEnd: 5, minHeight: 35 }}>

			<View style={{ width: 5, height: '100%', backgroundColor: statusColor, borderRadius: 50, marginEnd: 5 }} />

			<View style={{ minWidth: 45, alignItems: 'center' }}>
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

			<XText secondary>{item.employee.name}</XText>
		</View>
	)
};


const AppointmentGroup = ({ item }) => {

	const styles = useThemedStyle(styleCreator);


	return (
		<View style={[styles.appContainer]}>

			<View style={[styles.appHeader]} start={item[0].start}>
				<XText bold>{item[0].startTime}</XText>
				{/* <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
					<XIcon size={18} icon={ICON[item[0].gropuStatus]} colorName={COLORS[item[0].gropuStatus]} />
				</View> */}
				{/* <Pressable>
					<XIcon colorName={Theme.vars.primary} size={18} icon={'arrowright'} />
				</Pressable> */}
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
				{item.map(app => <ServiceRow key={app.id} item={app} />)}
			</View>



			{/* {item[0].gropuStatus !== STATUS.REJECTED &&
				<>
					<XSeparator />
					<View style={{ alignItems: 'flex-end', height: 40, justifyContent: 'center' }}>
						<ServiceRowButton item={item} />
					</View>
				</>
			} */}

		</View>
	)
};



const MyAppointmentsScreen = () => {

	const [filter, setFilter] = useState('coming');
	const [refresh, setRefresh] = useState(1);
	const [loading, setLoading] = useState(false);
	const [apps, setApps] = useState([]);

	const dateCode = useDateCode();
	const t = useTranslation();
	//const [data, refresh, refreshing] = useHTTPGetOnFocus(useFocusEffect, '/appointment/my-appointments', null, false, arrangeData);


	const loadApps = useCallback(() => {
		setLoading(true);
		Http.get(`/appointment/my-appointments`, { f: filter })
			.then(resp => {
				setApps(arrangeData(resp, dateCode));
			})
			.catch(emptyFn)
			.finally(() => setLoading(false));
	}, [filter, refresh, dateCode]);

	useFocusEffect(loadApps);


	const itemRenderer = useCallback(({ item }) => <AppointmentGroup item={item} />, []);


	return (
		<XScreen loading={loading} flat>
			<XSegmentedButton
				options={[
					{ id: 1, text: t('Upcoming'), value: 'commint' },
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
						rowGap: Theme.values.mainPaddingHorizontal,
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
		paddingHorizontal: 10,
		//borderWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor,
		borderRadius: Theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement
	},
	appHeader: {
		// borderBottomWidth: Theme.values.borderWidth,
		// borderColor: theme.colors.borderColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		//paddingHorizontal: 10,
		height: 40
	},
	appCnt: {
		rowGap: 3,
		//paddingHorizontal: 5,
		paddingVertical: 10
	},
})

export default MyAppointmentsScreen;