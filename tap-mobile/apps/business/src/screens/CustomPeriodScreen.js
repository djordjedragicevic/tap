import XScreen from "xapp/src/components/XScreen";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XAlert from "xapp/src/components/basic/XAlert";
import XButton from "xapp/src/components/basic/XButton";
import { Http } from "xapp/src/common/Http";
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import { MAIN_TAB_APPOINTMENTS_CALENDAR } from "../navigators/routes";
import { Theme } from "xapp/src/style/themes";
import TimeRangeSelector from "../components/TimeRangeSelector";
import XHeaderButtonDelete from "xapp/src/components/XHeaderButtonDelete";

const CustomPeriodScreen = ({ navigation, route }) => {

	const t = useTranslation();

	const id = route.params?.id;

	const [customPeriod, setCustomPeriod] = useState(() => {
		const s = DateUtils.roundTo30Min(new Date());
		return {
			id: 0,
			start: DateUtils.dateToString(s),
			end: DateUtils.dateToString(new Date(s.getTime() + (15 * 60 * 1000))),
			comment: ''
		}
	});


	useEffect(() => {
		if (id) {
			Http.get(`/custom-period/${id.split('#').pop()}`)
				.then(period => setCustomPeriod(period));
		}
	}, [id]);

	useEffect(() => {
		if (id) {
			navigation.setOptions({
				headerRight: () => <XHeaderButtonDelete onPress={deletePeriod} />
			})
		}
	}, [id, deletePeriod, navigation])

	const addPeriod = () => {

		XAlert.askAdd(() => {
			Http.post('/custom-period/add', customPeriod)
				.then(() => {
					navigation.navigate(MAIN_TAB_APPOINTMENTS_CALENDAR, { reload: true });
				})
				.catch(emptyFn);
		});
	};

	const editPeriod = () => {

		XAlert.askEdit(() => {
			Http.post('/custom-period/edit', customPeriod)
				.then(() => {
					navigation.navigate(MAIN_TAB_APPOINTMENTS_CALENDAR, { reload: true });
				})
				.catch(emptyFn);;
		});
	};

	const deletePeriod = () => {

		XAlert.askDelete(() => {
			Http.delete(`/custom-period/${id.split('#').pop()}`)
				.then(() => {
					navigation.navigate(MAIN_TAB_APPOINTMENTS_CALENDAR, { reload: true });
				})
				.catch(emptyFn);;
		});
	};


	return (
		<XScreen scroll>
			<View style={{ rowGap: 10 }}>

				<TimeRangeSelector
					fromDate={new Date(customPeriod.start)}
					toDate={new Date(customPeriod.end)}
					onFromChange={v => setCustomPeriod(old => ({ ...old, start: DateUtils.dateToString(v) }))}
					onToChange={v => setCustomPeriod(old => ({ ...old, end: DateUtils.dateToString(v) }))}
				/>

				<XTextInput
					title={t('Comment')}
					fieldStyle={{ flex: 1, textAlignVertical: 'top', paddingVertical: 10 }}
					fieldContainerStyle={{ height: 100 }}
					value={customPeriod.comment}
					multiline
					outline
					clearable
					onClear={() => setCustomPeriod(old => ({ ...old, comment: '' }))}
					onChangeText={(c) => setCustomPeriod(old => ({ ...old, comment: c }))}
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

export default CustomPeriodScreen;