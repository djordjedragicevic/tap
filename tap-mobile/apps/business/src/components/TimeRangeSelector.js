import { StyleSheet, View } from "react-native";
import XSection from "xapp/src/components/basic/XSection";
import XSelectField from "xapp/src/components/basic/XSelectField";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { emptyFn } from "xapp/src/common/utils";
import { useState } from "react";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";

const TimeRangeSelector = ({
	fromDate = new Date(),
	toDate = new Date(),
	onFromChange = emptyFn,
	onToChange = emptyFn,
	toDisabled
}) => {

	const dateCode = useDateCode();
	const t = useTranslation();

	const [fromDateVisible, setFromDateVisible] = useState(false);
	const [fromTimeVisible, setFromTimeVisible] = useState(false);
	const [toDateVisible, setToDateVisible] = useState(false);
	const [toTimeVisible, setToTimeVisible] = useState(false);

	return (
		<>
			<XSection title={t('Time period')} transparent styleContent={styles.section}>
				<View style={styles.row}>
					<XSelectField
						flex
						iconLeft={'calendar'}
						outline
						value={fromDate.toLocaleDateString(dateCode, { year: 'numeric', month: 'short', weekday: 'short', day: '2-digit' })}
						onPress={() => setFromDateVisible(true)}
					/>

					<XSelectField
						style={styles.time}
						outline
						iconLeft={'clockcircleo'}
						value={fromDate.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}
						onPress={() => setFromTimeVisible(true)}
					/>
				</View>

				<View style={styles.row}>
					<XSelectField
						flex
						iconLeft={'calendar'}
						outline
						disabled={toDisabled}
						value={toDate.toLocaleDateString(dateCode, { year: 'numeric', month: 'short', weekday: 'short', day: '2-digit' })}
						onPress={() => setToDateVisible(true)}
					/>

					<XSelectField
						style={styles.time}
						outline
						disabled={toDisabled}
						iconLeft={'clockcircleo'}
						value={toDate.toLocaleTimeString(dateCode, { hour: "2-digit", minute: '2-digit', hour12: false })}
						onPress={() => setToTimeVisible(true)}
					/>
				</View>
			</XSection>

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
		</>
	);
};

const styles = StyleSheet.create({
	section: {
		rowGap: 5,
		padding: 0
	},
	row: {
		flexDirection: 'row',
		flex: 1,
		columnGap: 5
	},
	time: {
		minWidth: 130
	}
})

export default TimeRangeSelector;