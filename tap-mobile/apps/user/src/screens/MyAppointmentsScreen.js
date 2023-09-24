import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import XSeparator from "xapp/src/components/basic/XSeparator";
import { useCallback, useMemo, useState } from "react";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import { FlatList, StyleSheet, View } from "react-native";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import { CurrencyUtils } from "xapp/src/common/utils";
import XButton from "xapp/src/components/basic/XButton";
import { Theme } from "xapp/src/style/themes";
import XSegmentedButton from "xapp/src/components/basic/XSegmentedButton";
import XSection from "xapp/src/components/basic/XSection";
import XAlert from "xapp/src/components/basic/XAlert";
import { usePrimaryColor } from "xapp/src/style/ThemeContext";

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

const COLORS = {
	WAITING: 'gold',
	CANCELED: 'orange',
	ACCEPTED: 'lightgreen',
	REJECTED: 'red'
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
	const pColor = usePrimaryColor();

	const price = isMulti ?
		item.map(i => i.service.price).reduce((a, curr) => a + curr)
		:
		item.service.price;

	const provider = (isMulti ? item[0] : item).provider;

	const status = getStatus(item);


	const getButton = () => {
		if (item.history)
			return null;
		else if (status === STATUS.WAITING)
			return <XButton
				style={{ flex: 1 }}
				title='otkazi'
				color={'red'}
				secondary
				small
				onPress={() => {
					XAlert.show('Otkazivanje rezervacije', 'Da li ste sigurni da zelite da otkazete rezervaciju', [
						{ text: 'Odustani' },
						{
							text: 'Otkazi', onPress: () => {
								Http.post('/appointments/my-appointments/cancel', {
									appIds: isMulti ? item.map(i => i.id) : [item.id]
								})
									.then(resp => {
										reload()
									})
							}
						}
					])
				}}
			/>
		else if (status === STATUS.CANCELED)
			return <XButton
				style={{ flex: 1 }}
				title='Ponovo zakazi'
				small
				onPress={() => {
					XAlert.show('Otkazivanje rezervacije', 'Da li ste sigurni da zelite da otkazete rezervaciju', [
						{ text: 'Odustani' },
						{
							text: 'Zakazi', onPress: () => {
								Http.post('/appointments/my-appointments/rebook', {
									appIds: isMulti ? item.map(i => i.id) : [item.id]
								})
									.then(resp => {
										reload()
									})
							}
						}
					])
				}}
			/>

		else
			return null;
	}


	return (
		<XSection contentStyle={{ padding: 10 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<View style={{}}>
					<XText bold italic>{(isMulti ? item[0] : item).sDate}</XText>
				</View>
				<View style={{
					justifyContent: 'center'
				}}>
					<XText bold style={{ color: COLORS[status] }} >{status}</XText>
				</View>
			</View>

			<XSeparator style={{ marginVertical: 10 }} />

			<View>
				<XText bold style={{ color: pColor }}>{provider.name} - {provider.type}</XText>
			</View>

			<View style={{ marginVertical: 15 }}>
				<View style={{ flex: 1, paddingVertical: 5 }}>
					{isMulti ?
						<View>{item.map(i => <AppService key={i.id} item={i} />)}</View>
						:
						<AppService item={item} />
					}
				</View>
			</View>

			<View style={{ flexDirection: 'row', height: 30 }}>
				{getButton()}
				<View style={{ flex: 1 }} />
				<XText>{CurrencyUtils.convert(price)}</XText>
			</View>
		</XSection>
	)
};

const MyAppointmentsScreen = () => {

	const [history, setHistory] = useState(false);

	const dateCode = useDateCode();
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
				a.sDate = date.toLocaleDateString(dateCode, { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
			});
		}
		return groupLinked(data?.[history ? 'historyApps' : 'comingApps'])
	}, [data, history, dateCode]);

	return (
		<XScreen loading={refreshing}>

			<XSegmentedButton
				options={[
					{ id: 1, text: 'Upcoming' },
					{ id: 2, text: 'Finished' }
				]}
				onSelect={(o) => setHistory(o.id === 2)}
				style={{ margin: 10 }}
				initialIndex={0}
			/>


			<FlatList
				data={apps}
				renderItem={itemRenderer}
				keyExtractor={(item) => Array.isArray(item) ? item[0].joinId : item.id}
				ListEmptyComponent={(<View><XText>NEMA</XText></View>)}
				contentContainerStyle={{
					rowGap: 8,
					marginHorizontal: Theme.values.mainPaddingHorizontal
				}}
				refreshing={refreshing}
				onRefresh={refresh}
			/>
		</XScreen>
	)
};

const styleCreator = (theme) => StyleSheet.create({
	container: {

	}
})

export default MyAppointmentsScreen;