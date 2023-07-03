import Screen from "../components/Screen";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { APPOINTMENTS_SCREEN, CALENDAR_SCREEN, MAIN_FREE_APPOINTMENTS } from "../navigators/routes";
import { useCallback, useEffect, useState } from "react";
import { Http, useHTTPGet } from "../common/Http";
import XSection from "../components/basic/XSection";
import { FlatList, StyleSheet, View } from "react-native";
import { convert } from "../common/currency";
import ListSeparator from "../components/list/ListSeparator";
import { emptyFn } from '../common/utils';
import ListItemBasic from "../components/list/ListItemBasic";
import { useTranslation } from "../i18n/I18nContext";

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

const ProviderScreen = ({ navigation, route }) => {
	const providerId = route.params.id;
	const provider = useHTTPGet(`/provider/${providerId}`);
	const t = useTranslation();
	
	return (
		<Screen center>
			<XText>{providerId}</XText>
		</Screen>
	);
};


const staticStyles = StyleSheet.create({
	cardServices: {

	}
})


export default ProviderScreen;