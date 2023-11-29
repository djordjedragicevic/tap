import { Pressable } from "react-native";
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XSection from "xapp/src/components/basic/XSection";
import XText from "xapp/src/components/basic/XText";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { emptyFn } from "xapp/src/common/utils";
import { useState } from "react";
import { useDateCode } from "xapp/src/i18n/I18nContext";

const TimeRange = ({
	fromDate = new Date(),
	toDate = new Date(),
	onFromChange = emptyFn,
	onToChange = emptyFn
}) => {

	const dateCode = useDateCode();

	const [fromDateVisible, setFromDateVisible] = useState(false);
	const [fromTimeVisible, setFromTimeVisible] = useState(false);
	const [toDateVisible, setToDateVisible] = useState(false);
	const [toTimeVisible, setToTimeVisible] = useState(false);

	return (
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
					<XText>{fromDate.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}</XText>
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
					<XText>{toDate.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}</XText>
				</Pressable>
			</XFieldContainer>


			<DateTimePickerModal
				isVisible={fromDateVisible}
				mode="date"
				date={fromDate}
				minimumDate={fromDate}
				onConfirm={(d) => {
					setFromDateVisible(false);
					onFromChange(d);
				}}
				onCancel={() => setFromDateVisible(false)}
				onHide={() => setFromDateVisible(false)}
			/>
			<DateTimePickerModal
				isVisible={fromTimeVisible}
				mode="time"
				date={fromDate}
				is24Hour={true}
				onConfirm={(d) => {
					setFromTimeVisible(false);
					onFromChange(d);
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
					onToChange(d);
				}}
				onCancel={() => setToDateVisible(false)}
				onHide={() => setToDateVisible(false)}
			/>
			<DateTimePickerModal
				isVisible={toTimeVisible}
				mode="time"
				date={toDate}
				is24Hour={true}
				onConfirm={(d) => {
					setToTimeVisible(false);
					onToChange(d);
				}}
				onCancel={() => setToTimeVisible(false)}
				onHide={() => setToTimeVisible(false)}
			/>
		</XSection>
	);
}

export default TimeRange;