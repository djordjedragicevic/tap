import { StyleSheet, View } from 'react-native';
import XScreen from "xapp/src/components/XScreen";
import { Http } from 'xapp/src/common/Http';
import { storeDispatch, storeGetValue, useStore } from "xapp/src/store/store";
import TimePeriodsPanel from "../components/time-periods/TimePeriodPanel";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import XFieldDatePicker from "xapp/src/components/basic/XFieldDataPicker";
import { CurrencyUtils, DateUtils, emptyFn, getInitials } from 'xapp/src/common/utils';
import XAvatar from 'xapp/src/components/basic/XAvatar';
import { Theme } from 'xapp/src/style/themes';
import { useColor, useThemedStyle } from 'xapp/src/style/ThemeContext';
import XButton from 'xapp/src/components/basic/XButton';
import XBottomSheetModal from 'xapp/src/components/basic/XBottomSheetModal';
import XToolbar from 'xapp/src/components/XToolbar';
import XTextLabels from 'xapp/src/components/XTextLabels';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { PERIOD, P_TYPE, getFrendlyName, isCustomPeriod, isWaitingAppointment } from '../common/general';
import { APPOINTMENT_SCREEN, CUSTOM_PERIOD_SCREEN } from '../navigators/routes';
import I18nT from 'xapp/src/i18n/i18n';
import XButtonExtend from 'xapp/src/components/basic/XButtonExtend';
import { useIsRoleOwner } from '../store/concreteStores';

const getModalData = (employee, item) => {

	const data = {
		title: I18nT.t(getFrendlyName(item)),
		labels: []
	};

	if (item.name === PERIOD.CLOSE_APPOINTMENT) {
		data.labels = [
			{ label: I18nT.t('Service'), value: item.data.sName },
			{ label: I18nT.t('Employee'), value: employee.name },
			{ label: I18nT.t('From'), value: item.start },
			{ label: I18nT.t('To'), value: item.end },
			{ label: I18nT.t('Duration'), value: DateUtils.formatToHourMin(DateUtils.minToHMin(item.data.sDuration)) },
			{ label: I18nT.t('Price'), value: CurrencyUtils.convert(item.data.sPrice) },
			{ label: I18nT.t('User'), value: item.data.uUsername || item.data.userName || '-' }
		];
	}
	else {
		data.labels = [
			{ label: I18nT.t('Employee'), value: employee.name },
			{ label: I18nT.t('From'), value: item.start },
			{ label: I18nT.t('To'), value: item.end },
			{ label: I18nT.t('Duration'), value: DateUtils.formatToHourMin(DateUtils.timesDiff(item.start, item.end)) }
		];

	}

	if (item.comment) {
		data.labels.push({ label: I18nT.t('Comment'), value: item.comment });
	}

	return data;
}

