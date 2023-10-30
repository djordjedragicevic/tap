import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { useCallback, useMemo, useState } from "react";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import { FlatList, StyleSheet, View } from "react-native";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import XButton from "xapp/src/components/basic/XButton";
import { Theme } from "xapp/src/style/themes";
import XSegmentedButton from "xapp/src/components/basic/XSegmentedButton";
import XSection from "xapp/src/components/basic/XSection";
import XAlert from "xapp/src/components/basic/XAlert";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import XChip from "xapp/src/components/basic/XChip";
import XIcon from "xapp/src/components/basic/XIcon";

const groupLinked = (apps = []) => {
	const g = {};
	const newApps = [];
	apps.forEach(a => {
		if (a.joinId) {
			if (!g[a.joinId]) {
				g[a.joinId] = [];
				newApps.push(g[a.joinId]);
			}
			g[a.joinId].push(a);
		}
		else
			newApps.push(a);
	});

	return newApps;
};

const STATUS = {
	WAITING: 'WAITING',
	CANCELED: 'CANCELED',
	ACCEPTED: 'ACCEPTED',
	REJECTED: 'REJECTED'
};

const ICON = {
	WAITING: 'clockcircleo',
	CANCELED: 'closecircleo',
	ACCEPTED: 'checkcircleo',
	REJECTED: 'warning'
};

const COLORS = {
	WAITING: Theme.vars.yellow,
	CANCELED: Theme.vars.blue,
	ACCEPTED: Theme.vars.green,
	REJECTED: Theme.vars.red
};

const getStatus = (apps) => {
	if (!Array.isArray(apps))
		return apps.status;
	if (apps.filter(a => a.status === STATUS.ACCEPTED).length === apps.length)
		return STATUS.ACCEPTED;
	else if (apps.filter(a => a.status === STATUS.REJECTED).length > 0)
		return STATUS.REJECTED;
	else if (apps.filter(a => a.status === STATUS.CANCELED).length > 0)
		return STATUS.CANCELED;
	else
		return STATUS.WAITING;

};

const AppService = ({ item }) => {
	return (
		<View style={{ flexDirection: 'row', columnGap: 5 }}>
			<XText>{item.sTime}</XText>
			<XText>{item.service.name}</XText>
			<XText secondary>{item.employee.name}</XText>
		</View>
	)
};




const Appointment = ({ item, reload }) => {

	const isMulti = Array.isArray(item);
	const t = useTranslation();

	const [price, provider, isHistory, itemIds, status, sDate, sTime] = useMemo(() => {
		const price = isMulti ?
			item.map(i => i.service.price).reduce((a, curr) => a + curr)
			:
			item.service.price;

		return [
			price,
			(isMulti ? item[0] : item).provider,
			isMulti ? item[0].history : item.history,
			isMulti ? item.map(i => i.id) : [item.id],
			getStatus(item),
			(isMulti ? item[0] : item).sDate,
			(isMulti ? item[0] : item).sTime
		];

	}, [item, reload]);

	const statusColor = useColor(COLORS[status]);

	const styles = useThemedStyle(styleCreator);

	const ActButton = useMemo(() => {
		switch (status) {
			case STATUS.WAITING:
			case STATUS.ACCEPTED:
				return (
					<XButton
						title={t('Cancel')}
						secondary
						small
						onPress={() => {
							XAlert.show(t('Reject appointment'), t('reject_appointment_msg'), [
								{ text: t('Quit') },
								{
									text: t('Reject appointment'), onPress: () => {
										Http.post('/appointments/my-appointments/cancel', { appIds: itemIds })
											.then(reload)
									}
								}
							])
						}}
					/>
				);

			case STATUS.CANCELED:
				return (
					<XButton
						title='Ponovo zakazi'
						small
						primary
						uppercase={true}
						onPress={() => {
							XAlert.show('Otkazivanje rezervacije', 'Da li ste sigurni da zelite da otkazete rezervaciju', [
								{ text: 'Odustani' },
								{
									text: 'Zakazi', onPress: () => {
										Http.post('/appointments/my-appointments/rebook', { appIds: itemIds })
											.finally(reload)
									}
								}
							])
						}}
					/>
				);

			default:
				return null;
		}
	}, [status, reload])


	return (
		<XSection
			style={styles.appContainer}
			styleContent={styles.appContent}
			title={`${sDate} - ${sTime}`}
			titleRight={(
				<XChip
					text={status}
					color={isHistory ? Theme.vars.gray : COLORS[status]}
					icon={<XIcon color={isHistory ? undefined : statusColor} icon={ICON[status]} size={16} />}
					textStyle={{ textTransform: 'capitalize' }}
				/>
			)}
			styleTitle={styles.appTitle}
		>
			<View style={{ flexDirection: 'row', columnGap: 10 }}>
				<XText bold style={{ flex: 1 }}>{provider.name} - {provider.type}</XText>
			</View>

			<View style={{ marginVertical: 10 }}>
				<View style={{ flex: 1, paddingVertical: 5 }}>
					{isMulti ?
						<View>{item.map(i => <AppService key={i.id} item={i} />)}</View>
						:
						<AppService item={item} />
					}
				</View>
			</View>

			<View style={{ flexDirection: 'row' }}>
				<View style={{ flex: 1 }} />
				{!isHistory && ActButton}
				{/* <XText>{CurrencyUtils.convert(price)}</XText> */}
			</View>
		</XSection >
	)
};

const MyAppointmentsScreen = () => {

	const [history, setHistory] = useState(false);

	const dateCode = useDateCode();
	const t = useTranslation();
	const [data, refresh, refreshing] = useHTTPGet('/appointments/my-appointments');

	const itemRenderer = useCallback((param) => (
		<Appointment
			item={param.item}
			reload={refresh}
		/>
	), [refresh]);

	const apps = useMemo(() => {
		if (data?.historyApps) {
			data.historyApps.forEach(h => h.history = true);

			data.historyApps.concat(data.comingApps).forEach(a => {
				const date = new Date(a.start)
				a.sTime = date.toLocaleTimeString(dateCode, { hour: '2-digit', minute: '2-digit', hour12: false });
				a.sDate = date.toLocaleDateString(dateCode, { day: 'numeric', month: 'long', year: 'numeric' });
			});
		}
		return groupLinked(data?.[history ? 'historyApps' : 'comingApps'])
	}, [data, history, dateCode]);

	return (
		<XScreen loading={refreshing} flat>

			<XSegmentedButton
				options={[
					{ id: 1, text: t('Upcoming') },
					{ id: 2, text: t('History') }
				]}
				onSelect={(o) => setHistory(o.id === 2)}
				style={{
					borderRadius: 0,
					borderEndWidth: 0,
					borderStartWidth: 0
				}}
				initialIndex={0}
			/>


			<FlatList
				data={apps}
				renderItem={itemRenderer}
				keyExtractor={(item) => Array.isArray(item) ? item[0].joinId : item.id}
				ListEmptyComponent={(<View><XText>NEMA</XText></View>)}
				contentContainerStyle={{
					rowGap: Theme.values.mainPaddingHorizontal,
					padding: Theme.values.mainPaddingHorizontal
				}}
				refreshing={refreshing}
				onRefresh={refresh}
			/>
		</XScreen>
	)
};

const styleCreator = (theme) => StyleSheet.create({
	appTitle: {
		backgroundColor: theme.colors.backgroundElement,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderColor: theme.colors.borderColor
	},
	appContainer: {
		borderWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor,
	},
	appContent: {
		padding: 10,
	}
})

export default MyAppointmentsScreen;