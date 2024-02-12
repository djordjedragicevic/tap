import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { useCallback, useMemo, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { FlatList, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import XButton from "xapp/src/components/basic/XButton";
import { Theme } from "xapp/src/style/themes";
import XSegmentedButton from "xapp/src/components/basic/XSegmentedButton";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { useFocusEffect } from '@react-navigation/native';
import { DateUtils, emptyFn, getInitials } from "xapp/src/common/utils";
import XImage from "xapp/src/components/basic/XImage";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XEmptyListIcon from "xapp/src/components/XEmptyListIcon";
import XIcon from "xapp/src/components/basic/XIcon";
import XChip from "xapp/src/components/basic/XChip";
import { ADD_REVIEW_SCREEN, APPOINTMENT_SCREEN } from "../navigators/routes";
import { APP_STATUS, APP_STATUS_COLOR, APP_STATUS_ICON } from "xapp/src/common/general";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import { FontAwesome5 } from '@expo/vector-icons';

const arrangeData = (data, dateCode, grouped, filter) => {

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
		a[0]._isHistory = filter === FILTER.HISTORY

	});

	return newData;
};

const ServiceRow = ({ item, navigation }) => {

	const statusColor = useColor(APP_STATUS_COLOR[item.status]);
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

			<View style={styles.gropedServicesContainer}>
				{item.map(app => <ServiceRow navigation={navigation} key={app.id} item={app} />)}
			</View>
		</View>
	)
};

const Appointment = ({ item, navigation }) => {

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();
	const hIconColor = useColor('textTertiary');
	const [pColor, cRed] = useColor(['primary', 'red'])
	const hIcon = useCallback((props) => {
		return item._isHistory && <FontAwesome5 name="history" {...props} color={hIconColor} />;
	}, [item._isHistory, hIconColor]);

	return (
		<Pressable
			style={[styles.appContainer]}
			onPress={() => navigation.navigate(APPOINTMENT_SCREEN, { id: item.id })}
		>
			<View style={[styles.appHeader]}>
				<XText icon={hIcon} bold>{item._date} - {item._from}</XText>
				<XChip
					color={APP_STATUS_COLOR[item.status]}
					text={t(item.status)}
					textProps={{ bold: false }}
					icon={APP_STATUS_ICON[item.status]}
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

			<View style={[styles.appFooter]}>

				{/* <XButtonIcon
					icon={'star'}
					outline
				/> */}

				{(item._isHistory && item.status === APP_STATUS.ACCEPTED && !item.mark) &&
					<XButton
						title={t('Rate it')}
						iconLeft={'star'}
						textColor={pColor}
						onPress={() => navigation.navigate(ADD_REVIEW_SCREEN, { appId: item.id })}
					/>
				}
				{(!item._isHistory && (item.status === APP_STATUS.ACCEPTED || item.status === APP_STATUS.WAITING)) &&
					<XButton
						title={t(item.status === APP_STATUS.WAITING ? 'Withdraw' : 'Cancel')}
						iconLeft={'close'}
						textColor={cRed}
					/>
				}
				<XButtonIcon
					icon='arrowsalt'
					size={30}
					color={pColor}
					onPress={() => navigation.navigate(APPOINTMENT_SCREEN, { id: item.id })}
				/>
			</View>

		</Pressable>
	);
};

const FILTER = {
	COMING: 'coming',
	HISTORY: 'history'
}

const MyAppointmentsScreen = ({ navigation }) => {

	const [filter, setFilter] = useState(FILTER.COMING);
	const [refresh, setRefresh] = useState(1);
	const [loading, setLoading] = useState(false);
	const [apps, setApps] = useState();
	const [grouped, setGrouped] = useState(false);

	const dateCode = useDateCode();
	const t = useTranslation();
	//const [data, refresh, refreshing] = useHTTPGetOnFocus(useFocusEffect, '/appointment/my-appointments', null, false, arrangeData);


	const loadApps = useCallback(() => {
		setLoading(true);
		Http.get(`/appointment/my-appointments`, { f: filter })
			.then(resp => {
				setApps(arrangeData(resp, dateCode, grouped, filter));
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
					{ id: 1, text: t('Upcoming'), value: FILTER.COMING },
					{ id: 2, text: t('History'), value: FILTER.HISTORY }
				]}
				onSelect={(o) => setFilter(o.value)}
				style={{
					borderRadius: 0,
					borderEndWidth: 0,
					borderStartWidth: 0
				}}
				initialIndex={0}
			/>

			{apps ?
				apps.length ?
					<FlatList
						data={apps}
						renderItem={itemRenderer}
						keyExtractor={(item) => item[0].id}
						style={{ flex: 1 }}
						contentContainerStyle={{
							rowGap: 10,
							padding: Theme.values.mainPaddingHorizontal
						}}
						refreshing={loading}
						onRefresh={() => setRefresh(old => old + 1)}
					/>
					:
					<XEmptyListIcon text={t('No appointments')} />
				: null
			}

		</XScreen>
	)
};

const styleCreator = (theme) => StyleSheet.create({
	appContainer: {
		borderColor: theme.colors.borderColor,
		borderRadius: Theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement
	},
	appHeader: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 40
	},
	appMiddle: {
		flexDirection: 'row',
		padding: 10,
		paddingBottom: 0
	},
	appFooter: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 10,
		justifyContent: 'flex-end',
		alignItems: 'center',
		//height: 45,
		columnGap: 5
	},
	gropedServicesContainer: {
		rowGap: 5,
		paddingHorizontal: 10,
		paddingVertical: 10
	}
})

export default MyAppointmentsScreen;