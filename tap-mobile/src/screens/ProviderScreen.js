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
import { HOST } from "../common/config";
import { Image } from "expo-image";
import XChip from "../components/basic/XChip";
import { AntDesign } from '@expo/vector-icons';


const getDurationSum = (items) => {
	let d = 0;
	items.forEach(i => d += i.duration);
	return d;
};

const ServiceList = () => {

	return (
		<XSection style={{ marginTop: 5, paddingHorizontal: 0, paddingTop: 0 }}>
			<FlatList
				data={provider.services}
				renderItem={renderItem}
				ItemSeparatorComponent={ListSeparator}
				style={{ paddingHorizontal: 20 }}
			/>
		</XSection>
	)
}


const ProviderScreen = ({ navigation, route }) => {
	const providerId = route.params.id;
	const provider = useHTTPGet(`/provider/${providerId}`);
	const t = useTranslation();
	const [selected, setSelected] = useState([]);


	const onItemPress = (item) => {
		const selectedIdx = selected.indexOf(item.id);
		if (selectedIdx > -1) {
			setSelected(old => old.filter(oldId => oldId !== item.id));
		}
		else
			setSelected(old => [...old, item.id])

	}

	const renderItem = ({ item }) => {
		const selectedIdx = selected.indexOf(item.id);
		return (
			<ListItemBasic
				id={item.id}
				selected={selectedIdx > -1}
				onPress={() => onItemPress(item)}
			>
				<XText>{item.name}</XText>
				<XText> {item.duration + '(min)'}</XText>
				<View style={{ flex: 1 }} />
				<XText> {convert(item.price)}</XText>
			</ListItemBasic>
		)
	};

	if (!provider)
		return null

	return (
		<>
			<View style={{ flex: 1, maxHeight: 300, brderWidth: 1 }}>
				<Image
					source={`${HOST}${provider.image}`}
					style={{ flex: 1 }}
					contentFit="cover"
				/>
			</View>

			<View style={{ flex: 1 }}>

				<XSection>

					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

						<XText style={{ fontSize: 32 }}>{provider.name}</XText>

						<XChip style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View style={{ marginEnd: 5 }}>
								<AntDesign name="star" color="yellow" size={18} />
							</View>
							<XText light>4.9</XText>

						</XChip>
					</View>

					<XText secondary style={{ fontSize: 20 }}>{provider.type}</XText>
					<XText secondary style={{ fontSize: 20 }}>{provider.address}</XText>

				</XSection>

				<XSection style={{ marginTop: 5, paddingHorizontal: 0, paddingTop: 0 }}>
					<FlatList
						data={provider.services}
						renderItem={renderItem}
						ItemSeparatorComponent={ListSeparator}
						style={{ paddingHorizontal: 20 }}
					/>
				</XSection>


			</View>
		</>
	);
};


const staticStyles = StyleSheet.create({
	cardServices: {

	}
})


export default ProviderScreen;