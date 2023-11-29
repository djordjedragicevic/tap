import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import XScreen from "xapp/src/components/XScreen";
import { Http } from 'xapp/src/common/Http';
import { storeDispatch, useStore } from "xapp/src/store/store";
import TimePeriodsPanel from "../components/time-periods/TimePeriodPanel";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import XFieldDatePicker from "xapp/src/components/basic/XFieldDataPicker";
import { CurrencyUtils, DateUtils, emptyFn, getInitials } from 'xapp/src/common/utils';
import XAvatar from 'xapp/src/components/basic/XAvatar';
import { Theme } from 'xapp/src/style/themes';
import { useColor, useThemedStyle } from 'xapp/src/style/ThemeContext';
import XButton from 'xapp/src/components/basic/XButton';
import XBottomSheetModal from 'xapp/src/components/basic/XBottomSheetModal';
import XButtonIcon from 'xapp/src/components/basic/XButtonIcon';
import XToolbar from 'xapp/src/components/XToolbar';
import XTextLabels from 'xapp/src/components/XTextLabels';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { PERIOD, PERIOD_NAME, getFrendlyName, isWaitingAppointment } from '../common/general';
import { CREATE_APPOINTMENT_SCREEN, CREATE_PERIOD_SCREEN } from '../navigators/routes';
import I18n from 'xapp/src/i18n/I18n';
import XButtonExtend from 'xapp/src/components/basic/XButtonExtend';


const HOUR_HEIGHT = 60;

const findOverlapIndex = (tps, idx) => {
	const tP = tps[idx];
	for (let i = idx - 1; i >= 0; i--) {
		if (DateUtils.isTimeBefore(tP.start, tps[i].end))
			return i;
	}
	return -1;
};

const arrangeTimeline = (tl) => {

	const resp = [];
	const groups = {};
	let g = {
		id: '',
		start: '',
		end: '',
		columns: []
	};

	let gIdx = 0;

	let tmpC;
	let tmpOver;
	let tmpOverIdx;

	for (let i = 0, s = tl.length; i < s; i++) {
		tmpC = tl[i];
		tmpOverIdx = findOverlapIndex(tl, i);

		if (tmpOverIdx === -1) {
			g = {
				id: 'g' + (++gIdx),
				start: tmpC.start,
				end: tmpC.end,
				columns: [[tmpC]]
			};
			groups[g.id] = g;
			resp.push(g);
			tmpC._gId = g.id;
		}
		else {
			tmpOver = tl[tmpOverIdx];
			groups[tmpOver._gId].end = tmpC.end;
			tmpC._gId = tmpOver._gId;
			let addedInC = false;
			for (let c of groups[tmpOver._gId].columns) {
				if (!DateUtils.isTimeBefore(tmpC.start, c[c.length - 1].end)) {
					c.push(tmpC);
					addedInC = true;
					break;
				}
			}
			if (!addedInC)
				groups[tmpOver._gId].columns.push([tmpC]);
		}
	}

	return resp;
};

let empsTimeline = {};
const getArrangedTimeline = (emp) => {

	if (emp) {
		if (!emp[emp.employeeId])
			empsTimeline[emp.employeeId] = arrangeTimeline(emp.timeline);

		return empsTimeline[emp.employeeId];
	}
};

const getModalData = (employee, item) => {

	const data = {
		title: I18n.translate(getFrendlyName(item)),
		labels: []
	};

	if (item.name === PERIOD.CLOSE_APPOINTMENT) {
		data.labels = [
			{ label: I18n.translate('Service'), value: item.data.sName },
			{ label: I18n.translate('Employee'), value: employee.name },
			{ label: I18n.translate('From'), value: item.start },
			{ label: I18n.translate('To'), value: item.end },
			{ label: I18n.translate('Duration'), value: DateUtils.formatToHourMin(DateUtils.minToHMin(item.data.sDuration)) },
			{ label: I18n.translate('Price'), value: CurrencyUtils.convert(item.data.sPrice) },
			{ label: I18n.translate('User'), value: item.data.uUsername || item.data.userName || '-' }
		];
	}
	else {
		data.labels = [
			{ label: I18n.translate('Employee'), value: employee.name },
			{ label: I18n.translate('From'), value: item.start },
			{ label: I18n.translate('To'), value: item.end },
			{ label: I18n.translate('Duration'), value: DateUtils.formatToHourMin(DateUtils.timesDiff(item.start, item.end)) }
		];

	}

	if (item.comment) {
		data.labels.push({ label: I18n.translate('Comment'), value: item.comment });
	}

	return data;
}

const AppointmentsScreen = ({ navigation, route }) => {

	const sizeCoef = useState(2)[0];
	const pId = useStore(gS => gS.provider.id);
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

	useEffect(() => {
		setLoading(true);
		let finish = true;
		Http.get(`/appointments/${pId}`, { ...DateUtils.convertToParam(date) })
			.then(reps => {
				empsTimeline = {};
				if (finish) {
					setData(reps);
				}
			})
			.catch(emptyFn)
			.finally(setLoading)
		return () => finish = false;
	}, [date, loadCount, setData, setLoading]);


	const onItemPress = useCallback((item) => {
		setSelectedPeriod(item);
		modalRef?.current?.present();
	}, [setSelectedPeriod, modalRef]);

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
					!!data?.employees?.length &&
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
					sizeCoef={sizeCoef}
					startHour={9}
					endHour={22}
					rowHeight={HOUR_HEIGHT}
					items={data?.employees[selectedEmpIdx].timeline}
					arrangedItems={getArrangedTimeline(data?.employees[selectedEmpIdx])}
					onItemPress={onItemPress}
				/>

				<XButtonExtend
					icon='plus'
					primary
					size={44}
					style={styles.btnPlus}
					options={[
						{ icon: 'calendar', primary: true, titleLeft: t('Appointment'), onPress: () => navigation.navigate(CREATE_APPOINTMENT_SCREEN, { pId, eId: data?.employees[selectedEmpIdx].employeeId }) },
						{ icon: 'book', primary: true, titleLeft: t('Period'), onPress: () => navigation.navigate(CREATE_PERIOD_SCREEN, { pId, eId: data?.employees[selectedEmpIdx].employeeId }) },
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

					{
						isWaitingAppointment(selectedPeriod) &&
						<View style={{ flexDirection: 'row', columnGap: 5 }}>
							<XButton title={t('Reject')}
								color={redColor}
								flex
								onPress={() => onAppStateChange(selectedPeriod, 'reject')}
							/>
							<XButton
								title={t('Accept')}
								primary
								flex
								onPress={() => onAppStateChange(selectedPeriod, 'accept')}
							/>
						</View>
					}
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

export default AppointmentsScreen;