import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import XScreen from "xapp/src/components/XScreen";
import { Http } from 'xapp/src/common/Http';
import { storeDispatch, useStore } from "xapp/src/store/store";
import TimePeriodsPanel from "../components/time-periods/TimePeriodPanel";
import { useCallback, useEffect, useRef, useState } from 'react';
import XFieldDatePicker from "xapp/src/components/basic/XFieldDataPicker";
import { CurrencyUtils, emptyFn, getInitials } from 'xapp/src/common/utils';
import XText from "xapp/src/components/basic/XText";
import XAvatar from 'xapp/src/components/basic/XAvatar';
import { Theme } from 'xapp/src/style/themes';
import { useThemedStyle } from 'xapp/src/style/ThemeContext';
import XButton from 'xapp/src/components/basic/XButton';
import XBottomSheetModal from 'xapp/src/components/basic/XBottomSheetModal';
import XToolbar from 'xapp/src/components/XToolbar';
import XTextLabels from 'xapp/src/components/XTextLabels';
import { useTranslation } from 'xapp/src/i18n/I18nContext';
import { PERIOD, STATUS } from '../common/general';


const HOUR_HEIGHT = 60;


const AppointmentsScreen = () => {

	const sizeCoef = useState(2)[0];
	const pId = useStore(gS => gS.provider.id);
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);
	const [loadCount, setLoadCount] = useState(1);
	//const [date, setDate] = useState(new Date(2023, 10, 2));
	const [date, setDate] = useState(new Date());
	const [selectedEmployeeIdx, setSelectedEmployeeIdx] = useState(0);
	const [modal, setModal] = useState(false);
	const t = useTranslation();

	const styles = useThemedStyle(styleCreator);

	const modalRef = useRef(null);

	useEffect(() => {
		setLoading(true);
		let finish = true;
		Http.get(`/appointments/${pId}`, { date: date })
			.then(reps => {
				if (finish) {
					setData(reps);
				}
			})
			.catch(emptyFn)
			.finally(setLoading)
		return () => finish = false;
	}, [date, loadCount, setData, setLoading]);


	const onItemPress = useCallback((item) => {
		setModal(item);
		modalRef?.current?.present();
	}, [setModal]);

	const renderAvatar = useCallback((item) => {
		return (
			<XAvatar
				imgPath={item.imagePath}
				initials={getInitials(null, null, item.name)}
				size={30}
			/>
		)
	}, []);

	const onAppStateChange = useCallback((item, state) => {
		storeDispatch('app.mask', true);
		Http.post(`/appointments/${state}/${item.data.id}/${item.data.service.id}`)
			.catch(emptyFn)
			.then(() => {
				setLoadCount(old => old + 1);
				modalRef.current?.close();
				setModal(null);
			})
			.finally(() => {
				storeDispatch('app.mask', false);
			});
	}, [modalRef]);


	return (
		<>
			<XScreen flat loading={loading}>
				{
					!!data?.employees?.length &&
					<XToolbar
						barHeight={60}
						tabBarHPadding={8}
						tabBarVPadding={8}
						minItemWidth={120}
						initialSelectedIdx={selectedEmployeeIdx}
						onChange={setSelectedEmployeeIdx}
						items={data?.employees}
						icon={renderAvatar}
					/>
				}
				<XFieldDatePicker
					onConfirm={setDate}
					initDate={date}
				/>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={() => setLoadCount(loadCount + 1)}
						/>
					}
				>
					<TimePeriodsPanel
						sizeCoef={sizeCoef}
						startHour={9}
						endHour={0}
						rowHeight={HOUR_HEIGHT}
						items={data?.employees[selectedEmployeeIdx].timeline}
						style={{ paddingHorizontal: Theme.values.mainPaddingHorizontal }}
						onItemPress={onItemPress}
					/>
				</ScrollView>
			</XScreen>

			<XBottomSheetModal
				snapPoints={['40%']}
				ref={modalRef}
			>

				<View style={{ flex: 1, padding: 10, paddingTop: 5 }}>

					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={{ flex: 1 }}>
							<XText size={22}>Potvrda rezervacije</XText>
						</View>
					</View>


					<View style={{ padding: 10, flex: 1 }}>
						{modal &&
							<XTextLabels
								textSize={16}
								items={[
									{ label: t('Service'), value: modal.data.service.name },
									{ label: t('Employee'), value: modal.data.eName },
									{ label: t('Duration'), value: modal.data.service.duration + ' ' + t('min') },
									{ label: t('Price'), value: CurrencyUtils.convert(modal.data.service.price) },
									{ label: t('User'), value: modal.data.uUsername }
								]}
							/>
						}
					</View >

					<View style={{ flexDirection: 'row', columnGap: 5 }}>
						<XButton title={t('Reject')}
							style={{ flex: 1 }}
							color={Theme.Dark.colors.red}
							onPress={() => onAppStateChange(modal, 'reject')}
						/>
						<XButton
							title={t('Accept')}
							primary
							style={{ flex: 1 }}
							onPress={() => onAppStateChange(modal, 'accept')}
						/>
					</View>
				</View>
			</XBottomSheetModal >
		</>
	);
};

const styleCreator = (theme) => {
	return StyleSheet.create({
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