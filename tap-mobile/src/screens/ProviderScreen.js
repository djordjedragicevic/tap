import Screen from "../components/Screen";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { APPOINTMENTS_SCREEN, CALENDAR_SCREEN, MAIN_FREE_APPOINTMENTS } from "../navigators/routes";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Http, useHTTPGet } from "../common/Http";
import XSection from "../components/basic/XSection";
import { Animated, FlatList, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
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
import { useThemedStyle } from "../style/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import { Theme } from "../style/themes";
import HairSalon from "../components/svg/HairSalon";
import FavoriteButton from "../components/FavoriteButton";
import { storeDispatch, useStore } from "../store/store";


const getDurationSum = (items) => {
	let d = 0;
	items.forEach(i => d += i.duration);
	return d;
};

const H_MAX_HEIGHT = 350;

let lastP = {};

const getSCategories = (services) => {

	if (!services)
		return services;

	const cat = [];
	const sId = {};
	services.forEach(s => {
		if (s.c_name && s.c_id && !sId[s.c_id]) {
			cat.push({ id: s.c_id, name: s.c_name });
			sId[s.c_id] = true;
		}
	})

	return cat;
};

const groupServices = (sers) => {

	if (!sers)
		return sers;

	const cats = {};
	const catList = [];

	sers.forEach(ser => {
		const cId = !ser.c_id ? 'default' : ser.c_id;
		if (!cats[cId]) {
			cats[cId] = {
				name: ser.c_name,
				groups: {}
			};
			catList.push({
				name: ser.c_name,
				id: cId
			})
		}


		const gId = !ser.g_id ? 'default' : ser.g_id;
		if (!cats[cId].groups[gId]) {
			cats[cId].groups[gId] = {
				name: ser.g_name,
				services: []
			};
		}

		cats[cId].groups[gId].services.push(ser);

	});

	return {
		categories: cats,
		categoryList: catList
	};
};

const areSIEqual = (oldProps, newProps) => {
	if (oldProps.id === newProps.id && oldProps.isSelected === newProps.isSelected)
		return true;

	return false;
};

const ServiceItem = memo(({
	onPress = emptyFn,
	isSelected = false,
	name,
	note,
	duration,
	durationTo,
	price,
	id
}) => {

	const [selected, setSelected] = useState(isSelected);
	const tStyles = useThemedStyle(serviceItemSC);
	const t = useTranslation();

	const onItemPress = () => {
		onPress(id);
	};

	console.log("Service ", id)
	const dur = (durationTo ? duration + ' - ' + durationTo : duration) + ' ' + t('minutes')
	return (
		<Pressable
			onPress={onItemPress}
			style={tStyles.container}
		>
			<View style={{ alignSelf: 'center' }}>
				<XCheckBox checked={isSelected} setChecked={onItemPress} size={14} />
			</View>

			<View style={{ flex: 1 }}>
				<View style={{ flex: 1, paddingStart: 5, flexDirection: 'row', alignItems: 'center' }}>

					<View style={{ flex: 1 }}>
						<XText >{name}</XText>
						{note && <XText secondary style={{ fontSize: 12 }}>{note}</XText>}
					</View>

					<View style={{ alignItems: 'flex-end' }}>
						<XText size={16} style={tStyles.price}>{price} KM</XText>
						<XText secondary style={{ fontSize: 12 }}>{dur}</XText>
					</View>
				</View>
			</View>
		</Pressable>
	)
}, areSIEqual);

const serviceItemSC = (theme) => StyleSheet.create({
	price: {
		color: theme.colors.primary
	},
	container: {
		padding: 10,
		elevation: 0,
		borderRadius: 5,
		backgroundColor: theme.colors.backgroundElement,
		flexDirection: 'row',
		minHeight: 60
	}
})


const ProviderScreen = ({ navigation, route }) => {
	const providerId = route.params.id;

	const t = useTranslation();

	const provider = useHTTPGet(`/provider/${providerId}`, undefined, lastP[providerId]);
	lastP[providerId] = provider;

	const [selected, setSelected] = useState([]);
	const [selectedCatIdx, setSelectedCatIdx] = useState(0);

	const groupedServices = useMemo(() => groupServices(provider?.services), [provider]);
	const hasCats = groupedServices?.categoryList.length > 1;

	const fProviders = useStore(st => st.user.state.favoriteProviders);
	const userId = useStore(st => st.user.id);

	const isFavorite = fProviders && fProviders.indexOf(providerId) > -1;


	const onFPress = () => {
		const { state: { favoriteProviders } } = storeDispatch(`user.favorite_${!isFavorite ? 'add' : 'remove'}`, providerId);
		Http.post(`/user/${userId}/state`, { favoriteProviders });
	};

	useEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => <FavoriteButton color={tintColor} favorit={isFavorite} onPress={onFPress} />
		});
	}, [onFPress]);


	const onItemPress = useCallback((itemId) => {
		const selectedIdx = selected.indexOf(itemId);
		if (selectedIdx > -1) {
			setSelected(old => old.filter(oldId => oldId !== itemId));
		}
		else
			setSelected(old => [...old, itemId])

	}, [selected]);

	const renderItem = useCallback(({ item }) => (
		<ServiceItem
			key={item.id}
			onPress={onItemPress}
			isSelected={selected.indexOf(item.id) > -1}
			{...item}
		/>
	), [selected, onItemPress]);

	const offset = useRef(new Animated.Value(0)).current;
	const insets = useSafeAreaInsets();
	const rnHH = useHeaderHeight();

	const anHeaderHeaight = offset.interpolate({
		inputRange: [0, H_MAX_HEIGHT],
		outputRange: [H_MAX_HEIGHT, 0 + rnHH],
		extrapolate: 'clamp'
	});

	const anHeaderOpacity = offset.interpolate({
		inputRange: [0, H_MAX_HEIGHT - rnHH],
		outputRange: [1, 0],
		extrapolate: 'clamp'
	});

	const imageOpacity = offset.interpolate({
		inputRange: [0, H_MAX_HEIGHT],
		outputRange: [1, 0],
		extrapolate: 'clamp'
	});

	if (!provider)
		return null


	const services = hasCats ? groupedServices.categories[groupedServices.categoryList[selectedCatIdx].id].groups['default'].services : provider.services;
	return (

		<SafeAreaView style={{ flex: 1 }}>
			<Animated.View
				style={{
					//backgroundColor: 'cyan',
					height: H_MAX_HEIGHT,
					flex: 1,
					width: '100%',
					top: 0,
					left: 0,
					opacity: anHeaderOpacity,
					//position: 'absolute',
					zIndex: 2,
					//backgroundColor: 'red'
					//alignItems: 'center',
					//justifyContent: 'center'
				}}
			>
				<View style={{ flex: 1 }}>
					{

						provider.image.length ?
							<Image
								source={`${HOST}${provider.image[0]}`}
								cachePolicy={'none'}
								style={{ flex: 1 }}
								contentFit="cover"
							/>
							:
							<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
								<HairSalon height={150} width={150} />
							</View>
					}

				</View>

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

					<XText style={{ fontSize: 18 }}>{provider.type}</XText>
					<XText secondary style={{ fontSize: 18 }}>{provider.address}</XText>
				</XSection>
			</Animated.View>



			<View style={{ flex: 1 }}>
				{
					hasCats &&
					<View style={{ padding: 5 }}>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{groupedServices?.categoryList.map((c, idx) => (
								<Pressable
									onPress={() => setSelectedCatIdx(idx)}
									key={c.id}
									style={{
										backgroundColor: idx === selectedCatIdx ? '#ffe8cc' : 'white',
										borderRadius: Theme.values.borderRadius,
										padding: 8,
										marginRight: 5,
										borderColor: idx === selectedCatIdx ? 'darkorange' : 'white',
										borderWidth: Theme.values.borderWidth
									}}
								>
									<XText style={idx === selectedCatIdx ? { color: 'darkorange' } : {}}>{c.name}</XText>
								</Pressable>
							))}
						</ScrollView>
					</View>
				}

				<FlatList
					data={services}
					renderItem={renderItem}
					ItemSeparatorComponent={<View height={5}></View>}
					style={{
						flex: 1,
						zIndex: 1,
						//marginTop: rnHH
					}}
					contentContainerStyle={{
						//paddingTop: H_MAX_HEIGHT - rnHH,
						padding: 5
					}}
					showsVerticalScrollIndicator={true}
					scrollEventThrottle={16}

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
			</View>

			<XButton style={{}} title={t('appointments')} disabled={selected.length === 0} flat />

		</SafeAreaView >

	);
};


export default ProviderScreen;