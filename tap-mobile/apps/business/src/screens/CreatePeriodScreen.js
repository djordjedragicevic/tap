import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import XTextInput from "xapp/src/components/basic/XTextInput";
import XSelectField from "xapp/src/components/basic/XSelectField";
import { useMemo, useState } from "react";
import { } from "react-native";
import XSection from "xapp/src/components/basic/XSection";
import { useDateCode } from "xapp/src/i18n/I18nContext";
import XAlert from "xapp/src/components/basic/XAlert";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XButton from "xapp/src/components/basic/XButton";
import { Http } from "xapp/src/common/Http";
import { useStore } from "xapp/src/store/store";
import { DateUtils } from "xapp/src/common/utils";
import { CREATE_PERIOD_SCREEN, MAIN_TAB_APPOINTMENTS } from "../navigators/routes";


const CreatePeriodScreen = ({ navigation }) => {
	const dateCode = useDateCode();

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

	const pId = useStore(gS => gS.provider.id);

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
			<XSection title='From' transparent styleContent={{ flexDirection: 'row', justifyContent: 'space-between', columnGap: 10, padding: 0 }}>
				<XFieldContainer
					flex
					focused={true}
					onPress={() => setFromDateVisible(true)}
				>
					<XText>{fromDate.toLocaleDateString(dateCode)}</XText>
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

				<XFieldContainer
					flex
					onPress={() => setFromTimeVisible(true)}
				>
					<XText>{fromTime.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}</XText>
				</XFieldContainer>
				<DateTimePickerModal
					isVisible={fromTimeVisible}
					mode="time"
					date={fromTime}
					onConfirm={(d) => {
						setFromTimeVisible(false);
						setFromTime(d);
						setToTime(new Date(d.getTime() + (15 * 60 * 1000)))
					}}
					onCancel={() => setFromTimeVisible(false)}
					onHide={() => setFromTimeVisible(false)}
				/>
			</XSection>

			<XSection title='To' transparent styleContent={{ flexDirection: 'row', justifyContent: 'space-between', columnGap: 10, padding: 0 }}>
				<XFieldContainer
					flex
					focused
					onPress={() => setToDateVisible(true)}
				>
					<XText>{toDate.toLocaleDateString(dateCode)}</XText>
				</XFieldContainer>
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

				<XFieldContainer onPress={() => setToTimeVisible(true)} style={{ flex: 1 }}>
					<XText>{toTime.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}</XText>
				</XFieldContainer>
				<DateTimePickerModal
					isVisible={toTimeVisible}
					mode="time"
					date={toTime}
					onConfirm={(d) => {
						setToTimeVisible(false);
						setToTime(d);
					}}
					onCancel={() => setToTimeVisible(false)}
					onHide={() => setToTimeVisible(false)}
				/>
			</XSection>

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
		</XScreen >
	);
}

export default CreatePeriodScreen;