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
import { PERIOD } from '../common/general';
import { CREATE_PERIOD_SCREEN } from '../navigators/routes';


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

const AppointmentsScreen = ({ navigation, route }) => {

	const sizeCoef = useState(2)[0];
	const pId = useStore(gS => gS.provider.id);
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [loadCount, setLoadCount] = useState(1);
	const [date, setDate] = useState(new Date());
	const [selectedEmployee, setSelectedEmployee] = useState({ index: 0 });
	const [selectedPeriod, setSelectedPeriod] = useState();
	const redColor = useColor('red');
	const t = useTranslation();

	const styles = useThemedStyle(styleCreator);

	const modalRef = useRef(null);

	useEffect(() => {
		if (route?.params?.reload)
			setLoadCount(old => old + 1);
	}, [route])

	const [modalLabels, modalTitle] = useMemo(() => {

		if (selectedPeriod) {
			if (selectedPeriod.name === PERIOD.CLOSE_APPOINTMENT) {
				return [
					[
						{ label: t('Service'), value: selectedPeriod.data.sName },
						{ label: t('Employee'), value: selectedEmployee.employee.name },
						{ label: t('From'), value: selectedPeriod.start },
						{ label: t('To'), value: selectedPeriod.end },
						{ label: t('Duration'), value: selectedPeriod.data.sDuration + ' ' + t('min') },
						{ label: t('Price'), value: CurrencyUtils.convert(selectedPeriod.data.sPrice) },
						{ label: t('User'), value: selectedPeriod.data.uUsername }
					],
					t('Appointment')
				];
			}
			else {
				const lbls = [
					{ label: t('Employee'), value: selectedEmployee.employee.name },
					{ label: t('From'), value: selectedPeriod.start },
					{ label: t('To'), value: selectedPeriod.end },
					{ label: t('Duration'), value: DateUtils.timesDiff(selectedPeriod.start, selectedPeriod.end) + ' ' + t('min') }
				];
				if (selectedPeriod.comment)
					lbls.push({ label: t('Note'), value: selectedPeriod.comment });

				return [lbls, t('Break')];
			}
		}
		else {
			return [[], ''];
		}

	}, [selectedPeriod, selectedEmployee, t]);

	useEffect(() => {
		setLoading(true);
		let finish = true;
		Http.get(`/appointments/${pId}`, { ...DateUtils.convertToParam(date) })
			.then(reps => {
				empsTimeline = {};

				if (finish) {
					setData(reps);
					setSelectedEmployee({
						index: 0,
						employee: {
							id: reps.employees[0].employeeId,
							name: reps.employees[0].name,
							imagePath: reps.employees[0].imagePath
						}
					});
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
		setSelectedEmployee({
			index: idx,
			employee: {
				id: data.employees[idx].employeeId,
				name: data.employees[idx].name,
				imagePath: data.employees[idx].imagePath
			}
		});
	}, [data]);

	return (
		<>
			<XScreen flat loading={loading}>
				{
					!!data?.employees?.length &&
					<XToolbar
						barHeight={45}
						minItemWidth={120}
						initialSelectedIdx={selectedEmployee.index}
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
					items={data?.employees[selectedEmployee.index].timeline}
					arrangedItems={getArrangedTimeline(data?.employees[selectedEmployee.index])}
					onItemPress={onItemPress}
				/>
				<XButtonIcon
					icon='plus'
					primary
					size={44}
					style={styles.btnPlus}
					onPress={() => navigation.navigate(CREATE_PERIOD_SCREEN)}
				/>

			</XScreen>

			<XBottomSheetModal
				title={modalTitle}
				snapPoints={['40%']}
				ref={modalRef}
			>
				<View style={{ flex: 1, padding: 10 }}>
					<XTextLabels items={modalLabels} />
					{
						(selectedPeriod?.name === PERIOD.CLOSE_APPOINTMENT)
						&&
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

			</XBottomSheetModal >
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