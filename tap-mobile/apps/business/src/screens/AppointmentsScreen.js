import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import XScreen from "xapp/src/components/XScreen";
import { Http } from 'xapp/src/common/Http';
import { storeDispatch, useStore } from "xapp/src/store/store";
import TimePeriodsPanel from "../components/time-periods/TimePeriodPanel";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import XFieldDatePicker from "xapp/src/components/basic/XFieldDataPicker";
import { CurrencyUtils, DateUtils, emptyFn, getInitials } from 'xapp/src/common/utils';
import XText from "xapp/src/components/basic/XText";
import XAvatar from 'xapp/src/components/basic/XAvatar';
import { Theme } from 'xapp/src/style/themes';
import { useColor, useThemedStyle } from 'xapp/src/style/ThemeContext';
import XButton from 'xapp/src/components/basic/XButton';
import XBottomSheetModal from 'xapp/src/components/basic/XBottomSheetModal';
import XButtonIcon from 'xapp/src/components/basic/XButtonIcon';
import XToolbar from 'xapp/src/components/XToolbar';
import XTextLabels from 'xapp/src/components/XTextLabels';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { PERIOD, STATUS } from '../common/general';
import { CREATE_PERIOD_SCREEN } from '../navigators/routes';


const HOUR_HEIGHT = 60;

const AppointmentsScreen = ({ navigation }) => {

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
		Http.get(`/appointments/${pId}`, { date: date })
			.then(reps => {
				console.log(reps.employees[0].timeline);
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
					startHour={0}
					endHour={23}
					rowHeight={HOUR_HEIGHT}
					items={data?.employees[selectedEmployee.index].timeline}
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