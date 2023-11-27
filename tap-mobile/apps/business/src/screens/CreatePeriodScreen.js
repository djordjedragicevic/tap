import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import XTextInput from "xapp/src/components/basic/XTextInput";
import XSelectField from "xapp/src/components/basic/XSelectField";
import { useMemo, useState } from "react";
import { Pressable, View, StyleSheet, FlatList } from "react-native";
import XSection from "xapp/src/components/basic/XSection";
import { useDateCode } from "xapp/src/i18n/I18nContext";
import XAlert from "xapp/src/components/basic/XAlert";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XButton from "xapp/src/components/basic/XButton";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import { DateUtils } from "xapp/src/common/utils";
import { MAIN_TAB_APPOINTMENTS } from "../navigators/routes";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import XBottomSheetSelector from "xapp/src/components/basic/XBottomSheetSelector";


const CreatePeriodScreen = ({ navigation, route }) => {
	const dateCode = useDateCode();
	const styles = useThemedStyle(styleCreator);
	const cGreen = useColor('green');
	const cRed = useColor('red');

	const initDate = useMemo(() => DateUtils.roundTo30Min(new Date()), []);

	const [fromDate, setFromDate] = useState(new Date(initDate.getTime()));
	const [fromTime, setFromTime] = useState(new Date(initDate.getTime() + (selectedServices?.map(s => s.duration).reduce((prev, curr) => prev + curr, 0) || 0) * 60 * 1000));
	const [toDate, setToDate] = useState(new Date(initDate.getTime()));
	const [toTime, setToTime] = useState(new Date(initDate.getTime() + (15 * 60 * 1000)));

	const [fromDateVisible, setFromDateVisible] = useState(false);
	const [fromTimeVisible, setFromTimeVisible] = useState(false);
	const [toDateVisible, setToDateVisible] = useState(false);
	const [toTimeVisible, setToTimeVisible] = useState(false);


	const [comment, setComment] = useState('');

	const [selectedServices, setSelectedServices] = useState([]);
	const [serviceSelectVisible, setServiceSelectVisible] = useState(false);

	const toDateCalc = useMemo(() => {
		return new Date(fromTime.getTime() + (selectedServices?.map(s => s.duration).reduce((prev, curr) => prev + curr, 0) || 0) * 60 * 1000);
	}, [selectedServices, fromTime]);

	const pId = route.params.pId;


	const [services] = useHTTPGet(
		`/provider/${pId}/services`,
		null,
		[],
		true,
		resp => resp.map(r => ({ ...r, title: '#' + r.id + ': ' + r.name + (r.gName ? ' ('.concat(r.gName, ')') : '') }))
	);


	const createPeriod = () => {
		const start = fromDate;
		fromDate.setHours(fromTime.getHours());
		fromDate.setMinutes(fromTime.getMinutes());
		fromDate.setSeconds(0);
		fromDate.setMilliseconds(0);

		const end = toDate;
		toDate.setHours(toTime.getHours());
		toDate.setMinutes(toTime.getMinutes());
		toDate.setSeconds(0);
		toDate.setMilliseconds(0);

		XAlert.showYesNo("Kreiraj vremenski period", "Da li ste sigurni da želite kreirati novi vremenski period?", [
			true,
			{
				onPress: () => {
					Http.post(`/manual-periods/busy-period/${pId}`, {
						comment,
						start: DateUtils.dateToString(start),
						end: DateUtils.dateToString(end)
					})
						.then(() => {
							navigation.navigate(MAIN_TAB_APPOINTMENTS, { reload: true });
						});
				}
			}
		]);
	};

	return (
		<XScreen scroll>
			<View style={{ rowGap: 15, paddingBottom: 10 }}>
				<XSection title={'Vrijeme'}>
					<XFieldContainer
						iconLeft={'clockcircleo'}
						styleCenterContainer={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<Pressable onPress={() => setFromDateVisible(true)}>
							<XText>{fromDate.toLocaleDateString(dateCode, { year: 'numeric', month: 'short', weekday: 'short', day: '2-digit' })}</XText>
						</Pressable>
						<Pressable onPress={() => setFromTimeVisible(true)}>
							<XText>{fromTime.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}</XText>
						</Pressable>
					</XFieldContainer>

					<XFieldContainer
						iconLeft={'clockcircleo'}
						disabled
						styleCenterContainer={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<Pressable onPress={() => setToDateVisible(true)}>
							<XText>{toDateCalc.toLocaleDateString(dateCode, { year: 'numeric', month: 'short', weekday: 'short', day: '2-digit' })}</XText>
						</Pressable>
						<Pressable onPress={() => setToTimeVisible(true)}>
							<XText>{toDateCalc.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}</XText>
						</Pressable>
					</XFieldContainer>


					<DateTimePickerModal
						isVisible={fromDateVisible}
						mode="date"
						date={fromDate}
						minimumDate={fromDate}
						onConfirm={(d) => {
							setFromDateVisible(false);
							setFromDate(d);
							if (d > toDate)
								setToDate(new Date(d.getTime()));
						}}
						onCancel={() => setFromDateVisible(false)}
						onHide={() => setFromDateVisible(false)}
					/>
					<DateTimePickerModal
						isVisible={fromTimeVisible}
						mode="time"
						date={fromTime}
						is24Hour={true}
						onConfirm={(d) => {
							setFromTimeVisible(false);
							setFromTime(d);
							setToTime(new Date(d.getTime() + (15 * 60 * 1000)))
						}}
						onCancel={() => setFromTimeVisible(false)}
						onHide={() => setFromTimeVisible(false)}
					/>
					<DateTimePickerModal
						isVisible={toDateVisible}
						mode="date"
						date={toDate}
						minimumDate={new Date()}
						onConfirm={(d) => {
							setToDateVisible(false);
							setToDate(d);
						}}
						onCancel={() => setToDateVisible(false)}
						onHide={() => setToDateVisible(false)}
					/>
					<DateTimePickerModal
						isVisible={toTimeVisible}
						mode="time"
						date={toTime}
						is24Hour={true}
						onConfirm={(d) => {
							setToTimeVisible(false);
							setToTime(d);
						}}
						onCancel={() => setToTimeVisible(false)}
						onHide={() => setToTimeVisible(false)}
					/>
				</XSection>


				<XSection
					title={'Servisi'}
					styleTitle={{
						backgroundColor: 'white',
						borderBottomWidth: 1,
						borderColor: 'lightgray',
						height: 45
					}}
					styleContent={{ minHeight: 45 }}
					titleRight={(
						<XButtonIcon
							size={28}
							backgroundColor={cGreen}
							icon={'plus'}
							onPress={() => setServiceSelectVisible(true)}
						/>
					)}
				>
					{
						selectedServices?.map(s => (
							<View key={s.id} style={styles.servicesItem}>
								<View flex={1}>
									<XText oneLine>{s.title}</XText>
								</View>
								<XButtonIcon
									color={cRed}
									size={30}
									icon={'close'}
									onPress={() => {
										setSelectedServices(old => old.filter(i => i.id != s.id))
									}}
								/>
							</View>
						))
					}
				</XSection>


				<XBottomSheetSelector
					visible={serviceSelectVisible}
					setVisible={setServiceSelectVisible}
					title={'Services'}
					data={services}
					multiselect
					closeOnSelect={false}
					selected={selectedServices}
					onItemSelect={setSelectedServices}
				/>

				<XTextInput
					title='Comment'
					fieldStyle={{ flex: 1, textAlignVertical: 'top', paddingVertical: 10 }}
					fieldContainerStyle={{ height: 100 }}
					value={comment}
					multiline
					clearable
					onClear={() => setComment('')}
					onChangeText={setComment}
				/>

				<XButton
					title={'Kreiraj'}
					primary
					onPress={createPeriod}
				/>
			</View>
		</XScreen>
	);
};

const styleCreator = (theme) => {
	return StyleSheet.create({
		serviceHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: theme.colors.backgroundElement,
			height: 45,
			borderRadius: Theme.values.borderRadius
		},
		servicesItem: {
			backgroundColor: theme.colors.backgroundElement,
			height: 48,
			padding: 5,
			flexDirection: 'row',
			alignItems: 'center'
		}
	});
};

export default CreatePeriodScreen;