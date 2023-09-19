import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Http } from "xapp/src/common/Http";
import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import XSection from "xapp/src/components/basic/XSection";
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import { useEffect, useRef, useState } from "react";
import XBottomSheetSelector from "xapp/src/components/basic/XBottomSheetSelector";
import XSelectField from "xapp/src/components/basic/XSelectField";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XFieldDatePicker from "xapp/src/components/basic/XFieldDataPicker";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import XBottomSheetModal from "xapp/src/components/basic/XBottomSheetModal";
import XButton from "xapp/src/components/basic/XButton";
import { storeDispatch } from "xapp/src/store/store";
import { useLockNavigation } from "../common/useLockNavigation";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";


const FREE_APP_WIDTH = 56;
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
			<XText light>{app.services[0].time}</XText>
		</Pressable>
	)
};

const FreeAppointmentDetails = ({ navigation, app, date }) => {
	const [appProcessing, setAppProcessing] = useState(false);
	useLockNavigation(appProcessing, navigation);

	const bookAppointment = () => {
		Http.post('/appointments/book', app)
			.catch(err => {
				console.log(err)
			})
	};

	return (
		<View style={{ flex: 1, padding: 10 }}>
			<BottomSheetScrollView>
				<View style={{ marginBottom: 10 }}>
					<XText>Start at: {app.services[0]?.time}</XText>
				</View>
				{app.services.map((s, idx) => (
					<XText key={s.joinId + idx}>{`${s.time} - ${s.service.name} - (${s.service.duration})min - ${s.employee.user.firstName}`}</XText>
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
						bookAppointment(app);
						navigation.goBack();
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

	useEffect(() => {

		setLoading(true);

		let finish = true;

		console.log(selectedEmps, services.map(s => selectedEmps[s]?.id || -1));

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

	const onAppPress = (app) => {
		setApp(app);
		confirmBSRef?.current.present();
	};

	if (!data || !Object.keys(data).length)
		return null;

	return (
		<XScreen loading={loading}>

			<XFieldDatePicker
				fieldStyle={styles.datePicker}
				onConfirm={setDate}
				initDate={date}
				preventPast
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

			<XSection transparent
				title={t('Services')}
				style={{ marginTop: 10 }}
				contentStyle={{ rowGap: 3 }}
			>
				{data.serEmps.map(({ ser, emps }) => (
					<XSelectField
						title={ser.name}
						value={selectedEmps[ser.id]?.name || t('First free')}
						key={ser.id}
						onPress={() => {
							const employees = emps
								.map(e => ({
									id: e.id,
									title: e.user.firstName + ' ' + e.user.lastName,
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
			</XSection>

			<XButton title={'BOOK'} style={{ marginVertical: 5 }} />

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
				<FreeAppointmentDetails navigation={navigation} app={app} date={date} />
			</XBottomSheetModal>
		</XScreen >
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