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
import XSeparator from "xapp/src/components/basic/XSeparator";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import { useStore } from "xapp/src/store/store";
import { DateUtils } from "xapp/src/common/utils";
import { MAIN_TAB_APPOINTMENTS } from "../navigators/routes";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import XSelector from "xapp/src/components/basic/XSelector";


const CreatePeriodScreen = ({ navigation, route }) => {
	const dateCode = useDateCode();
	const styles = useThemedStyle(styleCreator);
	const cGreen = useColor('green');

	const initDate = useMemo(() => DateUtils.roundTo30Min(new Date()), []);

	const [fromDate, setFromDate] = useState(new Date(initDate.getTime()));
	const [fromTime, setFromTime] = useState(new Date(initDate.getTime()));
	const [toDate, setToDate] = useState(new Date(initDate.getTime()));
	const [toTime, setToTime] = useState(new Date(initDate.getTime() + (15 * 60 * 1000)));

	const [fromDateVisible, setFromDateVisible] = useState(false);
	const [fromTimeVisible, setFromTimeVisible] = useState(false);
	const [toDateVisible, setToDateVisible] = useState(false);
	const [toTimeVisible, setToTimeVisible] = useState(false);


	const [comment, setComment] = useState('');

	const [selectedServices, setSelectedServices] = useState([]);

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
		<XScreen style={{ rowGap: 15, marginHorizontal: 10 }}>
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
					styleCenterContainer={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}
				>
					<Pressable onPress={() => setToDateVisible(true)}>
						<XText>{toDate.toLocaleDateString(dateCode, { year: 'numeric', month: 'short', weekday: 'short', day: '2-digit' })}</XText>
					</Pressable>
					<Pressable onPress={() => setToTimeVisible(true)}>
						<XText>{toTime.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}</XText>
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

			<XSelector
				selector={{
					title: 'Services'
				}}
				data={services}
				multiselect
				closeOnSelect={false}
				selectedId={selectedServices?.map(s => s.id)}
				onItemSelect={setSelectedServices}
			/>


			<XSelectField
				title={'Services'}
				iconRight={() => {
					return (
						<XButtonIcon
							size={25}
							backgroundColor={cGreen}
							icon={'plus'}
							onPress={() => { }}
						/>
					)
				}}
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

			<XButton title={'Kreiraj'} primary onPress={createPeriod} />
		</XScreen>
	);
};

const styleCreator = (theme) => {
	return StyleSheet.create({
		serviceHeader: {
			backgroundColor: theme.colors.backgroundElement,
			height: 45,
			borderRadius: Theme.values.borderRadius
		}
	});
};

export default CreatePeriodScreen;