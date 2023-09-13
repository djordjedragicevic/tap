
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Http, useHTTPGet } from "../common/Http";
import XSection from "../components/basic/XSection";
import { Animated, Pressable, SectionList, StyleSheet, View } from "react-native"
import { emptyFn } from '../common/utils';
import { useTranslation } from "../i18n/I18nContext";
import { HOST } from "../common/config";
import { Image } from "expo-image";
import XChip from "../components/basic/XChip";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import XCheckBox from "../components/basic/XCheckBox";
import { useThemedStyle } from "../style/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import { Theme } from "../style/themes";
import HairSalon from "../components/svg/HairSalon";
import FavoriteButton from "../components/FavoriteButton";
import { storeDispatch, useStore } from "../store/store";
import { FREE_APPOINTMENTS_SCREEN } from "../navigators/routes";


const getDurationSum = (items) => {
	let d = 0;
	items.forEach(i => d += i.duration);
	return d;
};

const H_MAX_HEIGHT = 350;

let lastP = {};

const groupServices = (sers) => {

	if (!sers)
		return sers;

	const cats = {};
	const catList = [];

	const gMap = {};

	sers.forEach(ser => {
		const cId = !ser.c_id ? '__default' : ser.c_id;
		if (!cats[cId]) {
			cats[cId] = {
				name: ser.c_name,
				groups: []
			};
			catList.push({
				name: ser.c_name,
				id: cId
			})
		}


		const gId = !ser.g_id ? '__default' : ser.g_id;
		const gMid = gId + cId;
		if (!gMap[gMid]) {
			gMap[gMid] = { data: [] };

			cats[cId].groups.push({
				title: ser.g_name || '__default',
				data: gMap[gMid].data
			});
		}

		gMap[gMid].data.push(ser);

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
		padding: 8,
		elevation: 0,
		borderRadius: 5,
		backgroundColor: theme.colors.backgroundElement,
		flexDirection: 'row',
		minHeight: 55
	}
});


const ProviderScreen = ({ navigation, route }) => {
	const providerId = route.params.id;

	const t = useTranslation();

	const provider = useHTTPGet(`/provider/${providerId}`, undefined, lastP[providerId]);
	lastP[providerId] = provider;

	const [selected, setSelected] = useState([]);
	const [selectedCatIdx, setSelectedCatIdx] = useState(0);

	const services = useMemo(() => groupServices(provider?.services), [provider]);
	const hasCats = services?.categoryList.length > 1;

	const fProviders = useStore(st => st.user.state.favoriteProviders);
	const userId = useStore(st => st.user.id);

	const styles = useThemedStyle(providerStyle);

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

	const renderSectionHeader = useCallback(({ section: { title } }) => {
		return (
			<>
				{
					title !== '__default' &&
					<View style={styles.sHeaderContainer}>
						<XText size={18}>{title}</XText>
					</View>
				}
			</>
		)
	}, [styles]);

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


	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Animated.View
				style={{
					height: H_MAX_HEIGHT,
					flex: 1,
					width: '100%',
					top: 0,
					left: 0,
					opacity: anHeaderOpacity,
					zIndex: 2
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
							<XText light weight={500}>4.9</XText>
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
							{services?.categoryList.map((c, idx) => (
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

				<SectionList
					sections={services.categories[services.categoryList[selectedCatIdx].id].groups}
					renderItem={renderItem}
					renderSectionHeader={renderSectionHeader}
					// style={{
					// 	flex: 1,
					// 	zIndex: 1,
					// 	//marginTop: rnHH
					// }}
					contentContainerStyle={styles.sContentContainerStyle}
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

			<XButton
				title={t('appointments')}
				disabled={selected.length === 0}
				style={{ margin: 5 }}
				onPress={() => navigation.navigate(FREE_APPOINTMENTS_SCREEN, { services: [...selected], providerId })}
			/>

		</SafeAreaView >

	);
};

const providerStyle = (theme) => StyleSheet.create({
	sHeaderContainer: {
		justifyContent: 'flex-end',
		padding: 5,
		backgroundColor: theme.colors.backgroundColor,

	},
	sContentContainerStyle: {
		padding: 5,
		backgroundColor: theme.colors.backgroundColor,
	}
});


export default ProviderScreen;