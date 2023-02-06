import Screen from "../components/Screen";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { useTranslation } from "../store/I18nContext";
import { APPOINTMENTS_SCREEN, CALENDAR_SCREEN } from "../navigators/routes";
import { useCallback, useEffect, useState } from "react";
import { Http } from "../common/Http";
import XCard from "../components/basic/XCard";
import { FlatList, StyleSheet, View } from "react-native";
import { convert } from "../common/currency";
import ListSeparator from "../components/list/ListSeparator";
import { emptyFn } from '../common/utils';
import ListItemBasic from "../components/list/ListItemBasic";

const Services = ({ services, onItemPress, selectedItems }) => {

	const onPressHandler = useCallback((idx) => onItemPress(services[idx]));

	const renderItem = ({ item, index }) => {
		return (
			<ListItemBasic idx={index} selected={!!selectedItems.find(s => s.id === item.id)} onPress={onPressHandler}>
				<XText>{item.name}</XText>
				<XText> {item.duration + '(min)'}</XText>
				<View style={{ flex: 1 }} />
				<XText> {convert(item.price)}</XText>
			</ListItemBasic>
		)
	};

	if (!Array.isArray(services))
		return;

	return (
		<FlatList
			data={services}
			renderItem={renderItem}
			ItemSeparatorComponent={ListSeparator}
		/>
	)
};

Services.defaultProps = {
	onItemPress: emptyFn,
	selectedItems: []
};

const getDurationSum = (items) => {
	let d = 0;
	items.forEach(i => d += i.duration);
	return d;
};

const CompanyScreen = ({ navigation, route }) => {
	const [company, setCompany] = useState({});

	const [selectedServices, setSelectedServices] = useState([]);

	const t = useTranslation();

	const onServicePress = (service) => {
		setSelectedServices(old => {
			const newS = [...old];
			const exist = newS.findIndex(s => s.id === service.id);
			if (exist > -1)
				newS.splice(exist, 1);
			else
				newS.push(service);
			return newS;
		})
	};

	useEffect(() => {

		navigation.setOptions({
			headerTitle: () => {
				return (
					<>
						<XText style={{ fontSize: 16, fontWeight: '600' }}>{route.params?.companyName}</XText>
						<XText style={{ fontSize: 12 }} secondary>{route.params?.companyTypeName}</XText>
					</>
				)
			}
		});

		let finish = true;
		Http.get("/company/" + route.params.id)
			.then(res => {
				console.log(res);
				if (finish)
					setCompany(res);
			});

		return () => finish = false;
	}, []);

	return (
		<Screen>
			{/* <XCard>
				<XText style={{ fontWeight: '600' }}>{company.name}</XText>
				<XText>{company.typeName}</XText>
			</XCard> */}

			<XCard style={staticStyles.cardServices}>
				<Services services={company.services} selectedItems={selectedServices} onItemPress={onServicePress} />
			</XCard>

			<XButton
				style={{ marginTop: 10 }}
				disabled={!selectedServices || selectedServices?.length === 0}
				title={t('Appointments')}
				onPress={() => navigation.navigate(APPOINTMENTS_SCREEN, { companyId: route.params.id, services: selectedServices.map(s => s.id).join('_') })}
			/>
		</Screen>
	);
};


const staticStyles = StyleSheet.create({
	cardServices: {

	}
})


export default CompanyScreen;