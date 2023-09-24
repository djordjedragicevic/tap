
import XText from "xapp/src/components/basic/XText";
import XButton from "xapp/src/components/basic/XButton";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import XSection from "xapp/src/components/basic/XSection";
import { Animated, Pressable, SectionList, StyleSheet, View } from "react-native"
import { CurrencyUtils, emptyFn } from 'xapp/src/common/utils';
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { HOST } from "../common/config";
import { Image } from "expo-image";
import XChip from "xapp/src/components/basic/XChip";
import { SafeAreaView } from "react-native-safe-area-context";
import XCheckBox from "xapp/src/components/basic/XCheckBox";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import { Theme } from "xapp/src/style/themes";
import HairSalon from "../components/svg/HairSalon";
import FavoriteButton from "../components/FavoriteButton";
import { storeDispatch, useStore } from "xapp/src/store/store";
import { FREE_APPOINTMENTS_SCREEN } from "../navigators/routes";
import { AntDesign } from '@expo/vector-icons';
import Footer from "../components/Footer";



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
	const sMap = {};

	const gMap = {};

	sers.forEach(ser => {
		sMap[ser.id] = ser;
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
		categoryList: catList,
		sMap
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

	const tStyles = useThemedStyle(serviceItemSC);
	const t = useTranslation();

	const onItemPress = () => {
		onPress(id);
	};

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

	const [provider] = useHTTPGet(`/provider/${providerId}`, undefined, lastP[providerId]);
	lastP[providerId] = provider;

	const [selected, setSelected] = useState([]);
	const [selectedCatIdx, setSelectedCatIdx] = useState(0);

	const services = useMemo(() => groupServices(provider?.services), [provider]);
	const hasCats = services?.categoryList.length > 1;

	const fProviders = useStore(st => st.user.state.favoriteProviders);
	const userId = useStore(st => st.user.id);

	const styles = useThemedStyle(providerStyle);

	const isFavorite = fProviders && fProviders.indexOf(providerId) > -1;

	const priceSum = selected.map(sId => services.sMap[sId].price).reduce((accumulator, price) => accumulator + price, 0);


	const onFPress = () => {
		const { state: { favoriteProviders } } = storeDispatch(`user.favorite_${!isFavorite ? 'add' : 'remove'}`, providerId);
		Http.post(`/user/${userId}/state`, { favoriteProviders });
	};

	useEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => <FavoriteButton color={tintColor} favorit={isFavorite} onPress={onFPress} />
		});
	}, [onFPress]);


	const bookBtnRightIcon = useCallback((color, size) => <AntDesign color={color} size={size} name="arrowright" />, []);


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


	if (!provider)
		return null


	return (
		<SafeAreaView style={{ flex: 1 }}>
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



			<View style={{ flex: 1 }}>
				{
					hasCats &&
					<View style={{ padding: 5 }}>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{services?.categoryList.map((c, idx) => (
								<Pressable
									onPress={() => setSelectedCatIdx(idx)}
									key={c.id}
									style={[styles.category, idx === selectedCatIdx ? styles.categorySelected : {}]}
								>
									<XText>{c.name}</XText>
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

			<Footer>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					{
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<XText light>{selected.length || '-'} servisa</XText>
							<XText size={16} bold light>{priceSum ? CurrencyUtils.convert(priceSum) : '-'}</XText>
						</View>
					}
				</View>

				<XButton
					title={t('Find appointment')}
					primary
					disabled={selected.length === 0}
					style={{ margin: 5, flex: 1 }}
					onPress={() => navigation.navigate(FREE_APPOINTMENTS_SCREEN, { services: [...selected], providerId })}
					iconRight={bookBtnRightIcon}
				/>
			</Footer>

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
	},
	category: {
		backgroundColor: theme.colors.backgroundElement,
		borderRadius: Theme.values.borderRadius,
		padding: 8,
		marginRight: 5,
		borderColor: theme.colors.backgroundElement,
		borderWidth: Theme.values.borderWidth
	},
	categorySelected: {
		backgroundColor: theme.colors.primary,

	}
});


export default ProviderScreen;