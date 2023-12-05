import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import XSection from "xapp/src/components/basic/XSection";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
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
import TimeRange from "../components/TimeRange";

const calculateServicesDuration = (services) => {
	return (services?.map(s => s.duration).reduce((prev, curr) => prev + curr, 0) || 0) * 60 * 1000;
};


const CreateAppointmentsScreen = ({ navigation, route }) => {
	const styles = useThemedStyle(styleCreator);
	const [cGreen, cRed] = useColor(['green', 'red']);
	const t = useTranslation();

	const [comment, setComment] = useState();
	const [user, setUser] = useState();
	const [selectedServices, setSelectedServices] = useState([]);
	const [serviceSelectVisible, setServiceSelectVisible] = useState(false);

	const [fromDate, setFromDate] = useState(DateUtils.roundTo30Min(new Date()));
	const [toDate, setToDate] = useState(new Date(fromDate.getTime() + calculateServicesDuration(selectedServices)));

	useEffect(() => {
		setToDate(new Date(fromDate.getTime() + calculateServicesDuration(selectedServices)));
	}, [selectedServices, fromDate]);

	const [services] = useHTTPGet(
		`/provider/services`,
		null,
		[],
		false,
		resp => resp.map(r => ({ ...r, title: r.name + (r.gName ? ' ('.concat(r.gName, ')') : '') }))
	);


	const createPeriod = () => {

		XAlert.showYesNo(t("Create time period"), t("Are you surre you want to create new time period?"), [
			true,
			{
				onPress: () => {
					Http.post(`/custom-periods/appointment`, {
						comment,
						user,
						services: selectedServices.map(s => s.id),
						start: DateUtils.dateToString(fromDate)
					}).then(() => {
						navigation.navigate(MAIN_TAB_APPOINTMENTS, { reload: true });
					});
				}
			}
		]);
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
									<XText secondary size={12}>{s.duration} {t('min')}</XText>
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
					title={t('User')}
					value={user}
					clearable
					onClear={() => setUser('')}
					onChangeText={setUser}
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

export default CreateAppointmentsScreen;