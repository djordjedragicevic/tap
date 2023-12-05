import XScreen from "xapp/src/components/XScreen";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XAlert from "xapp/src/components/basic/XAlert";
import XButton from "xapp/src/components/basic/XButton";
import { Http } from "xapp/src/common/Http";
import { DateUtils } from "xapp/src/common/utils";
import { MAIN_TAB_APPOINTMENTS } from "../navigators/routes";
import { Theme } from "xapp/src/style/themes";
import TimeRange from "../components/TimeRange";

const CreatePeriodScreen = ({ navigation, route }) => {
	const t = useTranslation();

	const [comment, setComment] = useState();
	const [fromDate, setFromDate] = useState(DateUtils.roundTo30Min(new Date()));
	const [toDate, setToDate] = useState(new Date(fromDate.getTime() + (15 * 60 * 1000)));

	const createPeriod = () => {


		if (((toDate - fromDate) * 60000) < 1) {
			XAlert.show(
				t("Invalid time period"),
				t("Duration of time period must be at least one minute")
			);
		}
		else {
			XAlert.showYesNo(t("Create time period"), t("Are you surre you want to create new time period?"), [
				true,
				{
					onPress: () => {
						Http.post(`/custom-periods/lock`, {
							comment,
							start: DateUtils.dateToString(fromDate),
							end: DateUtils.dateToString(toDate)
						}).then(() => {
							navigation.navigate(MAIN_TAB_APPOINTMENTS, { reload: true });
						});
					}
				}
			]);
		}
	};

	return (
		<XScreen scroll>
			<View style={{ rowGap: 15, paddingBottom: 10 }}>

				<TimeRange
					fromDate={fromDate}
					toDate={toDate}
					onFromChange={setFromDate}
					onToChange={setToDate}
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