const AppointmentsCalendarScreen = ({ navigation, route }) => {

	const zoomCoef = useState(2)[0];

	const pId = useStore(gS => gS.user.employee.provider.id);

	const isOwner = useIsRoleOwner();

	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [loadCount, setLoadCount] = useState(1);
	const [date, setDate] = useState(new Date());

	const [selectedEmpIdx, setSelectedEmpIdx] = useState(0);

	const [selectedPeriod, setSelectedPeriod] = useState();
	const redColor = useColor('red');
	const t = useTranslation();

	const styles = useThemedStyle(styleCreator);

	const modalRef = useRef(null);

	useEffect(() => {
		if (route?.params?.reload)
			setLoadCount(old => old + 1);
	}, [route])

	const modalData = useMemo(() => {
		if (selectedPeriod && data) {
			return getModalData(data.employees[selectedEmpIdx], selectedPeriod)
		}
		else
			return {}
	}, [selectedPeriod, data, selectedEmpIdx]);

	const modalButtons = useMemo(() => {
		if (isWaitingAppointment(selectedPeriod))
			return (
				<View style={{ flexDirection: 'row', columnGap: 5 }}>
					<XButton title={I18nT.t('Reject')}
						color={redColor}
						flex
						onPress={() => onAppStateChange(selectedPeriod, 'reject')}
					/>
					<XButton
						title={I18nT.t('Accept')}
						primary
						flex
						onPress={() => onAppStateChange(selectedPeriod, 'accept')}
					/>
				</View>
			)
		else if (selectedPeriod?.name === PERIOD.CLOSE_EMPLOYEE_BUSY) {
			return (
				<View style={{ flexDirection: 'row', columnGap: 5 }}>
					<XButton title={I18nT.t('Delete')}
						color={redColor}
						flex
						onPress={() => { }}
					/>
				</View>
			)
		}

	}, [selectedPeriod, redColor, onAppStateChange]);

	useEffect(() => {
		setLoading(true);
		let finish = true;
		Http.get('/appointment/calendar', { date: DateUtils.dateToString(date) })
			.then(resp => {
				if (finish) {
					const eId = storeGetValue(gS => gS.user.employee.id);
					if (isOwner && resp.employees?.length > 1) {
						const eIdx = resp.employees.findIndex(e => e.employeeId === eId);
						const e = { ...resp.employees[eIdx] };
						e.name = I18nT.t('Me');
						resp.employees.splice(1, eIdx);
						resp.employees.unshift(e);
					}
					setData(resp);
				}
			})
			.catch(emptyFn)
			.finally(setLoading)
		return () => finish = false;
	}, [date, loadCount, setData, setLoading]);


	const onItemPress = useCallback((item) => {
		if (isCustomPeriod(item)) {
			navigation.navigate(CUSTOM_PERIOD_SCREEN, { id: item.id });
		}
		else {
			setSelectedPeriod(item);
			modalRef?.current?.present();
		}
	}, [setSelectedPeriod, modalRef, navigation]);

	const renderAvatar = useCallback((item) => {
		return (
			<XAvatar
				imgPath={item.imagePath}
				initials={getInitials(null, null, item.name)}
				size={25}
			/>
		)
	}, []);

	const onAppStateChange = useCallback((item, state) => {
		storeDispatch('app.mask', { maskTransparent: true });
		Http.post(`/appointments/${state}/${item.data.id}/${item.data.sId}`)
			.catch(emptyFn)
			.then(() => {
				setLoadCount(old => old + 1);
				modalRef.current?.close();
				setSelectedPeriod(null);
			})
			.finally(() => {
				storeDispatch('app.mask', false);
			});
	}, [modalRef]);

	const onToolbarChange = useCallback((idx) => {
		setSelectedEmpIdx(idx);
	}, [setSelectedEmpIdx]);

	return (
		<>
			<XScreen flat loading={loading}>
				{
					(isOwner && !!data?.employees?.length) &&
					<XToolbar
						barHeight={45}
						minItemWidth={120}
						initialSelectedIdx={selectedEmpIdx}
						onChange={onToolbarChange}
						items={data?.employees}
						icon={renderAvatar}
					/>
				}
				<XFieldDatePicker
					onConfirm={setDate}
					initDate={date}
				/>

				<TimePeriodsPanel
					refreshing={loading}
					onRefresh={() => setLoadCount(loadCount + 1)}
					zoomCoef={zoomCoef}
					startHour={9}
					endHour={22}
					timeline={data?.employees[selectedEmpIdx].timeline}
					onItemPress={onItemPress}
				/>

				<XButtonExtend
					icon='plus'
					primary
					size={44}
					style={styles.btnPlus}
					options={[
						{
							icon: 'calendar',
							primary: true,
							titleLeft: t('Appointment'),
							onPress: () => navigation.navigate(APPOINTMENT_SCREEN, { pId, eId: data?.employees[selectedEmpIdx].employeeId })
						},
						{
							icon: 'book',
							primary: true,
							titleLeft: t('Period'),
							onPress: () => navigation.navigate(CUSTOM_PERIOD_SCREEN, { pId, eId: data?.employees[selectedEmpIdx].employeeId })
						},
					]}
				/>

			</XScreen>

			<XBottomSheetModal
				title={modalData.title}
				snapPoints={['40%']}
				ref={modalRef}
			>
				<View style={{ flex: 1, padding: 10 }}>
					<XTextLabels items={modalData.labels} />
					{modalButtons}
				</View>
			</XBottomSheetModal>
		</>
	);
};

const styleCreator = (theme) => {
	return StyleSheet.create({
		btnReject: {
			backgroundColor: theme.colors.red,
			flex: 1
		},
		btnRejectText: {
			color: theme.colors.textLight
		},
		btnPlus: {
			position: 'absolute',
			bottom: 10,
			right: 10
		},
		tabItem: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: Theme.values.borderRadius,
			flex: 1
		},
		tabItemSelected: {
			backgroundColor: theme.colors.secondary
		},
		tabText: {
			flex: 1,
			paddingStart: 5
		}
	});
}

export default AppointmentsCalendarScreen;