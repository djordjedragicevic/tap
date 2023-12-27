import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import XSection from "xapp/src/components/basic/XSection";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XAlert from "xapp/src/components/basic/XAlert";
import XButton from "xapp/src/components/basic/XButton";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import { MAIN_TAB_APPOINTMENTS_CALENDAR } from "../navigators/routes";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import XBottomSheetSelector from "xapp/src/components/basic/XBottomSheetSelector";
import TimeRangeSelector from "../components/TimeRangeSelector";
import XHeaderButtonDelete from "xapp/src/components/XHeaderButtonDelete";

const calculateServicesDuration = (services) => {
	return (services?.map(s => s.duration).reduce((prev, curr) => prev + curr, 0) || 0) * 60 * 1000;
};

const createSTitile = (s) => s.name + (s.gName ? ' ('.concat(s.gName, ')') : '');


const AppointmentScreen = ({ navigation, route }) => {
	const id = route.params?.id;

	const styles = useThemedStyle(styleCreator);
	const [cGreen, cRed] = useColor(['green', 'red']);
	const t = useTranslation();

	const [comment, setComment] = useState();
	const [selectedServices, setSelectedServices] = useState([]);
	const [serviceSelectVisible, setServiceSelectVisible] = useState(false);

	const [fromDate, setFromDate] = useState(DateUtils.roundTo30Min(new Date()));
	const [toDate, setToDate] = useState(new Date(fromDate.getTime() + calculateServicesDuration(selectedServices)));

	useEffect(() => {
		if (id) {
			Http.get(`/appointment/${id.split('#').pop()}`)
				.then(resp => {
					setFromDate(new Date(resp.start));
					setToDate(new Date(resp.end));
					setComment(resp.comment);
					setSelectedServices([{
						id: resp.service.id,
						duration: resp.service.duration,
						title: resp.service.name + (resp.service.group ? (' (' + resp.service.group.name + ')') : '')
					}])
				})
				.catch(emptyFn);
		}
	}, [id]);

	useEffect(() => {
		setToDate(new Date(fromDate.getTime() + calculateServicesDuration(selectedServices)));
	}, [selectedServices, fromDate]);

	useEffect(() => {
		if (id) {
			navigation.setOptions({
				headerRight: () => <XHeaderButtonDelete onPress={deletePeriod} />
			})
		}
	}, [id, deletePeriod, navigation])

	const [services] = useHTTPGet(`/provider/services`, null, [], false,
		resp => resp.map(r => ({ ...r, title: createSTitile(r) }))
	);

	const addPeriod = () => {
		XAlert.askAdd(() => {
			Http.post('/appointment/add', {
				comment,
				services: selectedServices.map(s => s.id),
				start: DateUtils.dateToString(fromDate)
			}).then(() => {
				navigation.navigate(MAIN_TAB_APPOINTMENTS_CALENDAR, { reload: true });
			}).catch(emptyFn);
		});

	};

	const editPeriod = () => {
		XAlert.askEdit(() => {
			Http.post('/appointment/edit', {
				id: id.split('#').pop(),
				comment,
				start: DateUtils.dateToString(fromDate)
			}).then(() => {
				navigation.navigate(MAIN_TAB_APPOINTMENTS_CALENDAR, { reload: true });
			}).catch(emptyFn);
		});
	};

	const deletePeriod = () => {
		XAlert.askDelete(() => {
			Http.delete(`/appointment/delete/${id.split('#').pop()}`)
				.then(() => {
					navigation.navigate(MAIN_TAB_APPOINTMENTS_CALENDAR, { reload: true });
				})
				.catch(emptyFn);
		})
	};

	return (
		<XScreen scroll>
			<View style={{ rowGap: 10 }}>
				<TimeRangeSelector
					fromDate={fromDate}
					toDate={toDate}
					toDisabled
					onFromChange={setFromDate}
					onToChange={setToDate}
				/>

				<XSection
					title={t('Services')}
					styleContent={styles.serviceContainer}
					titleRight={(
						<>
							{
								!id &&
								<XButtonIcon
									size={25}
									backgroundColor={cGreen}
									icon={'plus'}
									onPress={() => setServiceSelectVisible(true)}
								/>
							}
						</>
					)}
				>
					{
						selectedServices?.map((s, idx) => (
							<View key={s.id}>
								<View style={styles.servicesItem}>
									<View flex={1}>
										<XText oneLine>{s.title}</XText>
										<XText secondary size={12}>{s.duration} {t('min')}</XText>
									</View>
									{
										!id &&
										<XButtonIcon
											color={cRed}
											size={28}
											icon={'closecircle'}
											onPress={() => {
												setSelectedServices(old => old.filter(i => i.id != s.id))
											}}
										/>
									}
								</View>

								{idx < selectedServices.length - 1 && <XSeparator margin={10} />}
							</View>
						))
					}
				</XSection>

				<XBottomSheetSelector
					visible={serviceSelectVisible}
					setVisible={setServiceSelectVisible}
					title={t('Services')}
					data={services}
					multiselect
					closeOnSelect={false}
					selected={selectedServices}
					onItemSelect={setSelectedServices}
				/>

				<XTextInput
					title={t('Comment')}
					outline
					fieldStyle={{ flex: 1, textAlignVertical: 'top', paddingVertical: 10 }}
					fieldContainerStyle={{ height: 100 }}
					value={comment}
					multiline
					clearable
					onClear={() => setComment('')}
					onChangeText={setComment}
				/>


				<View style={{ marginTop: 15 }}>
					{
						id != null ?
							<XButton
								iconLeft={'edit'}
								title={t('Edit')}
								flex
								primary
								onPress={editPeriod}
							/>
							:
							<XButton
								iconLeft={'plus'}
								title={t('Add')}
								primary
								onPress={addPeriod}
							/>
					}
				</View>
			</View>
		</XScreen>
	);
};

const styleCreator = (theme) => {
	return StyleSheet.create({
		servicesItem: {
			height: 48,
			padding: 5,
			flexDirection: 'row',
			alignItems: 'center'
		},
		serviceContainer: {
			paddingVertical: 0,
			minHeight: 45,
			borderWidth: Theme.values.borderWidth,
			borderColor: theme.colors.borderColor
		}
	});
};

export default AppointmentScreen;