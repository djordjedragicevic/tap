import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { FlatList, View } from "react-native";
import { useDateCode } from "xapp/src/i18n/I18nContext";
import { CurrencyUtils, DateUtils } from "xapp/src/common/utils";

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
}

const AppService = ({ }) => {
	return (
		<View>

		</View>
	)
};

const Appointment = ({ item }) => {
	const dateCode = useDateCode();
	const start = DateUtils.formatStringToDateTime(item.start, dateCode);
	const price = CurrencyUtils.convert(item.service.price);
	return (
		<View style={{ backgroundColor: 'white' }}>
			<XText>{item.provider.name} - <XText>{item.provider.type}</XText></XText>
			<XText>{start}<XText> {item.service.name}</XText></XText>


		</View>
	)
};

const AppointmentGroup = ({ items }) => {
	return (
		<View style={{ backgroundColor: 'white' }}>
			{items.map(i => (
				<View key={i.id}>
					<XText>{i.service.name}</XText>
				</View>
			))}
		</View>
	)
};

const MyAppointmentsScreen = () => {

	const [history, setHistory] = useState(false);
	const [data, setData] = useState();

	const itemRenderer = useCallback(({ item }) => {
		return (
			<>
				{
					Array.isArray(item) ?
						<AppointmentGroup key={item[0].joinId} items={item} />
						:
						<Appointment key={item.id} item={item} />

				}
			</>
		)
	}, []);

	useFocusEffect(useCallback(() => {
		let finish = true;
		Http.get('/appointments/my-appointments')
			.then(reps => {
				if (finish) {
					setData(reps);
				}
			})
		return () => finish = false;

	}, []));

	const apps = useMemo(() => {
		return groupLinked(data?.[history ? 'historyApps' : 'comingApps'])
	}, [data, history]);

	return (
		<XScreen>
			<FlatList
				data={apps}
				renderItem={itemRenderer}
				ListEmptyComponent={(<View><XText>NEMA</XText></View>)}
				contentContainerStyle={{ rowGap: 5 }}
			/>
		</XScreen>
	)
};

export default MyAppointmentsScreen;