import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Http } from "../common/Http";
import Screen from "../components/Screen";
import XText from "../components/basic/XText";
import { DateUtils, emptyFn } from "../common/utils";
import { useEffect, useRef, useState } from "react";
import XBottomSheetSelector from "../components/basic/XBottomSheetSelector";
import XSelectField from "../components/basic/XSelectField";
import { useTranslation } from "../i18n/I18nContext";
import XFieldDatePicker from "../components/basic/XFieldDataPicker";
import { useThemedStyle } from "../style/ThemeContext";
import { Theme } from "../style/themes";
import XBottomSheetModal from "../components/basic/XBottomSheetModal";
import XButton from "../components/basic/XButton";
import { storeDispatch } from "../store/store";
import { useLockNavigation } from "../common/useLockNavigation";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";


const FREE_APP_WIDTH = 60;
const FREE_APP_COL_GAP = 6;

const getEmptyApps = (appLength, width) => {
	const emptyApps = [];
	const numOfCols = Math.floor((width - (Theme.values.mainPaddingHorizontal * 2) - FREE_APP_COL_GAP) / (FREE_APP_WIDTH + (FREE_APP_COL_GAP / 2)));
	const numOfEmptyApps = numOfCols - (appLength - (Math.floor(appLength / numOfCols) * numOfCols));
	for (let i = 0; i < numOfEmptyApps; i++)
		emptyApps.push(<View key={'emptyApp_' + i} style={{ width: FREE_APP_WIDTH }} />);

	return emptyApps;
};


const FreeAppIntem = ({ app, onPress = emptyFn }) => {
	const styles = useThemedStyle(styleCreator);
	return (
		<Pressable
			style={styles.freeAppointment}
			onPress={() => onPress(app)}
		>
			<XText light>{app.startAt}</XText>
		</Pressable>
	)
};

const FreeAppointmentDetails = ({ navigation, app }) => {
	const [appProcessing, setAppProcessing] = useState(false);
	useLockNavigation(appProcessing, navigation);

	return (
		<View style={{ flex: 1, padding: 10 }}>
			<BottomSheetScrollView>
				<View style={{ marginBottom: 10 }}>
					<XText>Start at: {app.startAt}</XText>
				</View>
				{app.services.map((s, idx) => (
					<XText key={s.joinId + idx}>{`${s.time} - ${s.service.name} - (${s.service.duration})min - ${s.employee.firstName}`}</XText>
				))}
			</BottomSheetScrollView>

			<XButton
				title="Book"
				onPress={() => {
					setAppProcessing(true);
					storeDispatch('app.mask', true);
					setTimeout(() => {
						setAppProcessing(false);
						storeDispatch('app.mask', false)
					}, 2000);
				}} />
		</View>
	)
};

const FreeAppointmentsScreen = ({ navigation, route: { params: { services, providerId } } }) => {

	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [selectedEmps, setSelectedEmps] = useState({});
	const [bottomSheetData, setBottomSheetData] = useState({ data: [], currentSerId: -1 });
	const [date, setDate] = useState(new Date());
	const [app, setApp] = useState({});

	const bottomSheetRef = useRef(null);
	const confirmBSRef = useRef(null);
	const t = useTranslation();
	const styles = useThemedStyle(styleCreator);
	const { width } = useWindowDimensions();


	const onAppPress = (app) => {
		setApp(app);
		confirmBSRef?.current.present();
	};


	useEffect(() => {

		setLoading(true);

		let finish = true;

		Http.get('/appointments/free/', {
			s: services,
			emps: services.map(s => selectedEmps[s]?.id || -1),
			p: providerId,
			d: DateUtils.dateToString(date),
		}).then(resp => {
			if (finish)
				setData(resp);
		}).finally(() => setLoading(false));

		return () => finish = false;
	}, [selectedEmps, date]);

	useEffect(() => {
		return () => setLoading(false);
	}, []);

	if (!data)
		return null;

	return (
		<Screen loading={loading}>

			<XFieldDatePicker
				fieldStyle={styles.datePicker}
				onConfirm={setDate}
			/>

			{
				data.apps.length === 0 ?
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<XText>{data.message || 'No appointments'}</XText>
					</View>
					:
					<ScrollView>
						<View style={{
							flexWrap: 'wrap',
							flexDirection: 'row',
							flex: 1,
							columnGap: FREE_APP_COL_GAP,
							rowGap: 10,
							justifyContent: 'space-around'

						}}>
							{data.apps
								.map(a => <FreeAppIntem app={a} key={a.id} onPress={onAppPress} />)
								.concat(getEmptyApps(data.apps.length, width))
							}

						</View>
					</ScrollView>
			}

			<View style={{
				rowGap: 3,
				marginTop: 10
			}}>
				{data.serEmps.map(({ ser, emps }) => (
					<XSelectField
						title={ser.name}
						value={selectedEmps[ser.id]?.name || t('First free')}
						key={ser.id}
						onPress={() => {
							const employees = emps
								.map(e => ({
									id: e.id,
									title: e.firstName + ' ' + e.lastName,
									serviceId: ser.id
								}));

							setBottomSheetData({
								currentSerId: ser.id,
								data: [{
									id: -1,
									title: t('First free'),
									serviceId: ser.id
								}].concat(employees)
							});

							bottomSheetRef.current?.present()
						}}
					/>
				))}
			</View>

			<XBottomSheetSelector
				ref={bottomSheetRef}
				data={bottomSheetData.data}
				selectedId={selectedEmps[bottomSheetData.currentSerId]?.id || -1}
				title={'Select employee'}
				onItemSelect={({ id, serviceId, title }) => {
					setSelectedEmps(curr => ({
						...curr,
						[serviceId]: { id, name: title }
					}));
				}}
			/>

			<XBottomSheetModal
				snapPoints={['75%']}
				ref={confirmBSRef}
			>
				<FreeAppointmentDetails navigation={navigation} app={app} />
			</XBottomSheetModal>
		</Screen>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	datePicker: {
		marginBottom: 10
	},
	freeAppointment: {
		borderRadius: Theme.values.borderRadius,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		flexDirection: 'row',
		width: FREE_APP_WIDTH,
		height: 40
	}
});

export default FreeAppointmentsScreen;