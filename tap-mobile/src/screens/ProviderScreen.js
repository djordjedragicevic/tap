import Screen from "../components/Screen";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { APPOINTMENTS_SCREEN, CALENDAR_SCREEN, MAIN_FREE_APPOINTMENTS } from "../navigators/routes";
import { useCallback, useEffect, useRef, useState } from "react";
import { Http, useHTTPGet } from "../common/Http";
import XSection from "../components/basic/XSection";
import { Animated, FlatList, Pressable, StyleSheet, View } from "react-native";
import { convert } from "../common/currency";
import ListSeparator from "../components/list/ListSeparator";
import { emptyFn } from '../common/utils';
import ListItemBasic from "../components/list/ListItemBasic";
import { useTranslation } from "../i18n/I18nContext";
import { HOST } from "../common/config";
import { Image } from "expo-image";
import XChip from "../components/basic/XChip";
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Header, useHeaderHeight } from "@react-navigation/elements";
import XCheckBox from "../components/basic/XCheckBox";


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

const H_MAX_HEIGHT = 350;

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
			<Pressable
				key={item.id}
				onPress={() => onItemPress(item)}
				style={{ height: 60, flexDirection: 'row', alignItems: 'center' }}
			>
				<View>
					<XCheckBox isChecked={selectedIdx > -1} size={14} />
				</View>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<XText>{item.name}</XText>
				</View>
				<View>
					<XText> {convert(item.price)}</XText>
					<XText> {item.duration + '(min)'}</XText>
				</View>
			</Pressable>
		)
	};

	const offset = useRef(new Animated.Value(0)).current;
	const insets = useSafeAreaInsets();
	const rnHH = useHeaderHeight();

	console.log(insets.top)
	const headerHeight = offset.interpolate({
		inputRange: [0, H_MAX_HEIGHT],
		outputRange: [H_MAX_HEIGHT, 0],
		extrapolate: 'clamp'
	});

	const headerOpacity = offset.interpolate({
		inputRange: [0, H_MAX_HEIGHT],
		outputRange: [0, 1],
		extrapolate: 'clamp'
	});

	const imageOpacity = offset.interpolate({
		inputRange: [0, H_MAX_HEIGHT],
		outputRange: [1, 0],
		extrapolate: 'clamp'
	});

	if (!provider)
		return null

	return (



		<SafeAreaView style={{ flex: 1 }}>
			<Animated.View
				style={{
					//backgroundColor: 'cyan',
					height: headerHeight,
					flex: 1,
					width: '100%',
					top: 0,
					left: 0,
					opacity: 1,
					position: 'absolute',
					zIndex: 2,
					//alignItems: 'center',
					//justifyContent: 'center'
				}}
			>
				<Animated.View style={{ opacity: headerOpacity, position: 'absolute', width: '100%', zIndex: 3 }}>
					<Header title="Kalos" />
				</Animated.View>

				<Animated.View style={{ flex: 1, opacity: imageOpacity }}>

					<Image
						source={`${HOST}${provider.image[0]}`}

						style={{ flex: 1 }}
						contentFit="cover"
					/>
					<XSection style={{ flex: 1, maxHeight: 120 }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

							<XText style={{ fontSize: 30 }}>{provider.name}</XText>

							<XChip style={{ flexDirection: 'row', alignItems: 'center' }}>
								<View style={{ marginEnd: 5 }}>
									<AntDesign name="star" color="yellow" size={18} />
								</View>
								<XText light>4.9</XText>

							</XChip>
						</View>

						<XText secondary style={{ fontSize: 18 }}>{provider.type}</XText>
						<XText secondary style={{ fontSize: 18 }}>{provider.address}</XText>
					</XSection>
				</Animated.View>

			</Animated.View>

			<FlatList
				data={provider.services}
				renderItem={renderItem}
				ItemSeparatorComponent={ListSeparator}
				style={{
					flex: 1,
					zIndex: 1,
					backgroundColor: 'white'
				}}
				contentContainerStyle={{
					paddingTop: H_MAX_HEIGHT,
					paddingHorizontal: 10
				}}
				showsVerticalScrollIndicator={true}
				scrollEventThrottle={16}
				// onScroll={({ nativeEvent: { contentOffset: { x, y } } }) => {
				// 	console.log(y);
				// 	offset -= y
				// }}
				onScroll={Animated.event([
					{
						nativeEvent: {
							contentOffset: {
								y: offset,
							},
						},
					},
				], { useNativeDriver: false })}
			/>

		</SafeAreaView>

	);
};


const staticStyles = StyleSheet.create({
	cardServices: {

	}
})


export default ProviderScreen;